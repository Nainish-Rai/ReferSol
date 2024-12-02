"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Wallet } from "./types";

interface WalletStore extends Wallet {
  setAddress: (address: string | null) => void;
  setBalance: (balance: number) => void;
  setIsConnected: (isConnected: boolean) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      address: null,
      balance: 0,
      isConnected: false,

      setAddress: (address) => set({ address }),
      setBalance: (balance) => set({ balance }),
      setIsConnected: (isConnected) => set({ isConnected }),
      disconnect: () => set({ address: null, balance: 0, isConnected: false }),
    }),
    {
      name: "wallet-storage",
      skipHydration: true,
    }
  )
);
