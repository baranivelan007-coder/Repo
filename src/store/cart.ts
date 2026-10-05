import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { getMenuItem } from '../data/menu';
import { MenuItem } from '../types';
import { calcBill } from '../utils/bill';

type CartState = {
  restaurantId: string | null;
  lines: Record<string, number>; // itemId -> qty
  /** returns false when the item belongs to another restaurant (caller should confirm replace) */
  add: (item: MenuItem) => boolean;
  replaceWith: (item: MenuItem) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      lines: {},
      add: (item) => {
        const { restaurantId, lines } = get();
        const hasItems = Object.keys(lines).length > 0;
        if (hasItems && restaurantId && restaurantId !== item.restaurantId) return false;
        set({ restaurantId: item.restaurantId, lines: { ...lines, [item.id]: (lines[item.id] ?? 0) + 1 } });
        return true;
      },
      replaceWith: (item) => set({ restaurantId: item.restaurantId, lines: { [item.id]: 1 } }),
      increment: (id) => set((s) => ({ lines: { ...s.lines, [id]: (s.lines[id] ?? 0) + 1 } })),
      decrement: (id) =>
        set((s) => {
          const q = (s.lines[id] ?? 0) - 1;
          const lines = { ...s.lines };
          if (q <= 0) delete lines[id];
          else lines[id] = q;
          const empty = Object.keys(lines).length === 0;
          return { lines, restaurantId: empty ? null : s.restaurantId };
        }),
      clear: () => set({ restaurantId: null, lines: {} }),
    }),
    { name: 'navimeal.cart.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);

/** Derived cart data: items with menu info, counts and the bill. */
export function useCartSummary() {
  const lines = useCart((s) => s.lines);
  const restaurantId = useCart((s) => s.restaurantId);
  return useMemo(() => {
    const items = Object.entries(lines)
      .map(([id, qty]) => ({ item: getMenuItem(id), qty }))
      .filter((l): l is { item: MenuItem; qty: number } => !!l.item && l.item.available);
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.qty * l.item.price, 0);
    return { restaurantId, items, count, subtotal, bill: calcBill(subtotal) };
  }, [lines, restaurantId]);
}
