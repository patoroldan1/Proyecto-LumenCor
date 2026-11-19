/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import {
  calculateNextBillingDate,
  convertArsToUsd,
  DEFAULT_USD_ARS_RATE,
  getCardBrandLabel,
} from './src/utils/paymentRules.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const EXCHANGE_RATE = Number(process.env.USD_ARS_EXCHANGE_RATE) || DEFAULT_USD_ARS_RATE;

interface StoredDonationRecord {
  id: string;
  subscriptionId?: string;
  provider: 'card' | 'mercadopago' | 'paypal';
  frequency: 'monthly' | 'one-time';
  status: 'approved' | 'active' | 'cancelled';
  amountArs: number;
  amountUsd?: number;
  hasAutoIncrease: boolean;
  donorName: string;
  donorEmail: string;
  donorDni?: string;
  cardBrand?: string;
  cardLast4?: string;
  cardType?: 'credito' | 'debito';
  nextBillingDate?: string;
  createdAt: string;
}

const subscriptionStore = new Map<string, StoredDonationRecord>();

function getAppBaseUrl(req: Request): string {
  const envUrl = process.env.APP_URL;
  if (envUrl && envUrl !== 'MY_APP_URL' && envUrl.startsWith('http')) {
    return envUrl.replace(/\/+$/, '');
  }
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host') || `localhost:${PORT}`;
  return `${proto}://${host}`;
}

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getPayPalAccessToken(): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) return null;

  const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('No se pudo autenticar con PayPal.');
  }

  const data = (await response.json()) as { access_token?: string };
  return data.access_token || null;
}

function validateBasicDonationBody(body: {
  amountArs?: unknown;
  donor?: { name?: string; email?: string };
  frequency?: string;
  autoIncreaseAccepted?: boolean;
}) {
  const amountArs = Number(body.amountArs);
  if (isNaN(amountArs) || amountArs < 500) {
    return { valid: false, error: 'El monto mínimo para donar es de $500 pesos.' };
  }
  const name = body.donor?.name?.trim() || '';
  const email = body.donor?.email?.trim() || '';
  if (!name) {
    return { valid: false, error: 'Por favor ingresá tu nombre y apellido.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Por favor ingresá un correo electrónico válido.' };
  }
  if (body.frequency === 'monthly' && !body.autoIncreaseAccepted) {
    return {
      valid: false,
      error: 'Para suscripciones mensuales, es necesario autorizar la actualización trimestral del 10%.',
    };
  }
  return { valid: true, amountArs, name, email };
}

function formatDateEsAr(): string {
  return new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function createServer() {
  const app = express();
  app.use(express.json());

  // Configuración pública de donaciones (sin exponer credenciales)
  app.get('/api/donations/config', (_req: Request, res: Response) => {
    res.json({
      currency: 'ARS',
      minAmountArs: 500,
      usdArsRate: EXCHANGE_RATE,
    });
  });

  // 1. PAGO DIRECTO / SUSCRIPCIÓN CON TARJETA DE DÉBITO / CRÉDITO
  app.post('/api/donations/card', async (req: Request, res: Response) => {
    try {
      const check = validateBasicDonationBody(req.body);
      if (!check.valid) {
        res.status(400).json({ ok: false, error: check.error });
        return;
      }

      if (req.body.frequency === 'monthly') {
        res.status(400).json({
          ok: false,
          error:
            'Las suscripciones mensuales se gestionan exclusivamente mediante Mercado Pago o PayPal. Para tarjeta seleccioná Donación Única.',
        });
        return;
      }

      const frequency: 'monthly' | 'one-time' = 'one-time';
      const card = req.body.card || {};
      const last4 = String(card.last4 || '').replace(/\D/g, '').slice(-4);
      const brand = String(card.brand || 'unknown');
      const cardType: 'credito' | 'debito' = card.cardType === 'debito' ? 'debito' : 'credito';
      const holderName = String(card.holderName || '').trim();
      const expiry = String(card.expiry || '').trim();

      if (last4.length !== 4 || !holderName || !/^\d{2}\/\d{2}$/.test(expiry)) {
        res.status(400).json({
          ok: false,
          error: 'Verificá los datos de la tarjeta antes de confirmar el aporte.',
        });
        return;
      }

      const receiptId = `FCE-TC-${crypto.randomInt(100000, 999999)}`;

      // Si existe token de tarjeta generado por Mercado Pago Brick + access token privado, procesar en vivo
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      if (mpToken && card.mpToken) {
        const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${mpToken}`,
            'Content-Type': 'application/json',
            'X-Idempotency-Key': receiptId,
          },
          body: JSON.stringify({
            transaction_amount: check.amountArs,
            token: card.mpToken,
            description: 'Donación Única - Fundación LumenCor',
            installments: 1,
            payment_method_id: brand === 'mastercard' ? 'master' : brand,
            payer: {
              email: check.email,
              identification: req.body.donor?.dni
                ? { type: 'DNI', number: String(req.body.donor.dni).replace(/\D/g, '') }
                : undefined,
            },
          }),
        });

        if (!mpRes.ok) {
          const errPayload = (await mpRes.json().catch(() => ({}))) as { message?: string };
          res.status(400).json({
            ok: false,
            error: errPayload.message || 'El emisor rechazó el cobro de la tarjeta.',
          });
          return;
        }
      }

      const brandLabel = getCardBrandLabel(
        (['visa', 'mastercard', 'amex', 'cabal', 'naranja'].includes(brand)
          ? brand
          : 'unknown') as Parameters<typeof getCardBrandLabel>[0]
      );

      const record: StoredDonationRecord = {
        id: receiptId,
        provider: 'card',
        frequency,
        status: 'approved',
        amountArs: check.amountArs!,
        hasAutoIncrease: false,
        donorName: check.name!,
        donorEmail: check.email!,
        donorDni: req.body.donor?.dni?.trim() || undefined,
        cardBrand: brandLabel,
        cardLast4: last4,
        cardType,
        createdAt: formatDateEsAr(),
      };

      res.json({ ok: true, receipt: record });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'No pudimos procesar el pago con tarjeta en este momento.',
      });
    }
  });

  // 2. MERCADO PAGO: INICIAR DONACIÓN ÚNICA (PREFERENCIA) O SUSCRIPCIÓN MENSUAL (PREAPPROVAL)
  app.post('/api/donations/mercadopago', async (req: Request, res: Response) => {
    try {
      const check = validateBasicDonationBody(req.body);
      if (!check.valid) {
        res.status(400).json({ ok: false, error: check.error });
        return;
      }

      const frequency: 'monthly' | 'one-time' =
        req.body.frequency === 'monthly' ? 'monthly' : 'one-time';
      const baseUrl = getAppBaseUrl(req);
      const mpToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      const simulate = Boolean(req.body.simulate);

      if (mpToken && !simulate) {
        const externalRef = `LMC-MP-${Date.now()}`;
        if (frequency === 'monthly') {
          const mpRes = await fetch('https://api.mercadopago.com/preapproval', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${mpToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reason: 'Suscripción Mensual Solidaria - Fundación LumenCor',
              external_reference: externalRef,
              payer_email: check.email,
              auto_recurring: {
                frequency: 1,
                frequency_type: 'months',
                transaction_amount: check.amountArs,
                currency_id: 'ARS',
              },
              back_url: `${baseUrl}/?section=donar&provider=mercadopago&frequency=monthly&amount=${check.amountArs}`,
              status: 'pending',
            }),
          });

          const data = (await mpRes.json()) as {
            id?: string;
            init_point?: string;
            message?: string;
          };

          if (!mpRes.ok || !data.init_point) {
            res.status(502).json({
              ok: false,
              error: data.message || 'No se pudo generar la suscripción en Mercado Pago.',
            });
            return;
          }

          res.json({
            ok: true,
            mode: 'redirect',
            provider: 'mercadopago',
            frequency,
            externalId: data.id || externalRef,
            checkoutUrl: data.init_point,
            amountArs: check.amountArs,
          });
          return;
        } else {
          const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${mpToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              external_reference: externalRef,
              items: [
                {
                  title: 'Donación Única - Fundación LumenCor',
                  quantity: 1,
                  currency_id: 'ARS',
                  unit_price: check.amountArs,
                },
              ],
              payer: {
                name: check.name,
                email: check.email,
              },
              back_urls: {
                success: `${baseUrl}/?section=donar&provider=mercadopago&frequency=one-time&mp_status=approved&amount=${check.amountArs}`,
                pending: `${baseUrl}/?section=donar&provider=mercadopago&frequency=one-time&mp_status=pending&amount=${check.amountArs}`,
                failure: `${baseUrl}/?section=donar&provider=mercadopago&frequency=one-time&mp_status=failure`,
              },
              auto_return: 'approved',
            }),
          });

          const data = (await mpRes.json()) as {
            id?: string;
            init_point?: string;
            message?: string;
          };

          if (!mpRes.ok || !data.init_point) {
            res.status(502).json({
              ok: false,
              error: data.message || 'No se pudo generar el link de pago en Mercado Pago.',
            });
            return;
          }

          res.json({
            ok: true,
            mode: 'redirect',
            provider: 'mercadopago',
            frequency,
            externalId: data.id || externalRef,
            checkoutUrl: data.init_point,
            amountArs: check.amountArs,
          });
          return;
        }
      }

      // Flujo interactivo integrado cuando aún no hay token productivo en .env
      const sessionId = `MP-SES-${crypto.randomInt(100000, 999999)}`;
      res.json({
        ok: true,
        mode: 'interactive',
        provider: 'mercadopago',
        frequency,
        sessionId,
        amountArs: check.amountArs,
        nextBillingDate: frequency === 'monthly' ? calculateNextBillingDate() : undefined,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al iniciar el pago con Mercado Pago.',
      });
    }
  });

  // Confirmar sesión interactiva de Mercado Pago
  app.post('/api/donations/mercadopago/confirm', (req: Request, res: Response) => {
    const check = validateBasicDonationBody(req.body);
    if (!check.valid) {
      res.status(400).json({ ok: false, error: check.error });
      return;
    }

    const frequency: 'monthly' | 'one-time' =
      req.body.frequency === 'monthly' ? 'monthly' : 'one-time';
    const receiptId = `FCE-MP-${crypto.randomInt(100000, 999999)}`;
    const subscriptionId =
      frequency === 'monthly' ? `MP-SUB-${crypto.randomInt(100000, 999999)}` : undefined;

    const record: StoredDonationRecord = {
      id: receiptId,
      subscriptionId,
      provider: 'mercadopago',
      frequency,
      status: frequency === 'monthly' ? 'active' : 'approved',
      amountArs: check.amountArs!,
      hasAutoIncrease: frequency === 'monthly' && Boolean(req.body.autoIncreaseAccepted),
      donorName: check.name!,
      donorEmail: check.email!,
      donorDni: req.body.donor?.dni?.trim() || undefined,
      nextBillingDate: frequency === 'monthly' ? calculateNextBillingDate() : undefined,
      createdAt: formatDateEsAr(),
    };

    if (subscriptionId) {
      subscriptionStore.set(subscriptionId, record);
    }

    res.json({ ok: true, receipt: record });
  });

  // 3. PAYPAL: INICIAR DONACIÓN ÚNICA (ORDERS V2) O SUSCRIPCIÓN MENSUAL (BILLING SUBSCRIPTIONS V1)
  app.post('/api/donations/paypal', async (req: Request, res: Response) => {
    try {
      const check = validateBasicDonationBody(req.body);
      if (!check.valid) {
        res.status(400).json({ ok: false, error: check.error });
        return;
      }

      const frequency: 'monthly' | 'one-time' =
        req.body.frequency === 'monthly' ? 'monthly' : 'one-time';
      const amountUsd = convertArsToUsd(check.amountArs!, EXCHANGE_RATE);
      const baseUrl = getAppBaseUrl(req);
      const simulate = Boolean(req.body.simulate);
      const token = simulate ? null : await getPayPalAccessToken();

      if (token && !simulate) {
        const paypalBase = getPayPalBaseUrl();
        if (frequency === 'one-time') {
          const orderRes = await fetch(`${paypalBase}/v2/checkout/orders`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              intent: 'CAPTURE',
              purchase_units: [
                {
                  description: 'Donación Única - Fundación LumenCor',
                  amount: {
                    currency_code: 'USD',
                    value: amountUsd.toFixed(2),
                  },
                },
              ],
              application_context: {
                brand_name: 'Fundación LumenCor',
                user_action: 'PAY_NOW',
                return_url: `${baseUrl}/?section=donar&provider=paypal&frequency=one-time&pp_status=approved&amount=${check.amountArs}`,
                cancel_url: `${baseUrl}/?section=donar&provider=paypal&pp_status=cancelled`,
              },
            }),
          });

          const data = (await orderRes.json()) as {
            id?: string;
            links?: { rel: string; href: string }[];
            message?: string;
          };

          const approveLink = data.links?.find((l) => l.rel === 'approve')?.href;
          if (!orderRes.ok || !approveLink) {
            res.status(502).json({
              ok: false,
              error: data.message || 'No se pudo crear la orden en PayPal.',
            });
            return;
          }

          res.json({
            ok: true,
            mode: 'redirect',
            provider: 'paypal',
            frequency,
            externalId: data.id,
            checkoutUrl: approveLink,
            amountArs: check.amountArs,
            amountUsd,
          });
          return;
        } else {
          // Crear Producto + Plan Mensual + Suscripción en PayPal
          const prodRes = await fetch(`${paypalBase}/v1/catalogs/products`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: 'Aporte Solidario Mensual LumenCor',
              type: 'SERVICE',
              category: 'CHARITY',
            }),
          });
          const prodData = (await prodRes.json()) as { id?: string };

          if (!prodRes.ok || !prodData.id) {
            res.status(502).json({ ok: false, error: 'No se pudo configurar el plan en PayPal.' });
            return;
          }

          const planRes = await fetch(`${paypalBase}/v1/billing/plans`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              product_id: prodData.id,
              name: `Suscripción Mensual USD $${amountUsd.toFixed(2)} - LumenCor`,
              status: 'ACTIVE',
              billing_cycles: [
                {
                  frequency: { interval_unit: 'MONTH', interval_count: 1 },
                  tenure_type: 'REGULAR',
                  sequence: 1,
                  total_cycles: 0,
                  pricing_scheme: {
                    fixed_price: {
                      value: amountUsd.toFixed(2),
                      currency_code: 'USD',
                    },
                  },
                },
              ],
              payment_preferences: {
                auto_bill_outstanding: true,
                payment_failure_threshold: 3,
              },
            }),
          });
          const planData = (await planRes.json()) as { id?: string };

          if (!planRes.ok || !planData.id) {
            res.status(502).json({ ok: false, error: 'No se pudo crear el ciclo mensual en PayPal.' });
            return;
          }

          const subRes = await fetch(`${paypalBase}/v1/billing/subscriptions`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              plan_id: planData.id,
              subscriber: {
                name: { given_name: check.name },
                email_address: check.email,
              },
              application_context: {
                brand_name: 'Fundación LumenCor',
                user_action: 'SUBSCRIBE_NOW',
                return_url: `${baseUrl}/?section=donar&provider=paypal&frequency=monthly&pp_status=approved&amount=${check.amountArs}`,
                cancel_url: `${baseUrl}/?section=donar&provider=paypal&pp_status=cancelled`,
              },
            }),
          });

          const subData = (await subRes.json()) as {
            id?: string;
            links?: { rel: string; href: string }[];
            message?: string;
          };
          const approveLink = subData.links?.find((l) => l.rel === 'approve')?.href;

          if (!subRes.ok || !approveLink) {
            res.status(502).json({
              ok: false,
              error: subData.message || 'No se pudo crear la suscripción en PayPal.',
            });
            return;
          }

          res.json({
            ok: true,
            mode: 'redirect',
            provider: 'paypal',
            frequency,
            externalId: subData.id,
            checkoutUrl: approveLink,
            amountArs: check.amountArs,
            amountUsd,
          });
          return;
        }
      }

      // Flujo interactivo integrado cuando aún no hay credenciales productivas en .env
      const sessionId = `PP-SES-${crypto.randomInt(100000, 999999)}`;
      res.json({
        ok: true,
        mode: 'interactive',
        provider: 'paypal',
        frequency,
        sessionId,
        amountArs: check.amountArs,
        amountUsd,
        nextBillingDate: frequency === 'monthly' ? calculateNextBillingDate() : undefined,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'Ocurrió un error al iniciar el pago con PayPal.',
      });
    }
  });

  // Confirmar / capturar orden o suscripción de PayPal
  app.post('/api/donations/paypal/capture', async (req: Request, res: Response) => {
    try {
      const check = validateBasicDonationBody(req.body);
      if (!check.valid) {
        res.status(400).json({ ok: false, error: check.error });
        return;
      }

      const frequency: 'monthly' | 'one-time' =
        req.body.frequency === 'monthly' ? 'monthly' : 'one-time';
      const amountUsd = convertArsToUsd(check.amountArs!, EXCHANGE_RATE);
      const simulate = Boolean(req.body.simulate);
      const hasRemoteRef =
        (frequency === 'one-time' && Boolean(req.body.orderId)) ||
        (frequency === 'monthly' && Boolean(req.body.subscriptionId));
      const token = !simulate && hasRemoteRef ? await getPayPalAccessToken() : null;

      if (token && req.body.orderId && frequency === 'one-time') {
        const capRes = await fetch(
          `${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(String(req.body.orderId))}/capture`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!capRes.ok) {
          res.status(502).json({ ok: false, error: 'No se pudo capturar el pago en PayPal.' });
          return;
        }
      } else if (token && req.body.subscriptionId && frequency === 'monthly') {
        const subRes = await fetch(
          `${getPayPalBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(String(req.body.subscriptionId))}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        if (!subRes.ok) {
          res.status(502).json({ ok: false, error: 'No se pudo verificar la suscripción en PayPal.' });
          return;
        }
      }

      const receiptId = `FCE-PP-${crypto.randomInt(100000, 999999)}`;
      const subscriptionId =
        frequency === 'monthly'
          ? String(req.body.subscriptionId || `PP-SUB-${crypto.randomInt(100000, 999999)}`)
          : undefined;

      const record: StoredDonationRecord = {
        id: receiptId,
        subscriptionId,
        provider: 'paypal',
        frequency,
        status: frequency === 'monthly' ? 'active' : 'approved',
        amountArs: check.amountArs!,
        amountUsd,
        hasAutoIncrease: frequency === 'monthly' && Boolean(req.body.autoIncreaseAccepted),
        donorName: check.name!,
        donorEmail: check.email!,
        donorDni: req.body.donor?.dni?.trim() || undefined,
        nextBillingDate: frequency === 'monthly' ? calculateNextBillingDate() : undefined,
        createdAt: formatDateEsAr(),
      };

      if (subscriptionId) {
        subscriptionStore.set(subscriptionId, record);
      }

      res.json({ ok: true, receipt: record });
    } catch (error) {
      res.status(500).json({
        ok: false,
        error:
          error instanceof Error ? error.message : 'Error al confirmar la donación por PayPal.',
      });
    }
  });

  // 4. CANCELAR SUSCRIPCIÓN ACTIVA (Mercado Pago / PayPal / Tarjeta)
  app.post('/api/donations/subscriptions/:id/cancel', async (req: Request, res: Response) => {
    try {
      const subId = String(req.params.id || '');
      const existing = subscriptionStore.get(subId);

      if (existing?.provider === 'mercadopago' && process.env.MERCADOPAGO_ACCESS_TOKEN) {
        await fetch(`https://api.mercadopago.com/preapproval/${encodeURIComponent(subId)}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'cancelled' }),
        }).catch(() => null);
      } else if (existing?.provider === 'paypal') {
        const token = await getPayPalAccessToken().catch(() => null);
        if (token) {
          await fetch(
            `${getPayPalBaseUrl()}/v1/billing/subscriptions/${encodeURIComponent(subId)}/cancel`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reason: 'Cancelado por el donante desde LumenCor' }),
            }
          ).catch(() => null);
        }
      }

      if (existing) {
        existing.status = 'cancelled';
        subscriptionStore.set(subId, existing);
      }

      res.json({ ok: true, subscriptionId: subId, status: 'cancelled' });
    } catch {
      res.status(500).json({ ok: false, error: 'No pudimos cancelar la suscripción en este momento.' });
    }
  });

  // Vite middleware en desarrollo o archivos estáticos en producción
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

createServer();