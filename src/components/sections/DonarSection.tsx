/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { calculateDonationImpact, validateDonationInput } from '../../utils/cartAndDonationRules.ts';
import {
  Heart,
  Copy,
  Check,
  ShieldCheck,
  Utensils,
  Sparkles,
  Home,
  CreditCard,
  Building,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const DonarSection: React.FC = () => {
  const [donationFrequency, setDonationFrequency] = useState<'monthly' | 'one-time'>('monthly');
  const [selectedAmount, setSelectedAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
    name: string;
    email: string;
    date: string;
  } | null>(null);

  const presetAmounts = [3000, 5000, 10000, 25000, 50000];
  const activeAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;
  const impact = calculateDonationImpact(activeAmount);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateDonationInput(activeAmount, donorData.email);
    if (!validation.isValid) {
      setFormError(validation.error || 'Por favor verifica los datos ingresados.');
      return;
    }
    if (!donorData.name.trim()) {
      setFormError('Por favor ingresa tu nombre y apellido.');
      return;
    }

    setFormError(null);
    setReceiptData({
      id: `FCE-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: activeAmount,
      frequency: donationFrequency === 'monthly' ? 'Mensual Recurrente' : 'Aporte Único',
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        {/* Donation Portal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Donation Form & Calculator */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
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
                  <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                    <span className="text-stone-700 font-medium">Monto Aportado:</span>
                    <span className="font-serif text-xl font-bold text-rose-600">
                      ${receiptData.amount.toLocaleString('es-AR')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Imprimir Comprobante</span>
                  </button>
                  <button
                    onClick={() => {
                      setReceiptData(null);
                      setDonorData({ name: '', email: '', dni: '', paymentMethod: 'tarjeta' });
                    }}
                    className="flex-1 py-2.5 bg-stone-900 hover:bg-amber-600 text-white rounded-xl text-xs font-cinzel uppercase font-semibold transition-all"
                  >
                    Hacer Otra Donación
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDonateSubmit} className="space-y-6">
                {/* Frequency Selector */}
                <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
                  <button
                    type="button"
                    onClick={() => setDonationFrequency('monthly')}
                    className={`flex-1 py-2 rounded-lg text-xs font-cinzel uppercase font-semibold transition-all ${
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
                    className={`flex-1 py-2 rounded-lg text-xs font-cinzel uppercase font-semibold transition-all ${
                      donationFrequency === 'one-time'
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Donación Única
                  </button>
                </div>

                {/* Amount presets */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-2 font-cinzel uppercase tracking-wider">
                    Elegí el monto a aportar:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {presetAmounts.map((amt) => {
                      const isSelected = !isCustom && selectedAmount === amt;
                      return (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt);
                            setIsCustom(false);
                          }}
                          className={`
                            py-2.5 px-1 rounded-xl text-xs font-serif font-bold transition-all border
                            ${
                              isSelected
                                ? 'bg-amber-500 border-amber-600 text-stone-950 shadow-md scale-102'
                                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                            }
                          `}
                        >
                          ${amt.toLocaleString('es-AR')}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount option */}
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`text-xs font-medium text-stone-600 hover:text-stone-900 underline mb-1 ${isCustom ? 'text-amber-800 font-bold' : ''}`}
                    >
                      O ingresá otro monto personalizado:
                    </button>
                    {isCustom && (
                      <div className="relative mt-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 font-serif font-bold">
                          $
                        </span>
                        <input
                          type="number"
                          min="500"
                          step="500"
                          placeholder="Monto en ARS (mínimo $500)"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Concrete Impact Indicator */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 font-cinzel uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tu impacto directo estimado:</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                      <Utensils className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                      <span className="font-bold text-stone-900 block text-sm">{impact.meals}</span>
                      <span className="text-[10px] text-stone-500">Viandas calientes</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                      <Sparkles className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                      <span className="font-bold text-stone-900 block text-sm">{impact.hygieneKits}</span>
                      <span className="text-[10px] text-stone-500">Kits de higiene</span>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-amber-200">
                      <Home className="w-4 h-4 mx-auto text-amber-600 mb-1" />
                      <span className="font-bold text-stone-900 block text-sm">{impact.shelterNights}</span>
                      <span className="text-[10px] text-stone-500">Noches de abrigo</span>
                    </div>
                  </div>
                </div>

                {/* Donor Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={donorData.name}
                      onChange={(e) => setDonorData({ ...donorData, name: e.target.value })}
                      placeholder="Ej. Juan Carlos Ramos"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
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
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">DNI o CUIT (opcional para recibo)</label>
                      <input
                        type="text"
                        value={donorData.dni}
                        onChange={(e) => setDonorData({ ...donorData, dni: e.target.value })}
                        placeholder="Número de documento"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Payment Method Selector */}
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
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-cinzel font-semibold text-sm rounded-2xl uppercase tracking-wider transition-all shadow-lg hover:shadow-rose-900/30 flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-current animate-pulse" />
                  <span>Donar ${activeAmount.toLocaleString('es-AR')} {donationFrequency === 'monthly' ? '/ mes' : ''}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Donación protegida con cifrado SSL de 256 bits y deducción impositiva.</span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Bank Details & Transparency */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Bank Transfer Box */}
            <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-cinzel text-xs uppercase tracking-wider font-semibold">
                <Building className="w-4 h-4" />
                <span>Transferencia Bancaria Directa</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Podés transferir directamente desde cualquier banco o billetera virtual sin costo de comisión:
              </p>

              <div className="space-y-3 pt-1">
                {/* Alias */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">Alias de Mercado Pago / Banco</span>
                    <span className="font-mono text-sm text-amber-300 font-bold tracking-wider">
                      CAMINO.ESPERANZA.MP
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('CAMINO.ESPERANZA.MP', 'alias')}
                    className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                    title="Copiar Alias"
                  >
                    {copiedField === 'alias' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* CBU */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 uppercase block font-semibold">CBU / CVU</span>
                    <span className="font-mono text-xs text-stone-300 font-medium">
                      0000003100045892301984
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('0000003100045892301984', 'cbu')}
                    className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                    title="Copiar CBU"
                  >
                    {copiedField === 'cbu' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* CUIT & Holder */}
                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs text-stone-400 space-y-1">
                  <p><span className="text-stone-300 font-medium">Titular:</span> Fundación Camino y Esperanza</p>
                  <p><span className="text-stone-300 font-medium">CUIT:</span> 30-71689234-8 (Entidad Exenta)</p>
                  <p><span className="text-stone-300 font-medium">Banco:</span> Banco Credicoop / Cuenta Corriente</p>
                </div>
              </div>
            </div>

            {/* Transparency & Audit Box */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h4 className="font-serif text-lg font-bold text-stone-900">
                Compromiso de Transparencia
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Nuestra fundación rinde cuentas semestralmente ante la Inspección General de Justicia (IGJ) y publica sus balances auditados en forma abierta.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-600">Destino a programas en calle</span>
                  <span className="font-semibold text-stone-900">88%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100">
                  <span className="text-stone-600">Materiales de talleres & salud</span>
                  <span className="font-semibold text-stone-900">9%</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-stone-600">Gastos administrativos y logística</span>
                  <span className="font-semibold text-stone-900">3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
