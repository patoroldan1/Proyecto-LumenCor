/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CreditCard, Lock, RefreshCw } from 'lucide-react';
import {
  CardCategory,
  CardFormDetails,
  DonationFrequency,
  detectCardBrand,
  formatCardExpiry,
  formatCardNumber,
  getCardBrandLabel,
  sanitizeDigits,
} from '../../utils/paymentRules.ts';

interface CardPaymentFieldsProps {
  cardDetails: CardFormDetails;
  onChange: (updated: CardFormDetails) => void;
  fieldErrors: Record<string, string>;
  frequency: DonationFrequency;
}

export const CardPaymentFields: React.FC<CardPaymentFieldsProps> = ({
  cardDetails,
  onChange,
  fieldErrors,
  frequency,
}) => {
  const brand = detectCardBrand(cardDetails.number);
  const brandLabel = getCardBrandLabel(brand);
  const digits = sanitizeDigits(cardDetails.number);
  const last4 = digits.length >= 4 ? digits.slice(-4) : '••••';

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...cardDetails,
      number: formatCardNumber(e.target.value),
    });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...cardDetails,
      expiry: formatCardExpiry(e.target.value),
    });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...cardDetails,
      cvv: sanitizeDigits(e.target.value).slice(0, 4),
    });
  };

  const setCardType = (cardType: CardCategory) => {
    onChange({
      ...cardDetails,
      cardType,
    });
  };

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-rose-600" />
          <span className="text-xs font-cinzel font-semibold uppercase tracking-wider text-stone-800">
            Datos de tu Tarjeta
          </span>
        </div>

        {/* Selector Débito vs Crédito */}
        <div className="inline-flex rounded-lg bg-stone-200/70 p-0.5 border border-stone-300/70">
          <button
            type="button"
            onClick={() => setCardType('credito')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              cardDetails.cardType === 'credito'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Crédito
          </button>
          <button
            type="button"
            onClick={() => setCardType('debito')}
            className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              cardDetails.cardType === 'debito'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Débito
          </button>
        </div>
      </div>

      {/* Vista previa compacta de la tarjeta */}
      <div className="rounded-xl bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-stone-100 p-4 shadow-md flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="uppercase tracking-widest text-amber-300 font-cinzel font-semibold">
            {cardDetails.cardType === 'debito' ? 'Tarjeta de Débito' : 'Tarjeta de Crédito'}
          </span>
          <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold tracking-wide">
            {brandLabel}
          </span>
        </div>

        <p className="font-mono text-sm sm:text-base tracking-[0.18em] text-white">
          {cardDetails.number
            ? digits.length > 4
              ? `•••• •••• •••• ${last4}`
              : cardDetails.number
            : '•••• •••• •••• ••••'}
        </p>

        <div className="flex items-center justify-between text-[11px] text-stone-300">
          <span className="uppercase truncate max-w-[65%]">
            {cardDetails.holderName.trim() || 'NOMBRE DEL TITULAR'}
          </span>
          <span className="font-mono">
            {cardDetails.expiry || 'MM/AA'}
          </span>
        </div>
      </div>

      {/* Campos de ingreso */}
      <div className="space-y-3">
        <div>
          <label htmlFor="card-number" className="block text-xs font-medium text-stone-700 mb-1">
            Número de Tarjeta *
          </label>
          <input
            id="card-number"
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            value={cardDetails.number}
            onChange={handleNumberChange}
            placeholder="4111 1111 1111 1111"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 ${
              fieldErrors.number
                ? 'border-rose-400 focus:ring-rose-500'
                : 'border-stone-300 focus:ring-rose-500'
            }`}
          />
          {fieldErrors.number && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.number}</p>
          )}
        </div>

        <div>
          <label htmlFor="card-holder" className="block text-xs font-medium text-stone-700 mb-1">
            Nombre y Apellido del Titular *
          </label>
          <input
            id="card-holder"
            type="text"
            autoComplete="cc-name"
            value={cardDetails.holderName}
            onChange={(e) =>
              onChange({ ...cardDetails, holderName: e.target.value.toUpperCase() })
            }
            placeholder="COMO FIGURA EN LA TARJETA"
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm uppercase focus:outline-none focus:ring-2 ${
              fieldErrors.holderName
                ? 'border-rose-400 focus:ring-rose-500'
                : 'border-stone-300 focus:ring-rose-500'
            }`}
          />
          {fieldErrors.holderName && (
            <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.holderName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="card-expiry" className="block text-xs font-medium text-stone-700 mb-1">
              Vencimiento (MM/AA) *
            </label>
            <input
              id="card-expiry"
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              value={cardDetails.expiry}
              onChange={handleExpiryChange}
              placeholder="12/28"
              maxLength={5}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 ${
                fieldErrors.expiry
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-stone-300 focus:ring-rose-500'
              }`}
            />
            {fieldErrors.expiry && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.expiry}</p>
            )}
          </div>

          <div>
            <label htmlFor="card-cvv" className="block text-xs font-medium text-stone-700 mb-1">
              Código CVV *
            </label>
            <input
              id="card-cvv"
              type="password"
              inputMode="numeric"
              autoComplete="cc-csc"
              value={cardDetails.cvv}
              onChange={handleCvvChange}
              placeholder={brand === 'amex' ? '1234' : '123'}
              maxLength={4}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 ${
                fieldErrors.cvv
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-stone-300 focus:ring-rose-500'
              }`}
            />
            {fieldErrors.cvv && (
              <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.cvv}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-600">
        {frequency === 'monthly' ? (
          <>
            <RefreshCw className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Se programará el débito automático mensual en tu tarjeta. Podrás cancelar la suscripción en cualquier momento.
            </span>
          </>
        ) : (
          <>
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Se realizará un único cargo por el monto seleccionado con encriptación de seguridad bancaria.
            </span>
          </>
        )}
      </div>
    </div>
  );
};