/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type PaymentGateway = 'card' | 'mercadopago' | 'paypal';
export type DonationFrequency = 'monthly' | 'one-time';
export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'cabal' | 'naranja' | 'unknown';
export type CardCategory = 'credito' | 'debito';

export interface CardFormDetails {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
  cardType: CardCategory;
}

export const DEFAULT_USD_ARS_RATE = 1050;

/**
 * Strips non-numeric characters from card input
 */
export function sanitizeDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Detects major card networks used in Argentina and internationally
 */
export function detectCardBrand(cardNumber: string): CardBrand {
  const digits = sanitizeDigits(cardNumber);
  if (!digits) return 'unknown';

  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^(6042|6043|6044|589657)/.test(digits)) return 'cabal';
  if (/^589562/.test(digits)) return 'naranja';

  return 'unknown';
}

/**
 * Formats card number for readable input display
 */
export function formatCardNumber(cardNumber: string): string {
  const digits = sanitizeDigits(cardNumber);
  const brand = detectCardBrand(digits);

  if (brand === 'amex') {
    const capped = digits.slice(0, 15);
    const part1 = capped.slice(0, 4);
    const part2 = capped.slice(4, 10);
    const part3 = capped.slice(10, 15);
    return [part1, part2, part3].filter(Boolean).join(' ');
  }

  const capped = digits.slice(0, 16);
  return capped.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Validates PAN using the Luhn checksum algorithm
 */
export function isValidCardNumber(cardNumber: string): boolean {
  const digits = sanitizeDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;
  if (/^0+$/.test(digits)) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

/**
 * Formats expiry string into MM/AA
 */
export function formatCardExpiry(value: string): string {
  const digits = sanitizeDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

/**
 * Checks whether MM/AA expiry is valid and not in the past
 */
export function isValidCardExpiry(expiry: string, referenceDate: Date = new Date()): boolean {
  const match = /^(\d{2})\/(\d{2})$/.exec(expiry.trim());
  if (!match) return false;

  const month = Number(match[1]);
  const yearTwoDigits = Number(match[2]);

  if (month < 1 || month > 12) return false;

  const fullYear = 2000 + yearTwoDigits;
  const currentYear = referenceDate.getFullYear();
  const currentMonth = referenceDate.getMonth() + 1;

  if (fullYear < currentYear) return false;
  if (fullYear === currentYear && month < currentMonth) return false;

  return fullYear <= currentYear + 20;
}

/**
 * Checks CVV length according to card network
 */
export function isValidCvv(cvv: string, brand: CardBrand): boolean {
  const digits = sanitizeDigits(cvv);
  if (brand === 'amex') {
    return digits.length === 4;
  }
  return digits.length === 3 || digits.length === 4;
}

/**
 * Validates full credit/debit card form inputs without bypassing empty/invalid states
 */
export function validateCardDetails(
  details: CardFormDetails,
  referenceDate: Date = new Date()
): { isValid: boolean; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  const digits = sanitizeDigits(details.number);
  const brand = detectCardBrand(digits);

  if (!digits) {
    fieldErrors.number = 'Ingresá el número de tu tarjeta.';
  } else if (!isValidCardNumber(digits)) {
    fieldErrors.number = 'El número de tarjeta ingresado no es válido.';
  }

  if (!details.holderName || details.holderName.trim().length < 3) {
    fieldErrors.holderName = 'Ingresá el nombre del titular tal como figura en la tarjeta.';
  }

  if (!details.expiry) {
    fieldErrors.expiry = 'Ingresá la fecha de vencimiento (MM/AA).';
  } else if (!isValidCardExpiry(details.expiry, referenceDate)) {
    fieldErrors.expiry = 'Fecha de vencimiento inválida o tarjeta vencida.';
  }

  if (!details.cvv) {
    fieldErrors.cvv = 'Ingresá el código de seguridad.';
  } else if (!isValidCvv(details.cvv, brand)) {
    fieldErrors.cvv =
      brand === 'amex'
        ? 'El código de seguridad de American Express tiene 4 dígitos.'
        : 'El código de seguridad debe tener 3 o 4 dígitos.';
  }

  return {
    isValid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

/**
 * Converts ARS donation amount to USD for PayPal processing
 */
export function convertArsToUsd(arsAmount: number, rate: number = DEFAULT_USD_ARS_RATE): number {
  if (isNaN(arsAmount) || arsAmount <= 0 || isNaN(rate) || rate <= 0) {
    return 0;
  }
  const raw = arsAmount / rate;
  const rounded = Math.round(raw * 100) / 100;
  return Math.max(1, rounded);
}

/**
 * Returns formatted next billing date (1 month ahead) in es-AR
 */
export function calculateNextBillingDate(fromDate: Date = new Date()): string {
  const next = new Date(fromDate.getTime());
  next.setMonth(next.getMonth() + 1);
  return next.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Returns human-friendly label for a card brand
 */
export function getCardBrandLabel(brand: CardBrand): string {
  switch (brand) {
    case 'visa':
      return 'Visa';
    case 'mastercard':
      return 'Mastercard';
    case 'amex':
      return 'American Express';
    case 'cabal':
      return 'Cabal';
    case 'naranja':
      return 'Naranja X';
    default:
      return 'Tarjeta';
  }
}