import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { FALLBACK_LOCATION, FALLBACK_PLACE } from '../theme';
import { LatLng } from '../types';

type LocState = {
  asked: boolean; // location permission screen already shown
  coords: LatLng | null; // real device location (null => fallback)
  placeName: string;
  requestPermission: () => Promise<boolean>;
  refresh: () => Promise<void>;
  markAsked: () => void;
};

export const useLocationStore = create<LocState>()(
  persist(
    (set, get) => ({
      asked: false,
      coords: null,
      placeName: FALLBACK_PLACE,
      markAsked: () => set({ asked: true }),
      requestPermission: async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          set({ asked: true });
          if (status === 'granted') {
            await get().refresh();
            return true;
          }
        } catch {}
        set({ asked: true, coords: null, placeName: FALLBACK_PLACE });
        return false;
      },
      refresh: async () => {
        try {
          const perm = await Location.getForegroundPermissionsAsync();
          if (perm.status !== 'granted') {
            set({ coords: null, placeName: FALLBACK_PLACE });
            return;
          }
          const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          let placeName = 'Current location';
          try {
            const [a] = await Location.reverseGeocodeAsync(coords);
            const area = a?.district || a?.subregion || a?.street || a?.name;
            const city = a?.city || a?.region;
            const joined = [area, city].filter(Boolean).join(', ');
            if (joined) placeName = joined;
          } catch {}
          set({ coords, placeName });
        } catch {
          set({ coords: null, placeName: FALLBACK_PLACE });
        }
      },
    }),
    {
      name: 'navimeal.location.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ asked: s.asked }),
    }
  )
);

/** Anchor used for every map: real location when available, otherwise the Anna Nagar fallback. */
export const useAnchor = (): LatLng => {
  const coords = useLocationStore((s) => s.coords);
  return coords ?? FALLBACK_LOCATION;
};
