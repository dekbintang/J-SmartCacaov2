import { create } from 'zustand';

interface GlobalState {
  isLoading: boolean;
  currentPage: string;
  setLoading: (value: boolean) => void;
  setPage: (page: string) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isLoading: false,
  currentPage: 'beranda',
  setLoading: (value) => set({ isLoading: value }),
  setPage: (page) => set({ currentPage: page }),
}));