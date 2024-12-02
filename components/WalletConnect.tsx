"use client";

import { FC, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWalletStore } from "@/store/walletStore";
import { useUIStore } from "@/store/uiStore";

export const WalletConnect: FC = () => {
  const { connected, publicKey } = useWallet();
  const { setAddress, setIsConnected } = useWalletStore();
  const setError = useUIStore((state) => state.setError);

  useEffect(() => {
    try {
      if (connected && publicKey) {
        setAddress(publicKey.toBase58());
        setIsConnected(true);
        setError(null);
      } else {
        setAddress(null);
        setIsConnected(false);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    }
  }, [connected, publicKey, setAddress, setIsConnected, setError]);

  return (
    <div className="flex items-center justify-center p-4">
      <WalletMultiButton />
      {connected && (
        <span className="ml-4 text-green-500">Wallet Connected!</span>
      )}
    </div>
  );
};
