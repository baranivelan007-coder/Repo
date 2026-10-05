// MOCK payment. No real gateway is configured - this only simulates latency.
// A real provider (Razorpay, etc.) would be called from the backend, never from the app.
import { PaymentMethod } from '../types';

export type PaymentResult = { ok: true; reference: string } | { ok: false; reason: string };

export async function payMock(method: PaymentMethod, amount: number): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 2400));
  if (amount <= 0) return { ok: false, reason: 'Invalid amount' };
  return { ok: true, reference: `MOCK-${method}-${Date.now()}` };
}
