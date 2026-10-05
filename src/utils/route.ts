import { LatLng } from '../types';
import { haversineKm } from './geo';

export type Route = [number, number][]; // [lat, lng]

/** Smooth S-curve between two points (used offline / when routing fails). */
export function fallbackRoute(a: LatLng, b: LatLng, n = 80): Route {
  const dx = b.longitude - a.longitude;
  const dy = b.latitude - a.latitude;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const amp = len * 0.14;
  const pts: Route = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const wob = Math.sin(t * Math.PI * 2) * amp * Math.sin(t * Math.PI);
    pts.push([a.latitude + dy * t + ny * wob, a.longitude + dx * t + nx * wob]);
  }
  return pts;
}

/**
 * Road route from the free public OSRM demo server (no API key).
 * Falls back to a curved line on any failure / timeout.
 * NOTE: the demo server is for light testing only - use your own routing service in production.
 */
export async function fetchRoute(a: LatLng, b: LatLng, timeoutMs = 3500): Promise<Route> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const url =
      `https://router.project-osrm.org/route/v1/driving/` +
      `${a.longitude},${a.latitude};${b.longitude},${b.latitude}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal: ctrl.signal });
    const json = await res.json();
    const coords: [number, number][] | undefined = json?.routes?.[0]?.geometry?.coordinates;
    if (!coords || coords.length < 2) return fallbackRoute(a, b);
    const step = Math.max(1, Math.floor(coords.length / 140));
    const pts: Route = [];
    for (let i = 0; i < coords.length; i += step) pts.push([coords[i][1], coords[i][0]]);
    const last = coords[coords.length - 1];
    pts.push([last[1], last[0]]);
    return [[a.latitude, a.longitude], ...pts, [b.latitude, b.longitude]];
  } catch {
    return fallbackRoute(a, b);
  } finally {
    clearTimeout(timer);
  }
}

export function pointAlong(route: Route, f: number): LatLng {
  if (route.length === 0) return { latitude: 0, longitude: 0 };
  if (route.length === 1 || f <= 0) return { latitude: route[0][0], longitude: route[0][1] };
  if (f >= 1) {
    const l = route[route.length - 1];
    return { latitude: l[0], longitude: l[1] };
  }
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < route.length; i++) {
    const d = haversineKm(
      { latitude: route[i - 1][0], longitude: route[i - 1][1] },
      { latitude: route[i][0], longitude: route[i][1] }
    );
    seg.push(d);
    total += d;
  }
  let target = total * f;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const t = seg[i] === 0 ? 0 : Math.min(1, target / seg[i]);
      return {
        latitude: route[i][0] + (route[i + 1][0] - route[i][0]) * t,
        longitude: route[i][1] + (route[i + 1][1] - route[i][1]) * t,
      };
    }
    target -= seg[i];
  }
  const l = route[route.length - 1];
  return { latitude: l[0], longitude: l[1] };
}

export const toLatLng = (r: Route): LatLng[] => r.map(([latitude, longitude]) => ({ latitude, longitude }));
