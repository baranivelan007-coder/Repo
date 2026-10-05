import { useEffect, useState } from 'react';
import { useAuth } from '../store/auth';
import { useCart } from '../store/cart';
import { useFavorites } from '../store/favorites';
import { useLocationStore } from '../store/location';
import { useOrders } from '../store/orders';

const stores = [useAuth, useCart, useOrders, useLocationStore, useFavorites];

/** true once every persisted store has been restored from AsyncStorage. */
export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const check = () => setReady(stores.every((s) => s.persist.hasHydrated()));
    check();
    const unsubs = stores.map((s) => s.persist.onFinishHydration(check));
    return () => unsubs.forEach((u) => u());
  }, []);
  return ready;
}
