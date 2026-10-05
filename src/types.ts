export type LatLng = { latitude: number; longitude: number };

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string; // e.g. "Italian • Pizza"
  tags: string[]; // category chips
  rating: number;
  reviews: string; // "1200+"
  deliveryMin: number;
  etaRange: string; // "20-25 min"
  distanceKm: number;
  bearing: number; // degrees from the customer (demo placement)
  priceForTwo: number;
  freeAbove: number;
  offerPct: number;
  offerUpTo: number;
  isOpen: boolean;
  hero: number; // require() id
  wide: number;
  logo: number | null;
  pinColor: string;
  pinIcon: string; // MaterialCommunityIcons name
};

export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: number;
  category: string;
  available: boolean;
};

export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'ON_THE_WAY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'UPI' | 'CARD' | 'COD';

export type OrderItem = { id: string; name: string; price: number; qty: number };

export type Order = {
  id: string; // NM48291
  restaurantId: string;
  restaurantName: string;
  restaurantCuisine: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  taxes: number;
  total: number;
  paymentMethod: PaymentMethod;
  addressTitle: string;
  addressLine: string;
  status: OrderStatus;
  createdAt: number;
  timeline: Partial<Record<OrderStatus, number>>;
  simStartAt: number | null; // null => not a live (simulated) order
  origin: LatLng; // restaurant
  dest: LatLng; // customer
  riderStart: LatLng;
  route: [number, number][]; // restaurant -> customer polyline
  review?: { rating: number; comment: string };
  seeded?: boolean;
};

export type User = { id: string; name: string; email: string };
