import { useEffect } from 'react';
import { deliveryProvider } from '../services/delivery/SimulatedDeliveryProvider';
import { isActive, useOrders } from '../store/orders';

/**
 * Advances every live order's status from the delivery provider once per second.
 * The order store remains the single source of truth for screens (Orders, Track, ...).
 * When the real backend exists, this is replaced by a WebSocket/STOMP subscription.
 */
export default function SimulationRunner() {
  useEffect(() => {
    const tick = () => {
      const { orders, setStatus } = useOrders.getState();
      const now = Date.now();
      orders.forEach((o) => {
        if (o.simStartAt == null || !isActive(o)) return;
        const st = deliveryProvider.getStatus(o, now);
        if (st.status !== o.status) setStatus(o.id, st.status, now);
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return null;
}
