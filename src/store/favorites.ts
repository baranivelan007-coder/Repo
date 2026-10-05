import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Fav = { ids: string[]; toggle: (id: string) => void };

export const useFavorites = create<Fav>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    { name: 'navimeal.favs.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);
