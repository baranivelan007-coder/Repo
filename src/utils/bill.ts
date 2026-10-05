// Bill rules. These mirror the Figma numbers (₹448 -> ₹30 fee, -₹20 promo, ₹22 taxes => ₹480).
// In a real product the BACKEND recalculates this - never trust totals from the client.
export const DELIVERY_FEE = 30;
export const TAXES_AND_CHARGES = 22;
export const PROMO_DISCOUNT = 20;
export const PROMO_MIN_SUBTOTAL = 200;

export type Bill = {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxes: number;
  total: number;
};

export function calcBill(subtotal: number): Bill {
  if (subtotal <= 0) return { subtotal: 0, deliveryFee: 0, discount: 0, taxes: 0, total: 0 };
  const discount = subtotal >= PROMO_MIN_SUBTOTAL ? PROMO_DISCOUNT : 0;
  const total = subtotal + DELIVERY_FEE - discount + TAXES_AND_CHARGES;
  return { subtotal, deliveryFee: DELIVERY_FEE, discount, taxes: TAXES_AND_CHARGES, total };
}
