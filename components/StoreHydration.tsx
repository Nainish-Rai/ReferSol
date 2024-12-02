"use client";

import { useEffect } from "react";
import { useWalletStore } from "@/store/walletStore";
import { useReferralStore } from "@/store/referralStore";

export function StoreHydration() {
  useEffect(() => {
    useWalletStore.persist.rehydrate();
    useReferralStore.persist.rehydrate();
  }, []);

  return null;
}
