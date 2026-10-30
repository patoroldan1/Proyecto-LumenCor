/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

/**
 * Calculates subtotal, shipping, and total for book orders
 */
export function calculateCartSummary(items: CartItem[], freeShippingThreshold = 25000) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : 2500;
  const total = subtotal + shipping;

  return {
    subtotal,
    totalItems,
    shipping,
    total,
    isFreeShipping: subtotal >= freeShippingThreshold && subtotal > 0,
  };
}

/**
 * Calculates concrete humanitarian impact equivalents for donations
 */
export function calculateDonationImpact(amount: number) {
  // $1000 provides 1 warm meal
  const meals = amount <= 0 ? 0 : Math.max(1, Math.floor(amount / 1000));
  // $5000 provides a hygiene kit
  const hygieneKits = Math.floor(amount / 5000);
  // $15000 provides a night of shelter + hot shower + clean clothing
  const shelterNights = Math.floor(amount / 15000);

  return {
    meals,
    hygieneKits,
    shelterNights,
  };
}

/**
 * Validates donor email and amount
 */
export function validateDonationInput(amount: number, email: string): { isValid: boolean; error?: string } {
  if (isNaN(amount) || amount < 500) {
    return { isValid: false, error: 'El monto mínimo para donar es de $500 pesos.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { isValid: false, error: 'Por favor ingresa un correo electrónico válido.' };
  }
  return { isValid: true };
}