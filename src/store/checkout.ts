import { create } from 'zustand';
import { PaymentMethod } from '../types';

type Checkout = { method: PaymentMethod; setMethod: (m: PaymentMethod) => void };
export const useCheckout = create<Checkout>((set) => ({ method: 'UPI', setMethod: (method) => set({ method }) }));
