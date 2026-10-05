import { LatLng, Order, OrderStatus } from '../../types';

export type DeliveryState = {
  status: OrderStatus;
  /** 0..1 progress of the whole delivery */
  overall: number;
  /** 0..1 progress inside the current phase */
  phaseProgress: number;
  phase: 'toRestaurant' | 'pickup' | 'toCustomer' | 'done';
  etaMin: number;
  riderLocation: LatLng;
};

/**
 * Delivery provider abstraction. The order system only depends on this interface,
 * so the simulation can later be replaced by our own Partner app (WebSocket GPS)
 * or an external logistics API without touching screens.
 */
export interface DeliveryProvider {
  assignOrder(order: Order): Promise<{ deliveryId: string; riderName: string }>;
  getStatus(order: Order, now?: number): DeliveryState;
  getLocation(order: Order, now?: number): LatLng;
  cancelDelivery(order: Order): Promise<void>;
}
