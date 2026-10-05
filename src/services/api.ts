// "Backend" boundary. Today it reads local demo data; later replace the bodies with
// fetch() calls (e.g. GET /api/restaurants/nearby?lat=&lng=) without touching any screen.
import { RESTAURANTS } from '../data/restaurants';
import { getMenuFor } from '../data/menu';
import { LatLng, MenuItem, Restaurant } from '../types';
import { offsetPoint } from '../utils/geo';

export type RestaurantWithPos = Restaurant & { coords: LatLng };

export function nearbyRestaurants(anchor: LatLng): RestaurantWithPos[] {
  return RESTAURANTS.map((r) => ({ ...r, coords: offsetPoint(anchor, r.distanceKm, r.bearing) }));
}

export function restaurantById(id: string, anchor: LatLng): RestaurantWithPos | undefined {
  return nearbyRestaurants(anchor).find((r) => r.id === id);
}

export function menuForRestaurant(id: string): MenuItem[] {
  return getMenuFor(id);
}
