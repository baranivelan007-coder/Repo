import { create } from 'zustand';

type UI = { message: string | null; show: (m: string) => void; hide: () => void };
let timer: ReturnType<typeof setTimeout> | undefined;

export const useUI = create<UI>((set) => ({
  message: null,
  show: (message) => {
    if (timer) clearTimeout(timer);
    set({ message });
    timer = setTimeout(() => set({ message: null }), 2200);
  },
  hide: () => set({ message: null }),
}));

export const toast = (m: string) => useUI.getState().show(m);
