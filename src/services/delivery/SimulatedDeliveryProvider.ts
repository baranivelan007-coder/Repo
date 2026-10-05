import { LatLng, Order, OrderStatus } from '../../types';
import { lerp } from '../../utils/geo';
import { pointAlong } from '../../utils/route';
import { DeliveryProvider, DeliveryState } from './DeliveryProvider';

/** Demo timings (seconds). Make these bigger for a slower, more realistic demo. */
export const DEMO = {
  confirmSec: 1.5,
  prepSec: 10, // rider rides to restaurant while food is prepared
  pickupSec: 3,
  rideSec: 45, // restaurant -> customer
  etaTotalMin: 15, // what the "Arriving in N min" label counts down from
};

const ease = (t: number) => t * t * (3 - 2 * t);

export class SimulatedDeliveryProvider implements DeliveryProvider {
  async assignOrder(order: Order) {
    return { deliveryId: `D-${order.id}`, riderName: 'Ravi K' };
  }

  async cancelDelivery(): Promise<void> {}

  getStatus(order: Order, now: number = Date.now()): DeliveryState {
    if (order.simStartAt == null) {
      return {
        status: order.status,
        overall: order.status === 'DELIVERED' ? 1 : 0,
        phaseProgress: 1,
        phase: 'done',
        etaMin: 0,
        riderLocation: order.dest,
      };
    }
    const t = Math.max(0, (now - order.simStartAt) / 1000);
    const { confirmSec, prepSec, pickupSec, rideSec, etaTotalMin } = DEMO;
    const total = prepSec + pickupSec + rideSec;

    let status: OrderStatus;
    let phase: DeliveryState['phase'];
    let pp: number;
    if (t < prepSec) {
      status = t < confirmSec ? 'CONFIRMED' : 'PREPARING';
      phase = 'toRestaurant';
      pp = t / prepSec;
    } else if (t < prepSec + pickupSec) {
      status = 'PICKED_UP';
      phase = 'pickup';
      pp = (t - prepSec) / pickupSec;
    } else if (t < total) {
      status = 'ON_THE_WAY';
      phase = 'toCustomer';
      pp = (t - prepSec - pickupSec) / rideSec;
    } else {
      status = 'DELIVERED';
      phase = 'done';
      pp = 1;
    }
    const overall = Math.min(1, t / total);
    const etaMin = status === 'DELIVERED' ? 0 : Math.max(1, Math.ceil(etaTotalMin * (1 - overall)));
    return { status, overall, phaseProgress: pp, phase, etaMin, riderLocation: this.locationFor(order, phase, pp) };
  }

  getLocation(order: Order, now: number = Date.now()): LatLng {
    return this.getStatus(order, now).riderLocation;
  }

  private locationFor(order: Order, phase: DeliveryState['phase'], pp: number): LatLng {
    switch (phase) {
      case 'toRestaurant':
        return lerp(order.riderStart, order.origin, ease(pp));
      case 'pickup':
        return order.origin;
      case 'toCustomer':
        return pointAlong(order.route, pp);
      default:
        return order.dest;
    }
  }
}

export const deliveryProvider: DeliveryProvider = new SimulatedDeliveryProvider();
