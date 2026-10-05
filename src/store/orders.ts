import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Order, OrderStatus } from '../types';

const zero = { latitude: 0, longitude: 0 };

// Demo history shown in the Figma "My Orders" screen.
const SEED: Order[] = [
  {
    id: 'NM48190', restaurantId: 'pizza-corner', restaurantName: 'Pizza Corner', restaurantCuisine: 'Italian • Pizza',
    items: [
      { id: 'margherita', name: 'Margherita Pizza', price: 199, qty: 1 },
      { id: 'farmhouse', name: 'Farmhouse Pizza', price: 249, qty: 1 },
      { id: 'garlic-dip', name: 'Garlic Dip (free)', price: 0, qty: 1 },
    ],
    itemCount: 3, subtotal: 448, deliveryFee: 30, discount: 20, taxes: 22, total: 480,
    paymentMethod: 'UPI', addressTitle: 'Anna Nagar, Chennai', addressLine: '12, 2nd Avenue • Home',
    status: 'DELIVERED', createdAt: new Date(2026, 8, 18, 20, 12).getTime(), timeline: {},
    simStartAt: null, origin: zero, dest: zero, riderStart: zero, route: [], seeded: true,
  },
  {
    id: 'NM47955', restaurantId: 'morning-brew', restaurantName: 'Morning Brew', restaurantCuisine: 'Cafe • Beverages',
    items: [{ id: 'americano', name: 'Americano', price: 120, qty: 1 }],
    itemCount: 1, subtotal: 120, deliveryFee: 0, discount: 0, taxes: 0, total: 120,
    paymentMethod: 'UPI', addressTitle: 'Anna Nagar, Chennai', addressLine: '12, 2nd Avenue • Home',
    status: 'CANCELLED', createdAt: new Date(2026, 8, 15, 9, 5).getTime(), timeline: {},
    simStartAt: null, origin: zero, dest: zero, riderStart: zero, route: [], seeded: true,
  },
];

type OrdersState = {
  orders: Order[];
  addOrder: (o: Order) => void;
  setStatus: (id: string, status: OrderStatus, ts?: number) => void;
  setReview: (id: string, rating: number, comment: string) => void;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: SEED,
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      setStatus: (id, status, ts = Date.now()) =>
        set((s) => ({
          orders: s.orders.map((o) =>
            o.id === id ? { ...o, status, timeline: { ...o.timeline, [status]: ts } } : o
          ),
        })),
      setReview: (id, rating, comment) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, review: { rating, comment } } : o)) })),
    }),
    { name: 'navimeal.orders.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);

export const isActive = (o: Order) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED';
