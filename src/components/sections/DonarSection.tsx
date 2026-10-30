/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { calculateDonationImpact, validateDonationInput } from '../../utils/cartAndDonationRules.ts';
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
} from 'lucide-react';

export const DonarSection: React.FC = () => {
  const [donationFrequency, setDonationFrequency] = useState<'monthly' | 'one-time'>('monthly');
  const [donationAmount, setDonationAmount] = useState<string>('0');
  const [autoIncreaseAccepted, setAutoIncreaseAccepted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Form State
  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    dni: '',
    paymentMethod: 'tarjeta',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<{
    id: string;
    amount: number;
    frequency: string;
    hasAutoIncrease: boolean;
    name: string;
    email: string;
    date: string;
  } | null>(null);

  const numericAmount = Number(donationAmount) || 0;
  const impact = calculateDonationImpact(numericAmount);

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de monto e email
    const validation = validateDonationInput(numericAmount, donorData.email);
    if (!validation.isValid) {
      setFormError(validation.error || 'Por favor verifica el monto ingresado.');
      return;
    }

    if (!donorData.name.trim()) {
      setFormError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    // Validación de autorización obligatoria para donación mensual (10% cada 3 meses)
    if (donationFrequency === 'monthly' && !autoIncreaseAccepted) {
      setFormError('Para donaciones mensuales, es necesario autorizar el ajuste trimestral del 10%.');
      return;
    }

    setFormError(null);
    setReceiptData({
      id: `FCE-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: numericAmount,
      frequency: donationFrequency === 'monthly' ? 'Mensual Recurrente' : 'Aporte Único',
      hasAutoIncrease: donationFrequency === 'monthly' && autoIncreaseAccepted,
      name: donorData.name,
      email: donorData.email,
      date: new Date().toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-900 pb-20">
      {/* Hero Header */}
      <div className="relative bg-stone-900 text-stone-100 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <img
            src="/assets/images/pan_solidario.jpg"
            alt="Manos compartiendo pan"
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

      {/* Contenedor Principal Centrado para el Formulario de Donación */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {receiptData ? (
            <div className="py-6 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  ¡Gracias de Corazón, {receiptData.name}!
                </h3>
                <p className="text-xs text-stone-500">
                  Tu compromiso sostiene la esperanza de cientos de personas que viven a la intemperie.
                </p>
              </div>

              {/* Digital Receipt */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                  <span className="font-cinzel font-semibold text-stone-800">Comprobante de Donación</span>
                  <span className="text-amber-800 font-mono font-medium">{receiptData.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div>
                    <span className="text-stone-400 block text-[10px]">Donante</span>
                    <span className="font-semibold text-stone-900">{receiptData.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Email</span>
                    <span className="font-semibold text-stone-900">{receiptData.email}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Modalidad</span>
                    <span className="font-semibold text-stone-900">{receiptData.frequency}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px]">Fecha</span>
                    <span className="font-semibold text-stone-900">{receiptData.date}</span>
                  </div>
                </div>

                {receiptData.hasAutoIncrease && (
                  <div className="pt-2 border-t border-stone-200 flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 p-2 rounded-lg">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Incluye actualización trimestral del 10% autorizada.</span>
                  </div>
                )}

                <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                  <span className="text-stone-700 font-medium">Monto Aportado:</span>
                  <span className="font-serif text-xl font-bold text-stone-900">
                    ${receiptData.amount.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {/* Botón de Imprimir: Negro con texto blanco */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase font-cinzel"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Imprimir Comprobante</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleDonateSubmit} className="space-y-6">
              {/* Selector de Modalidad (Frecuencia) */}
              <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                <button
                  type="button"
                  onClick={() => setDonationFrequency('monthly')}
                  className={`flex-1 py-2 rounded-lg text-xs font-cinzel uppercase font-semibold transition-all cursor-pointer ${
                    donationFrequency === 'monthly'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Donación Mensual Recurrente
                </button>
                <button
                  type="button"
                  onClick={() => setDonationFrequency('one-time')}
                  className={`flex-1 py-2 rounded-lg text-xs font-cinzel uppercase font-semibold transition-all cursor-pointer ${
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
                  <label className="block text-xs font-medium text-stone-700 font-cinzel uppercase tracking-wider">
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
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      value={donationAmount === '0' ? '' : Number(donationAmount).toLocaleString('es-AR')}
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
                      Monto listo para donar: ${numericAmount.toLocaleString('es-AR')}
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
                    {/* Fila de utilidades: +000, 0, Borrar último */}
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
                    <span className="text-[10px] text-stone-500">Noches de abrigo</span>
                  </div>
                </div>
              </div>

              {/* Datos del Donante */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Nombre y Apellido *</label>
                  <input
                    type="text"
                    required
                    value={donorData.name}
                    onChange={(e) => setDonorData({ ...donorData, name: e.target.value })}
                    placeholder="Ej. Juan Carlos Ramos"
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={donorData.email}
                      onChange={(e) => setDonorData({ ...donorData, email: e.target.value })}
                      placeholder="tu@email.com"
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">DNI o CUIT (opcional para recibo)</label>
                    <input
                      type="text"
                      value={donorData.dni}
                      onChange={(e) => setDonorData({ ...donorData, dni: e.target.value })}
                      placeholder="Número de documento"
                      className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Medio de Pago</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${donorData.paymentMethod === 'tarjeta' ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold' : 'border-stone-200 bg-stone-50 text-stone-600'}`}>
                      <input
                        type="radio"
                        name="donorPay"
                        value="tarjeta"
                        checked={donorData.paymentMethod === 'tarjeta'}
                        onChange={() => setDonorData({ ...donorData, paymentMethod: 'tarjeta' })}
                        className="sr-only"
                      />
                      <CreditCard className="w-4 h-4 text-rose-600" />
                      <span>Tarjeta Débito / Crédito</span>
                    </label>
                    <label className={`p-2.5 rounded-xl border cursor-pointer flex items-center gap-2 ${donorData.paymentMethod === 'mercadopago' ? 'border-rose-500 bg-rose-50 text-rose-900 font-semibold' : 'border-stone-200 bg-stone-50 text-stone-600'}`}>
                      <input
                        type="radio"
                        name="donorPay"
                        value="mercadopago"
                        checked={donorData.paymentMethod === 'mercadopago'}
                        onChange={() => setDonorData({ ...donorData, paymentMethod: 'mercadopago' })}
                        className="sr-only"
                      />
                      <span className="w-4 h-4 text-blue-500 font-bold">MP</span>
                      <span>Mercado Pago / CVU</span>
                    </label>
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={numericAmount <= 0}
                className={`w-full py-3.5 font-cinzel font-semibold text-sm rounded-2xl uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 ${
                  numericAmount >= 500
                    ? 'bg-rose-600 hover:bg-rose-500 text-white hover:shadow-rose-900/30 cursor-pointer'
                    : numericAmount > 0
                    ? 'bg-amber-600 hover:bg-amber-500 text-white cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Heart className={`w-4 h-4 fill-current ${numericAmount > 0 ? 'animate-pulse' : ''}`} />
                <span>
                  {numericAmount >= 500
                    ? `Donar $${numericAmount.toLocaleString('es-AR')} ${donationFrequency === 'monthly' ? '/ mes' : ''}`
                    : numericAmount > 0
                    ? `Monto mínimo $500 (Ingresaste $${numericAmount.toLocaleString('es-AR')})`
                    : 'Ingresá un monto para donar'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Donación protegida con cifrado SSL de 256 bits y deducción impositiva.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};