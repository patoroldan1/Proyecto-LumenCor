import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartSummary,
  calculateDonationImpact,
  validateDonationInput,
} from './cartAndDonationRules.ts';

test('calculateCartSummary calculates items total and standard shipping', () => {
  const items = [
    { id: '1', title: 'Libro A', price: 5000, quantity: 2 },
    { id: '2', title: 'Libro B', price: 8000, quantity: 1 },
  ];
  const summary = calculateCartSummary(items, 25000);
  assert.equal(summary.subtotal, 18000);
  assert.equal(summary.totalItems, 3);
  assert.equal(summary.shipping, 2500);
  assert.equal(summary.total, 20500);
  assert.equal(summary.isFreeShipping, false);
});

test('calculateCartSummary grants free shipping above threshold', () => {
  const items = [
    { id: '1', title: 'Compendio', price: 30000, quantity: 1 },
  ];
  const summary = calculateCartSummary(items, 25000);
  assert.equal(summary.subtotal, 30000);
  assert.equal(summary.shipping, 0);
  assert.equal(summary.total, 30000);
  assert.equal(summary.isFreeShipping, true);
});

test('calculateDonationImpact returns correct impact estimates', () => {
  const impact = calculateDonationImpact(15000);
  assert.equal(impact.meals, 15);
  assert.equal(impact.hygieneKits, 3);
  assert.equal(impact.shelterNights, 1);
});

test('validateDonationInput correctly validates amounts and emails', () => {
  assert.equal(validateDonationInput(0, 'user@example.com').isValid, false);
  assert.equal(validateDonationInput(-50, 'user@example.com').isValid, false);
  assert.equal(validateDonationInput(1000, 'notanemail').isValid, false);
  assert.equal(validateDonationInput(1000, 'voluntario@fundacion.org').isValid, true);
});
