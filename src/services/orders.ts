// Order creation. In the real system this is POST /api/orders and the BACKEND
// recalculates prices from its own database. Here we recompute from the menu catalogue
// instead of trusting totals coming from the screens.
import { getMenuItem } from '../data/menu';
import { LatLng, Order, PaymentMethod } from '../types';
import { calcBill } from '../utils/bill';
import { offsetPoint } from '../utils/geo';
import { fetchRoute } from '../utils/route';
import { RestaurantWithPos } from './api';
import { deliveryProvider } from './delivery/SimulatedDeliveryProvider';

export type PlaceOrderInput = {
  restaurant: RestaurantWithPos;
  lines: Record<string, number>;
  method: PaymentMethod;
  dest: LatLng;
  addressTitle: string;
  addressLine: string;
};

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const items = Object.entries(input.lines)
    .map(([id, qty]) => ({ m: getMenuItem(id), qty }))
    .filter((l) => l.m && l.m.available && l.m.restaurantId === input.restaurant.id)
    .map((l) => ({ id: l.m!.id, name: l.m!.name, price: l.m!.price, qty: l.qty }));
  if (items.length === 0) throw new Error('Cart is empty');

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const bill = calcBill(subtotal);
  const now = Date.now();
  const origin = input.restaurant.coords;
  const route = await fetchRoute(origin, input.dest);
  const riderStart = offsetPoint(origin, 0.55, (input.restaurant.bearing + 90) % 360);

  const order: Order = {
    id: `NM${10000 + Math.floor(Math.random() * 89999)}`,
    restaurantId: input.restaurant.id,
    restaurantName: input.restaurant.name,
    restaurantCuisine: input.restaurant.cuisine,
    items,
    itemCount: items.reduce((n, i) => n + i.qty, 0),
    ...bill,
    paymentMethod: input.method,
    addressTitle: input.addressTitle,
    addressLine: input.addressLine,
    status: 'CONFIRMED',
    createdAt: now,
    timeline: { PLACED: now, CONFIRMED: now },
    simStartAt: now,
    origin,
    dest: input.dest,
    riderStart,
    route,
  };
  await deliveryProvider.assignOrder(order);
  return order;
}
