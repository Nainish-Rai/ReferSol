"use client";

import { WalletContextProvider } from "@/config/walletConfig";
import { ReactNode } from "react";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}
