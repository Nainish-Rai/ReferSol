"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ReferralRecord, ReferralStats } from "./types";

interface ReferralStore extends ReferralStats {
  referrerPubkey: string | null;
  isProcessed: boolean;
  setReferralCode: (code: string | null) => void;
  setReferrerPubkey: (pubkey: string | null) => void;
  setIsProcessed: (processed: boolean) => void;
  updateStats: (stats: Partial<ReferralStats>) => void;
  resetStats: () => void;
  addReferralRecord: (record: ReferralRecord) => void;
  updateAnalytics: (data: Partial<ReferralStats>) => void;
}

const initialStats: ReferralStats & {
  referrerPubkey: string | null;
  isProcessed: boolean;
} = {
  totalReferrals: 0,
  pendingRewards: 0,
  claimedRewards: 0,
  referralCode: null,
  referrerPubkey: null,
  isProcessed: false,
  dailyReferrals: Array(7).fill(0),
  monthlyReferrals: Array(12).fill(0),
  conversionRate: 0,
  activeReferrals: 0,
  referralHistory: [],
};

export const useReferralStore = create<ReferralStore>()(
  persist(
    (set) => ({
      ...initialStats,

      setReferralCode: (code) => set({ referralCode: code }),
      setReferrerPubkey: (pubkey) => set({ referrerPubkey: pubkey }),
      setIsProcessed: (processed) => set({ isProcessed: processed }),
      updateStats: (stats) => set((state) => ({ ...state, ...stats })),
      resetStats: () => set(initialStats),
      addReferralRecord: (record) =>
        set((state) => ({
          referralHistory: [record, ...state.referralHistory],
        })),
      updateAnalytics: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),
    }),
    {
      name: "referral-storage",
      skipHydration: true,
    }
  )
);
