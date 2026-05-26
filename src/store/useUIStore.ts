'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';
type Lang = 'id' | 'en';

interface UIState {
  theme: Theme;
  lang: Lang;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      lang: 'id',
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
      toggleLang: () => set((s) => ({ lang: s.lang === 'id' ? 'en' : 'id' })),
      setLang: (lang) => set({ lang }),
    }),
    { name: 'jsmartcacao-ui' }
  )
);