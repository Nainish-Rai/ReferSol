"use client";

import { create } from "zustand";
import { UIState } from "./types";

interface UIStore extends UIState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ loading: false, error: null }),
}));
