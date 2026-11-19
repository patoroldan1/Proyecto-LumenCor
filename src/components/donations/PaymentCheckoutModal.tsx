/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Globe,
  RefreshCw,
  ShieldCheck,
  Wallet,
  X,
} from 'lucide-react';
import { DonationFrequency } from '../../utils/paymentRules.ts';

export interface GatewaySessionState {
  provider: 'mercadopago' | 'paypal';
  mode: 'redirect' | 'interactive';
  frequency: DonationFrequency;
  amountArs: number;
  amountUsd?: number;
  donorName: string;
  donorEmail: string;
  hasAutoIncrease: boolean;
  sessionId?: string;
  externalId?: string;
  checkoutUrl?: string;
  nextBillingDate?: string;
}

interface PaymentCheckoutModalProps {
  session: GatewaySessionState | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirmInteractive: () => Promise<void>;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  session,
  isSubmitting,
  errorMessage,
  onClose,
  onConfirmInteractive,
}) => {
  const [selectedFunding, setSelectedFunding] = useState<'wallet' | 'card'>('wallet');

  if (!session) return null;

  const isMercadoPago = session.provider === 'mercadopago';
  const isMonthly = session.frequency === 'monthly';
  const simulatedUrl = isMercadoPago
    ? `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${session.sessionId || 'MP-SIM'}`
    : `https://www.paypal.com/checkoutnow?token=${session.sessionId || 'PP-SIM'}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-fade-in">
        {/* Header de marca */}
        <div
          className={`px-6 py-5 flex items-center justify-between ${
            isMercadoPago
              ? 'bg-[#009EE3] text-stone-950'
              : 'bg-[#FFC439] text-stone-950'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
              {isMercadoPago ? (
                <Wallet className="w-5 h-5 text-black" />
              ) : (
                <Globe className="w-5 h-5 text-[#003087]" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest block font-bold opacity-85">
                {isMonthly ? 'Suscripción Mensual Automática' : 'Donación Única Segura'}
              </span>
              <h3 id="checkout-modal-title" className="text-lg font-bold tracking-tight">
                {isMercadoPago ? 'Mercado Pago' : 'PayPal'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar ventana de pago"
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-stone-950 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-5">
          {/* Barra de destino (redirección real o simulación interactiva) */}
          <div className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-[11px] text-stone-600 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-mono truncate">
              {session.checkoutUrl || simulatedUrl}
            </span>
          </div>

          {/* Resumen del aporte */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Beneficiario</span>
              <span className="font-semibold text-stone-800">Fundación LumenCor</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Titular</span>
              <span className="font-medium text-stone-800 truncate max-w-[60%]">
                {session.donorEmail}
              </span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
              <span className="text-xs font-medium text-stone-600">
                {isMonthly ? 'Débito mensual' : 'Total a aportar'}
              </span>
              <div className="text-right">
                {isMercadoPago ? (
                  <span className="font-serif text-2xl font-bold text-stone-900">
                    ${session.amountArs.toLocaleString('es-AR')} ARS
                  </span>
                ) : (
                  <>
                    <span className="font-serif text-2xl font-bold text-[#003087] block">
                      USD ${(session.amountUsd || 0).toFixed(2)}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Equivalente a ${session.amountArs.toLocaleString('es-AR')} ARS
                    </span>
                  </>
                )}
              </div>
            </div>

            {isMonthly && session.nextBillingDate && (
              <div className="pt-2 border-t border-stone-200 flex items-center gap-2 text-[11px] text-stone-600">
                <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  Próxima renovación estimada: <strong>{session.nextBillingDate}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Redirección directa si el navegador impidiera salto automático en iframe */}
          {session.mode === 'redirect' && session.checkoutUrl ? (
            <div className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Tu {isMonthly ? 'suscripción mensual' : 'donación'} ya fue generada en{' '}
                <strong>{isMercadoPago ? 'Mercado Pago' : 'PayPal'}</strong>. Presioná el botón para confirmar la operación en su sitio oficial.
              </p>

              <a
                href={session.checkoutUrl}
                target="_top"
                rel="noopener noreferrer"
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                  isMercadoPago
                    ? 'bg-[#009EE3] hover:bg-[#008ED0] text-stone-950'
                    : 'bg-[#FFC439] hover:bg-[#F7B618] text-stone-950'
                }`}
              >
                {isMercadoPago ? (
                  <Wallet className="w-4 h-4 text-black" />
                ) : (
                  <Globe className="w-4 h-4 text-[#003087]" />
                )}
                <span>Ir a confirmar en {isMercadoPago ? 'Mercado Pago' : 'PayPal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            /* Simulación interactiva cuando aún no hay credenciales productivas cargadas */
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="block text-xs font-medium text-stone-700">
                  Simulador de checkout ({isMercadoPago ? 'Mercado Pago' : 'PayPal'})
                </span>
                <div className="grid grid-cols-1 gap-2">
                  <label
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      selectedFunding === 'wallet'
                        ? isMercadoPago
                          ? 'border-[#009EE3] bg-sky-50/70 text-stone-900 font-semibold'
                          : 'border-[#E0A800] bg-amber-50/70 text-stone-900 font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="gatewayFunding"
                        checked={selectedFunding === 'wallet'}
                        onChange={() => setSelectedFunding('wallet')}
                        className="accent-stone-900"
                      />
                      <span>
                        {isMercadoPago
                          ? 'Dinero en cuenta de Mercado Pago'
                          : 'Saldo en cuenta PayPal'}
                      </span>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      selectedFunding === 'card'
                        ? isMercadoPago
                          ? 'border-[#009EE3] bg-sky-50/70 text-stone-900 font-semibold'
                          : 'border-[#E0A800] bg-amber-50/70 text-stone-900 font-semibold'
                        : 'border-stone-200 bg-white text-stone-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="gatewayFunding"
                        checked={selectedFunding === 'card'}
                        onChange={() => setSelectedFunding('card')}
                        className="accent-stone-900"
                      />
                      <span>
                        {isMercadoPago
                          ? 'Tarjeta vinculada en Mercado Pago'
                          : 'Tarjeta internacional vinculada a PayPal'}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMessage}
                </p>
              )}

              <button
                type="button"
                disabled={isSubmitting}
                onClick={onConfirmInteractive}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-60 ${
                  isMercadoPago
                    ? 'bg-[#009EE3] hover:bg-[#008ED0] text-stone-950'
                    : 'bg-[#FFC439] hover:bg-[#F7B618] text-stone-950'
                }`}
              >
                {isMercadoPago ? (
                  <Wallet className="w-4 h-4 text-black" />
                ) : (
                  <Globe className="w-4 h-4 text-[#003087]" />
                )}
                <span>
                  {isSubmitting
                    ? 'Procesando...'
                    : isMonthly
                    ? `Autorizar Suscripción ${isMercadoPago ? 'Mercado Pago' : 'PayPal'}`
                    : `Confirmar Donación en ${isMercadoPago ? 'Mercado Pago' : 'PayPal'}`}
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Operación protegida por {isMercadoPago ? 'Mercado Pago' : 'PayPal'}
            </span>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-medium text-stone-500 hover:text-stone-800 cursor-pointer"
            >
              Cancelar y volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};