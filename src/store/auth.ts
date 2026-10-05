import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';

type AuthState = {
  user: User | null;
  onboarded: boolean;
  setUser: (u: User | null) => void;
  finishOnboarding: () => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      onboarded: false,
      setUser: (user) => set({ user }),
      finishOnboarding: () => set({ onboarded: true }),
      logout: () => set({ user: null }),
    }),
    { name: 'navimeal.auth.v1', storage: createJSONStorage(() => AsyncStorage) }
  )
);
