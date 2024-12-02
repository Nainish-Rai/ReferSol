"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReferralStats } from "./types";

interface ReferralStore extends ReferralStats {
  setReferralCode: (code: string | null) => void;
  updateStats: (stats: Partial<ReferralStats>) => void;
  resetStats: () => void;
}

const initialStats: ReferralStats = {
  totalReferrals: 0,
  pendingRewards: 0,
  claimedRewards: 0,
  referralCode: null,
};

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set) => ({
      ...initialStats,

      setReferralCode: (code) => set({ referralCode: code }),
      updateStats: (stats) => set((state) => ({ ...state, ...stats })),
      resetStats: () => set(initialStats),
    }),
    {
      name: "referral-storage",
      skipHydration: true,
    }
  )
);
