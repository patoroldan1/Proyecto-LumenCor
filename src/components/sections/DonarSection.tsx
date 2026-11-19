/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  calculateDonationImpact,
  validateDonationInput,
} from '../../utils/cartAndDonationRules.ts';
import {
  CardFormDetails,
  DEFAULT_USD_ARS_RATE,
  DonationFrequency,
  PaymentGateway,
  convertArsToUsd,
  detectCardBrand,
  sanitizeDigits,
  validateCardDetails,
} from '../../utils/paymentRules.ts';
import { CardPaymentFields } from '../donations/CardPaymentFields.tsx';
import {
  GatewaySessionState,
  PaymentCheckoutModal,
} from '../donations/PaymentCheckoutModal.tsx';
import {
  Heart,
  ShieldCheck,
  Utensils,
  Sparkles,
  Home,
  CreditCard,
  CheckCircle,
  FileText,
  TrendingUp,
  Delete,
  RotateCcw,
  RefreshCw,
  Globe,
  Wallet,
  XCircle,
} from 'lucide-react';

interface DonationReceipt {
  id: string;
  subscriptionId?: string;
  provider: PaymentGateway;
  frequency: DonationFrequency;
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

const PENDING_DONATION_STORAGE_KEY = 'lumencor_pending_donation';

export const DonarSection: React.FC = () => {
  const [donationFrequency, setDonationFrequency] = useState<DonationFrequency>('monthly');
  const [donationAmount, setDonationAmount] = useState<string>('0');
  const [autoIncreaseAccepted, setAutoIncreaseAccepted] = useState<boolean>(false);
  const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('mercadopago');
  const [usdArsRate, setUsdArsRate] = useState<number>(DEFAULT_USD_ARS_RATE);
  const inputRef = useRef<HTMLInputElement>(null);

  // Datos del donante
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    dni: '',
  });

  // Datos de Tarjeta Débito / Crédito
  const [cardDetails, setCardDetails] = useState<CardFormDetails>({
    number: '',
    holderName: '',
    expiry: '',
    cvv: '',
    cardType: 'credito',
  });
  const [cardFieldErrors, setCardFieldErrors] = useState<Record<string, string>>({});

  const [formError, setFormError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [gatewaySession, setGatewaySession] = useState<GatewaySessionState | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<DonationReceipt | null>(null);
  const [confirmCancelSub, setConfirmCancelSub] = useState<boolean>(false);
  const [isCancellingSub, setIsCancellingSub] = useState<boolean>(false);

  // Cargar configuración y procesar retorno desde Mercado Pago / PayPal si el usuario vuelve de la pasarela externa
  useEffect(() => {
    fetch('/api/donations/config')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.usdArsRate) {
          setUsdArsRate(Number(data.usdArsRate));
        }
      })
      .catch(() => null);

    const params = new URLSearchParams(window.location.search);
    const provider = params.get('provider');
    const mpStatus = params.get('mp_status') || params.get('collection_status');
    const ppStatus = params.get('pp_status');
    const returnedAmount = Number(params.get('amount') || '0');
    const returnedFreq: DonationFrequency =
      params.get('frequency') === 'monthly' ? 'monthly' : 'one-time';

    let savedPending: {
      donorData?: { name: string; email: string; dni?: string };
      autoIncreaseAccepted?: boolean;
      amountArs?: number;
      frequency?: DonationFrequency;
    } | null = null;

    try {
      const raw = sessionStorage.getItem(PENDING_DONATION_STORAGE_KEY);
      if (raw) {
        savedPending = JSON.parse(raw);
      }
    } catch {
      savedPending = null;
    }

    if (mpStatus === 'failure' || ppStatus === 'cancelled') {
      sessionStorage.removeItem(PENDING_DONATION_STORAGE_KEY);
      setFormError(
        provider === 'paypal'
          ? 'La operación en PayPal fue cancelada. Podés intentarlo nuevamente cuando quieras.'
          : 'El pago en Mercado Pago no pudo completarse. Podés intentarlo nuevamente.'
      );
      return;
    }

    if (provider === 'mercadopago' && (mpStatus === 'approved' || params.get('preapproval_id'))) {
      sessionStorage.removeItem(PENDING_DONATION_STORAGE_KEY);
      const safeAmount = returnedAmount >= 500 ? returnedAmount : savedPending?.amountArs || 5000;
      const freq = savedPending?.frequency || returnedFreq;
      setReceiptData({
        id:
          params.get('payment_id') ||
          params.get('preapproval_id') ||
          `FCE-MP-${Math.floor(100000 + Math.random() * 900000)}`,
        subscriptionId:
          freq === 'monthly'
            ? params.get('preapproval_id') || `MP-SUB-${Math.floor(100000 + Math.random() * 900000)}`
            : undefined,
        provider: 'mercadopago',
        frequency: freq,
        status: freq === 'monthly' ? 'active' : 'approved',
        amountArs: safeAmount,
        hasAutoIncrease: Boolean(savedPending?.autoIncreaseAccepted ?? freq === 'monthly'),
        donorName: savedPending?.donorData?.name || 'Donante Verificado',
        donorEmail: savedPending?.donorData?.email || 'Confirmado en Mercado Pago',
        donorDni: savedPending?.donorData?.dni,
        createdAt: new Date().toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
    } else if (provider === 'paypal' && ppStatus === 'approved') {
      sessionStorage.removeItem(PENDING_DONATION_STORAGE_KEY);
      const safeAmount = returnedAmount >= 500 ? returnedAmount : savedPending?.amountArs || 5000;
      const freq = savedPending?.frequency || returnedFreq;
      const donor = savedPending?.donorData || {
        name: 'Donante PayPal',
        email: 'confirmado@paypal.com',
      };
      const orderToken = params.get('token');
      const subscriptionToken = params.get('subscription_id');

      setIsProcessing(true);
      fetch('/api/donations/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountArs: safeAmount,
          frequency: freq,
          autoIncreaseAccepted: Boolean(savedPending?.autoIncreaseAccepted ?? freq === 'monthly'),
          donor,
          orderId: freq === 'one-time' ? orderToken : undefined,
          subscriptionId: freq === 'monthly' ? subscriptionToken : undefined,
        }),
      })
        .then((r) => r.json())
        .then((payload) => {
          if (payload?.ok && payload.receipt) {
            setReceiptData(payload.receipt);
          } else {
            setFormError(payload?.error || 'No pudimos confirmar tu donación de PayPal.');
          }
        })
        .catch(() => {
          setFormError('No pudimos validar el retorno desde PayPal.');
        })
        .finally(() => {
          setIsProcessing(false);
        });
    }
  }, []);

  // Manejo de entrada nativa desde teclado numérico de dispositivo móvil / desktop
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDigits = e.target.value.replace(/\D/g, '');
    if (!rawDigits || rawDigits === '') {
      setDonationAmount('0');
      return;
    }
    if (rawDigits.length > 8) return;
    const normalized = String(Number(rawDigits));
    setDonationAmount(normalized);
  };

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Funciones para el teclado táctil (visible únicamente en versión desktop)
  const handleDigitPress = (digit: string) => {
    setDonationAmount((prev) => {
      if (prev === '0') return digit;
      if (prev.length >= 8) return prev;
      return prev + digit;
    });
  };

  const handleTripleZero = () => {
    setDonationAmount((prev) => {
      if (prev === '0' || prev === '') return '0';
      if (prev.length >= 6) return prev;
      return prev + '000';
    });
  };

  const handleBackspace = () => {
    setDonationAmount((prev) => {
      if (prev.length <= 1) return '0';
      return prev.slice(0, -1);
    });
  };

  const handleClear = () => {
    setDonationAmount('0');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const numericAmount = Number(donationAmount) || 0;
  const usdEquivalent = convertArsToUsd(numericAmount, usdArsRate);
  const impact = calculateDonationImpact(numericAmount);

  const handleFrequencyChange = (nextFrequency: DonationFrequency) => {
    setDonationFrequency(nextFrequency);
    setFormError(null);
    setCardFieldErrors({});
    if (nextFrequency === 'monthly' && paymentGateway === 'card') {
      setPaymentGateway('mercadopago');
    }
  };

  const handleResetToNewDonation = () => {
    setReceiptData(null);
    setConfirmCancelSub(false);
    setFormError(null);
    setCardFieldErrors({});
    setCardDetails({
      number: '',
      holderName: '',
      expiry: '',
      cvv: '',
      cardType: 'credito',
    });
  };

  const redirectToExternalGateway = (checkoutUrl: string) => {
    try {
      sessionStorage.setItem(
        PENDING_DONATION_STORAGE_KEY,
        JSON.stringify({
          donorData,
          autoIncreaseAccepted,
          amountArs: numericAmount,
          frequency: donationFrequency,
        })
      );
    } catch {
      // Ignorar si sessionStorage no está disponible
    }

    try {
      if (window.top && window.top !== window.self) {
        window.top.location.href = checkoutUrl;
      } else {
        window.location.href = checkoutUrl;
      }
    } catch {
      window.location.href = checkoutUrl;
    }
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setCardFieldErrors({});

    // 1. Validación de monto e email
    const validation = validateDonationInput(numericAmount, donorData.email);
    if (!validation.isValid) {
      setFormError(validation.error || 'Por favor verifica el monto ingresado.');
      return;
    }

    if (!donorData.name.trim()) {
      setFormError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    // 2. Validación de autorización obligatoria para suscripción mensual (10% cada 3 meses)
    if (donationFrequency === 'monthly' && !autoIncreaseAccepted) {
      setFormError(
        'Para suscripciones mensuales, es necesario autorizar el ajuste trimestral del 10%.'
      );
      return;
    }

    // 3. Pago / suscripción directa con Tarjeta de Débito o Crédito
    if (paymentGateway === 'card') {
      const cardCheck = validateCardDetails(cardDetails);
      if (!cardCheck.isValid) {
        setCardFieldErrors(cardCheck.fieldErrors);
        setFormError('Revisá los datos de tu tarjeta antes de continuar.');
        return;
      }

      setIsProcessing(true);
      try {
        const cleanDigits = sanitizeDigits(cardDetails.number);
        const brand = detectCardBrand(cleanDigits);

        const response = await fetch('/api/donations/card', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountArs: numericAmount,
            frequency: donationFrequency,
            autoIncreaseAccepted,
            donor: donorData,
            card: {
              last4: cleanDigits.slice(-4),
              brand,
              cardType: cardDetails.cardType,
              holderName: cardDetails.holderName.trim(),
              expiry: cardDetails.expiry.trim(),
            },
          }),
        });

        const payload = await response.json();
        if (!response.ok || !payload.ok) {
          setFormError(payload.error || 'No se pudo procesar el pago con tarjeta.');
          return;
        }

        setReceiptData(payload.receipt);
      } catch {
        setFormError('Ocurrió un error de conexión al procesar la tarjeta.');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // 4. Mercado Pago o PayPal: redirección oficial o simulador interactivo
    await initiateGatewayFlow(false);
  };

  const initiateGatewayFlow = async (simulate: boolean) => {
    if (paymentGateway !== 'mercadopago' && paymentGateway !== 'paypal') return;

    setFormError(null);
    const validation = validateDonationInput(numericAmount, donorData.email);
    if (!validation.isValid) {
      setFormError(validation.error || 'Por favor verifica el monto ingresado.');
      return;
    }

    if (!donorData.name.trim()) {
      setFormError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    if (donationFrequency === 'monthly' && !autoIncreaseAccepted) {
      setFormError(
        'Para suscripciones mensuales, es necesario autorizar el ajuste trimestral del 10%.'
      );
      return;
    }

    setIsProcessing(true);
    setModalError(null);
    try {
      const endpoint =
        paymentGateway === 'mercadopago'
          ? '/api/donations/mercadopago'
          : '/api/donations/paypal';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountArs: numericAmount,
          frequency: donationFrequency,
          autoIncreaseAccepted,
          donor: donorData,
          simulate,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setFormError(
          payload.error ||
            `No pudimos iniciar el proceso con ${
              paymentGateway === 'mercadopago' ? 'Mercado Pago' : 'PayPal'
            }.`
        );
        return;
      }

      // Redirección directa a Mercado Pago / PayPal cuando el backend devuelve init_point / approveUrl
      if (payload.mode === 'redirect' && payload.checkoutUrl) {
        setGatewaySession({
          provider: paymentGateway,
          mode: 'redirect',
          frequency: donationFrequency,
          amountArs: numericAmount,
          amountUsd: payload.amountUsd || usdEquivalent,
          donorName: donorData.name,
          donorEmail: donorData.email,
          hasAutoIncrease: donationFrequency === 'monthly' && autoIncreaseAccepted,
          externalId: payload.externalId,
          checkoutUrl: payload.checkoutUrl,
        });
        redirectToExternalGateway(payload.checkoutUrl);
        return;
      }

      // Modo simulador interactivo
      setGatewaySession({
        provider: paymentGateway,
        mode: 'interactive',
        frequency: donationFrequency,
        amountArs: numericAmount,
        amountUsd: payload.amountUsd || usdEquivalent,
        donorName: donorData.name,
        donorEmail: donorData.email,
        hasAutoIncrease: donationFrequency === 'monthly' && autoIncreaseAccepted,
        sessionId: payload.sessionId,
        nextBillingDate: payload.nextBillingDate,
      });
    } catch {
      setFormError('Ocurrió un error de conexión al iniciar la pasarela de pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmGatewaySession = async () => {
    if (!gatewaySession) return;
    setIsProcessing(true);
    setModalError(null);

    try {
      const confirmUrl =
        gatewaySession.provider === 'mercadopago'
          ? '/api/donations/mercadopago/confirm'
          : '/api/donations/paypal/capture';

      const response = await fetch(confirmUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountArs: gatewaySession.amountArs,
          frequency: gatewaySession.frequency,
          autoIncreaseAccepted: gatewaySession.hasAutoIncrease,
          donor: donorData,
          sessionId: gatewaySession.sessionId,
          simulate: gatewaySession.mode === 'interactive',
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        setModalError(payload.error || 'No pudimos confirmar tu operación.');
        return;
      }

      setGatewaySession(null);
      setReceiptData(payload.receipt);
    } catch {
      setModalError('No pudimos conectarnos para confirmar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!receiptData?.subscriptionId) return;
    setIsCancellingSub(true);
    try {
      const res = await fetch(
        `/api/donations/subscriptions/${encodeURIComponent(receiptData.subscriptionId)}/cancel`,
        { method: 'POST' }
      );
      if (res.ok) {
        setReceiptData({
          ...receiptData,
          status: 'cancelled',
        });
        setConfirmCancelSub(false);
      }
    } finally {
      setIsCancellingSub(false);
    }
  };

  const getGatewayDisplayLabel = (receipt: DonationReceipt) => {
    if (receipt.provider === 'mercadopago') return 'Mercado Pago';
    if (receipt.provider === 'paypal') return 'PayPal';
    const typeLabel = receipt.cardType === 'debito' ? 'Débito' : 'Crédito';
    return `${receipt.cardBrand || 'Tarjeta'} (${typeLabel}) •••• ${receipt.cardLast4 || ''}`;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Hero Header */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <img
            src="/assets/images/midjourney-donar.png"
            alt="Manos compartiendo pan"
            style={{ objectPosition: '50% 50%' }}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs tracking-widest font-cinzel uppercase">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Colaborá con la Fundación</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            Tu Ayuda Llega Esta Misma Noche a la Calle
          </h1>
          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base font-light leading-relaxed">
            Cada plato caliente, cada frazada limpia y cada palabra de aliento existen gracias al compromiso de personas solidarias como vos.
          </p>
        </div>
      </div>

      {/* Contenedor Principal: Formulario protagonista + Aside de agradecimiento */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Principal: Formulario de Donación */}
          <div className="lg:col-span-7 order-1 bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-300/90 shadow-xl shadow-stone-900/10 ring-1 ring-stone-900/5 space-y-6">
          {receiptData ? (
            <div className="py-4 text-center space-y-6 animate-fade-in">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
                  receiptData.status === 'cancelled'
                    ? 'bg-stone-100 text-stone-500'
                    : 'bg-emerald-100 text-emerald-600'
                }`}
              >
                {receiptData.status === 'cancelled' ? (
                  <XCircle className="w-10 h-10" />
                ) : (
                  <CheckCircle className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {receiptData.status === 'cancelled'
                    ? 'Suscripción Cancelada'
                    : `¡Gracias de Corazón, ${receiptData.donorName}!`}
                </h3>
                <p className="text-xs text-stone-500">
                  {receiptData.status === 'cancelled'
                    ? 'No se realizarán nuevos débitos automáticos en tu cuenta.'
                    : receiptData.frequency === 'monthly'
                    ? 'Tu suscripción mensual solidaria quedó activa.'
                    : 'Tu aporte único sostiene la esperanza de cientos de personas que viven a la intemperie.'}
                </p>
              </div>

              {/* Digital Receipt */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="font-cinzel font-semibold text-stone-800">
                    Comprobante de Donación
                  </span>
                  <span className="text-amber-800 font-mono font-medium">{receiptData.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Donante</span>
                    <span className="font-semibold text-stone-900">{receiptData.donorName}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Email</span>
                    <span className="font-semibold text-stone-900 break-all">
                      {receiptData.donorEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Modalidad</span>
                    <span className="font-semibold text-stone-900">
                      {receiptData.frequency === 'monthly'
                        ? 'Suscripción Mensual'
                        : 'Aporte Único'}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Medio de Pago</span>
                    <span className="font-semibold text-stone-900">
                      {getGatewayDisplayLabel(receiptData)}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Fecha</span>
                    <span className="font-semibold text-stone-900">{receiptData.createdAt}</span>
                  </div>
                  {receiptData.subscriptionId && (
                    <div>
                      <span className="text-stone-400 block text-[10px]">ID de Suscripción</span>
                      <span className="font-mono font-semibold text-stone-900">
                        {receiptData.subscriptionId}
                      </span>
                    </div>
                  )}
                </div>

                {receiptData.frequency === 'monthly' && (
                  <div
                    className={`pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] p-2.5 rounded-lg ${
                      receiptData.status === 'active'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <span className="font-semibold">
                      Estado: {receiptData.status === 'active' ? 'Suscripción Activa' : 'Cancelada'}
                    </span>
                    {receiptData.status === 'active' && receiptData.nextBillingDate && (
                      <span>Próximo débito: {receiptData.nextBillingDate}</span>
                    )}
                  </div>
                )}

                {receiptData.hasAutoIncrease && (
                  <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Incluye actualización trimestral del 10% autorizada.</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  <span className="text-stone-700 font-medium">Monto Aportado:</span>
                  <div className="text-right">
                    <span className="font-serif text-xl font-bold text-stone-900 block">
                      ${receiptData.amountArs.toLocaleString('es-AR')} ARS
                    </span>
                    {receiptData.amountUsd && (
                      <span className="text-[11px] text-stone-500">
                        (USD ${receiptData.amountUsd.toFixed(2)} vía PayPal)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones del comprobante */}
              <div className="space-y-3 pt-1">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase font-cinzel"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Imprimir Comprobante</span>
                </button>

                {receiptData.subscriptionId && receiptData.status === 'active' && (
                  <div className="pt-1">
                    {!confirmCancelSub ? (
                      <button
                        type="button"
                        onClick={() => setConfirmCancelSub(true)}
                        className="w-full py-2.5 rounded-xl border border-stone-300 text-stone-600 hover:text-rose-700 hover:border-rose-300 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Cancelar suscripción mensual
                      </button>
                    ) : (
                      <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 space-y-2">
                        <p className="text-xs text-rose-900 font-medium">
                          ¿Confirmás la baja de tu suscripción mensual?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={isCancellingSub}
                            onClick={handleCancelSubscription}
                            className="flex-1 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-60"
                          >
                            {isCancellingSub ? 'Cancelando...' : 'Sí, cancelar'}
                          </button>
                          <button
                            type="button"
                            disabled={isCancellingSub}
                            onClick={() => setConfirmCancelSub(false)}
                            className="flex-1 py-2 rounded-lg bg-white border border-stone-300 text-stone-700 text-xs font-semibold cursor-pointer"
                          >
                            Mantener activa
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleResetToNewDonation}
                  className="w-full py-2.5 text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
                >
                  Realizar otra donación
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6">
              {/* Selector de Modalidad (Frecuencia) */}
              <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => handleFrequencyChange('monthly')}
                  className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-cinzel uppercase font-semibold transition-all cursor-pointer ${
                    donationFrequency === 'monthly'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Suscripción Mensual
                </button>
                <button
                  type="button"
                  onClick={() => handleFrequencyChange('one-time')}
                  className={`flex-1 py-2.5 px-2 rounded-lg text-xs font-cinzel uppercase font-semibold transition-all cursor-pointer ${
                    donationFrequency === 'one-time'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Donación Única
                </button>
              </div>

              {/* Selector interactivo de Monto (Mobile-First: Teclado Nativo + Visualizador $0) */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="donation-amount-input"
                    className="block text-xs font-medium text-stone-700 font-cinzel uppercase tracking-wider"
                  >
                    Monto a donar (ARS) *
                  </label>
                  {numericAmount > 0 && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="text-[11px] text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Volver a $0</span>
                    </button>
                  )}
                </div>

                {/* Pantalla interactiva del Monto (Al tocar abre teclado numérico nativo en celular) */}
                <div
                  onClick={handleContainerClick}
                  className="bg-stone-50 border-2 border-stone-200 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200/60 transition-all rounded-2xl p-4 sm:p-5 text-center cursor-pointer shadow-xs"
                >
                  <span className="text-[10px] uppercase font-cinzel text-stone-400 block tracking-wider mb-1">
                    Monto a aportar (Tocá para ingresar)
                  </span>
                  <div className="flex items-center justify-center gap-1 font-serif font-bold text-4xl sm:text-5xl text-stone-900 tracking-tight">
                    <span className="text-stone-400 text-2xl sm:text-3xl font-medium">$</span>
                    <input
                      id="donation-amount-input"
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={
                        donationAmount === '0' ? '' : Number(donationAmount).toLocaleString('es-AR')
                      }
                      placeholder="0"
                      onChange={handleInputChange}
                      className="w-full max-w-[220px] sm:max-w-[280px] bg-transparent text-center font-serif font-bold text-4xl sm:text-5xl text-stone-900 focus:outline-none placeholder:text-stone-400 caret-rose-600"
                    />
                  </div>
                  {numericAmount === 0 ? (
                    <p className="text-[11px] text-stone-400 mt-1">
                      Presioná el 0 para habilitar el teclado numérico de tu dispositivo
                    </p>
                  ) : numericAmount < 500 ? (
                    <p className="text-[11px] text-amber-700 font-medium mt-1">
                      El monto mínimo para donar es de $500 pesos
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 font-medium mt-1">
                      Monto listo para donar: ${numericAmount.toLocaleString('es-AR')} ARS
                      {paymentGateway === 'paypal' && ` (≈ USD $${usdEquivalent.toFixed(2)})`}
                    </p>
                  )}
                </div>

                {/* Teclado Numérico en pantalla: Oculto en Mobile (hidden), visible solo en pantallas grandes (sm:block) */}
                <div className="hidden sm:block bg-stone-100/80 border border-stone-200 rounded-2xl p-2.5">
                  <div className="grid grid-cols-3 gap-1.5">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                      <button
                        key={digit}
                        type="button"
                        onClick={() => handleDigitPress(digit)}
                        className="py-2.5 bg-white hover:bg-stone-50 active:bg-stone-200 active:scale-95 rounded-xl border border-stone-200 text-base font-serif font-bold text-stone-800 shadow-xs transition-all cursor-pointer"
                      >
                        {digit}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleTripleZero}
                      className="py-2.5 bg-stone-50 hover:bg-white active:bg-stone-200 active:scale-95 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 transition-all cursor-pointer"
                      title="Agregar tres ceros"
                    >
                      +000
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDigitPress('0')}
                      className="py-2.5 bg-white hover:bg-stone-50 active:bg-stone-200 active:scale-95 rounded-xl border border-stone-200 text-base font-serif font-bold text-stone-800 shadow-xs transition-all cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="py-2.5 bg-stone-50 hover:bg-white active:bg-stone-200 active:scale-95 rounded-xl border border-stone-200 text-stone-700 flex items-center justify-center transition-all cursor-pointer"
                      title="Borrar último dígito"
                    >
                      <Delete className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Autorización de incremento del 10% cada 3 meses para donaciones mensuales */}
              {donationFrequency === 'monthly' && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoIncreaseAccepted}
                      onChange={(e) => setAutoIncreaseAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-amber-600 border-stone-300 rounded focus:ring-amber-500 cursor-pointer accent-amber-600"
                    />
                    <div className="text-xs text-stone-800 space-y-0.5 leading-relaxed">
                      <span className="font-semibold block text-stone-900">
                        Acepto actualizar mi cuota un 10% cada 3 meses
                      </span>
                      <p className="text-stone-600 text-[11px]">
                        Esta autorización trimestral nos permite compensar la inflación y garantizar que las raciones de comida y abrigo se mantengan constantes.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Calculador de Impacto Directo Estimado en tiempo real */}
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-semibold text-amber-900 uppercase font-cinzel tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Tu impacto directo estimado:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                    <Utensils className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <span className="font-serif font-bold text-stone-900 text-sm block">
                      {impact.meals}
                    </span>
                    <span className="text-[10px] text-stone-500">Viandas calientes</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                    <Sparkles className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <span className="font-serif font-bold text-stone-900 text-sm block">
                      {impact.hygieneKits}
                    </span>
                    <span className="text-[10px] text-stone-500">Kits de higiene</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                    <Home className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <span className="font-serif font-bold text-stone-900 text-sm block">
                      {impact.shelterNights}
                    </span>
                    <span className="text-[10px] text-stone-500">Refugio y abrigo</span>
                  </div>
                </div>
              </div>

              {/* Datos del Donante */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="donor-name" className="block text-xs font-medium text-stone-700 mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    id="donor-name"
                    type="text"
                    required
                    value={donorData.name}
                    onChange={(e) => setDonorData({ ...donorData, name: e.target.value })}
                    placeholder="Ej. Juan Carlos Ramos"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="donor-email" className="block text-xs font-medium text-stone-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      id="donor-email"
                      type="email"
                      required
                      value={donorData.email}
                      onChange={(e) => setDonorData({ ...donorData, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="donor-dni" className="block text-xs font-medium text-stone-700 mb-1">
                      DNI o CUIT (opcional para recibo)
                    </label>
                    <input
                      id="donor-dni"
                      type="text"
                      value={donorData.dni}
                      onChange={(e) => setDonorData({ ...donorData, dni: e.target.value })}
                      placeholder="Número de documento"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Selector de Medio de Pago:
                    - En Suscripción Mensual: solo Mercado Pago y PayPal
                    - En Donación Única: Débito/Crédito (siempre con contorno rosa), Mercado Pago (celeste + ícono negro) y PayPal (amarillo) */}
                <div className="space-y-2 pt-1">
                  <span className="block text-xs font-medium text-stone-700">
                    Elegí tu Medio de Pago *
                  </span>
                  <div
                    className={`grid grid-cols-1 gap-2.5 text-xs ${
                      donationFrequency === 'one-time' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                    }`}
                  >
                    {/* Tarjeta Débito / Crédito (solo en Donación Única y siempre con su contorno rosa) */}
                    {donationFrequency === 'one-time' && (
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentGateway('card');
                          setFormError(null);
                        }}
                        className={`p-3 rounded-2xl border-2 text-left flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 transition-all cursor-pointer border-rose-500 text-rose-950 ${
                          paymentGateway === 'card'
                            ? 'bg-rose-50 ring-2 ring-rose-300 shadow-md'
                            : 'bg-rose-50/75 hover:bg-rose-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-rose-600" />
                          <span className="font-semibold">Débito / Crédito</span>
                        </div>
                        <span className="text-[10px] text-rose-900/75">
                          Visa, Mastercard, Amex
                        </span>
                      </button>
                    )}

                    {/* Mercado Pago: relleno celeste + ícono de billetera negro */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentGateway('mercadopago');
                        setFormError(null);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 transition-all cursor-pointer ${
                        paymentGateway === 'mercadopago'
                          ? 'bg-[#009EE3] border-stone-950 ring-2 ring-sky-300 text-stone-950 shadow-md'
                          : 'bg-[#009EE3]/85 hover:bg-[#009EE3] border-[#0086C3] text-stone-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-black" />
                        <span className="font-bold text-stone-950">Mercado Pago</span>
                      </div>
                      <span className="text-[10px] font-medium text-stone-950/85">
                        {donationFrequency === 'monthly' ? 'Suscripción ARS' : 'Pago único ARS'}
                      </span>
                    </button>

                    {/* PayPal: relleno amarillo */}
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentGateway('paypal');
                        setFormError(null);
                      }}
                      className={`p-3 rounded-2xl border-2 text-left flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2 transition-all cursor-pointer ${
                        paymentGateway === 'paypal'
                          ? 'bg-[#FFC439] border-[#003087] ring-2 ring-amber-200 text-stone-950 shadow-md'
                          : 'bg-[#FFC439]/85 hover:bg-[#FFC439] border-[#E0A800] text-stone-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-[#003087]" />
                        <span className="font-bold text-stone-950">PayPal</span>
                      </div>
                      <span className="text-[10px] font-medium text-stone-950/85">
                        {donationFrequency === 'monthly' ? 'Suscripción USD' : 'Pago único USD'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Panel Dinámico del Medio de Pago Seleccionado */}
              {paymentGateway === 'card' && donationFrequency === 'one-time' && (
                <CardPaymentFields
                  cardDetails={cardDetails}
                  onChange={setCardDetails}
                  fieldErrors={cardFieldErrors}
                  frequency={donationFrequency}
                />
              )}

              {paymentGateway === 'mercadopago' && (
                <div className="bg-sky-50/70 border border-sky-200 rounded-2xl p-4 space-y-2 text-xs text-sky-950">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-black" />
                      {donationFrequency === 'monthly'
                        ? 'Suscripción Mensual con Mercado Pago'
                        : 'Donación Única con Mercado Pago'}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#007EB5] border border-sky-200">
                      ARS
                    </span>
                  </div>
                  <p className="text-stone-700 text-[11px] leading-relaxed">
                    {donationFrequency === 'monthly'
                      ? 'Te redireccionaremos a Mercado Pago para autorizar el débito automático mensual con tu saldo o tarjetas asociadas.'
                      : 'Te redireccionaremos a Mercado Pago para confirmar tu donación con dinero en cuenta, débito, crédito o efectivo.'}
                  </p>
                </div>
              )}

              {paymentGateway === 'paypal' && (
                <div className="bg-amber-50/70 border border-amber-300/70 rounded-2xl p-4 space-y-2 text-xs text-stone-900">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-2">
                      <Globe className="w-4 h-4 text-[#003087]" />
                      {donationFrequency === 'monthly'
                        ? 'Suscripción Mensual Internacional con PayPal'
                        : 'Donación Única Internacional con PayPal'}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-[#003087] border border-amber-300">
                      USD
                    </span>
                  </div>
                  <p className="text-stone-700 text-[11px] leading-relaxed">
                    {donationFrequency === 'monthly'
                      ? 'Te redireccionaremos a PayPal para autorizar tu suscripción mensual en dólares (USD) de forma segura.'
                      : 'Te redireccionaremos a PayPal para confirmar tu aporte en dólares (USD) con saldo o tarjeta internacional.'}
                  </p>
                  {numericAmount >= 500 && (
                    <div className="pt-1 flex items-center justify-between text-[11px] font-semibold text-[#003087] border-t border-amber-200/80">
                      <span>Equivalente en PayPal:</span>
                      <span>
                        USD ${usdEquivalent.toFixed(2)}{' '}
                        {donationFrequency === 'monthly' ? '/ mes' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {formError && (
                <div className="text-xs text-rose-700 font-medium bg-rose-50 p-3 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span>{formError}</span>
                  {(paymentGateway === 'mercadopago' || paymentGateway === 'paypal') && (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => initiateGatewayFlow(true)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 text-[11px] font-semibold whitespace-nowrap cursor-pointer"
                    >
                      Simular flujo ahora
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-2.5">
                <button
                  type="submit"
                  disabled={numericAmount <= 0 || isProcessing}
                  className={`w-full py-3.5 font-cinzel font-bold text-sm rounded-2xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                    numericAmount >= 500
                      ? paymentGateway === 'mercadopago'
                        ? 'bg-[#009EE3] hover:bg-[#008ED0] text-stone-950 cursor-pointer'
                        : paymentGateway === 'paypal'
                        ? 'bg-[#FFC439] hover:bg-[#F7B618] text-stone-950 cursor-pointer'
                        : 'bg-rose-600 hover:bg-rose-500 text-white hover:shadow-rose-900/30 cursor-pointer'
                      : numericAmount > 0
                      ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {paymentGateway === 'mercadopago' ? (
                    <Wallet className={`w-4 h-4 text-black ${isProcessing ? 'animate-pulse' : ''}`} />
                  ) : donationFrequency === 'monthly' ? (
                    <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  ) : (
                    <Heart className={`w-4 h-4 fill-current ${numericAmount > 0 ? 'animate-pulse' : ''}`} />
                  )}
                  <span>
                    {isProcessing
                      ? 'Procesando...'
                      : numericAmount >= 500
                      ? donationFrequency === 'monthly'
                        ? paymentGateway === 'paypal'
                          ? `Suscribirme USD $${usdEquivalent.toFixed(2)} / mes`
                          : `Suscribirme $${numericAmount.toLocaleString('es-AR')} / mes`
                        : paymentGateway === 'paypal'
                        ? `Donar USD $${usdEquivalent.toFixed(2)} con PayPal`
                        : paymentGateway === 'mercadopago'
                        ? `Donar $${numericAmount.toLocaleString('es-AR')} con Mercado Pago`
                        : `Donar $${numericAmount.toLocaleString('es-AR')} con Tarjeta`
                      : numericAmount > 0
                      ? `Monto mínimo $500 (Ingresaste $${numericAmount.toLocaleString('es-AR')})`
                      : 'Ingresá un monto para donar'}
                  </span>
                </button>

                {(paymentGateway === 'mercadopago' || paymentGateway === 'paypal') && (
                  <button
                    type="button"
                    disabled={numericAmount < 500 || isProcessing}
                    onClick={() => initiateGatewayFlow(true)}
                    className="w-full py-2.5 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {paymentGateway === 'mercadopago'
                      ? 'Simular redirección a Mercado Pago'
                      : 'Simular redirección a PayPal'}
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Donación protegida con cifrado SSL de 256 bits y deducción impositiva.</span>
              </div>
            </form>
          )}
          </div>

          {/* Aside de Agradecimiento Cercano con Imagen (sin quitar protagonismo al formulario) */}
          <aside
            aria-label="Agradecimiento por tu donación"
            className="lg:col-span-5 order-2 lg:sticky lg:top-24 bg-[#f5efe6] rounded-3xl overflow-hidden border border-stone-300/80 shadow-md"
          >
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src="/assets/images/midjourney-social.png"
                alt="Voluntarios y vecinos compartiendo mate y sonrisas en Fundación LumenCor"
                className="w-full h-full object-cover object-[50%_38%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/15 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center gap-2 text-amber-200">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 shrink-0" />
                <span className="text-[11px] font-cinzel font-semibold uppercase tracking-widest">
                  Gracias por tender tu mano
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7 space-y-5 text-stone-800">
              <div className="space-y-2.5">
                <h2 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                  Gracias de corazón por acompañarnos
                </h2>
                <p className="text-sm text-stone-700 leading-relaxed">
                  Detrás de cada aporte hay mucho más que una ayuda material: hay un abrazo silencioso que le recuerda a quienes hoy duermen a la intemperie que no están solos.
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-stone-300/70">
                <p className="text-[11px] font-cinzel font-semibold uppercase tracking-wider text-amber-900">
                  Lo que tu gesto hace posible hoy:
                </p>
                <ul className="space-y-2.5 text-xs text-stone-700">
                  <li className="flex items-start gap-2.5">
                    <Utensils className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Mesa compartida:</strong> raciones recién cocinadas y desayuno caliente en cada ronda nocturna.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Home className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Refugio y abrigo:</strong> frazadas limpias, ropa seca y kits de higiene personal.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>Nuevos comienzos:</strong> talleres de oficios y acompañamiento humano para volver a empezar.
                    </span>
                  </li>
                </ul>
              </div>

              <blockquote className="bg-white/75 border-l-4 border-rose-500 rounded-r-xl p-4 text-xs italic text-stone-700 leading-relaxed">
                «No se trata solo de dar lo que sobra, sino de compartir la mesa y la esperanza. Gracias por ser parte de LumenCor.»
                <footer className="mt-1.5 not-italic font-semibold text-stone-900 text-[11px]">
                  — Equipo y Voluntarios de Fundación LumenCor
                </footer>
              </blockquote>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal de Checkout / Simulación de Redirección para Mercado Pago y PayPal */}
      <PaymentCheckoutModal
        session={gatewaySession}
        isSubmitting={isProcessing}
        errorMessage={modalError}
        onClose={() => {
          setGatewaySession(null);
          setModalError(null);
        }}
        onConfirmInteractive={handleConfirmGatewaySession}
      />
    </div>
  );
};