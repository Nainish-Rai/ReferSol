"use client";

import { ReferrerRegistration } from "@/components/referral/ReferrerRegistration";
import { WalletConnect } from "@/components/WalletConnect";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Home() {
  const { connected } = useWallet();
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24
                     bg-gradient-to-br from-purple-900/30 via-black to-purple-950/40
                     relative overflow-hidden animate-[gradientFlow_15s_ease_infinite]
                     bg-[size:200%_200%]"
    >
      {/* Gradient orbs for background effect */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1
          className="text-4xl font-bold text-center mb-8 text-white/90
                      bg-clip-text text-transparent bg-gradient-to-r
                      from-purple-400 to-purple-200"
        >
          Web3 Referral Platform
        </h1>
        <div className="space-y-8">
          <div className="max-w-4xl mx-auto backdrop-blur-lg">
            {!connected ? (
              <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-purple-500/20 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-white/80">
                  Connect your wallet to get started
                </h2>
                <WalletConnect />
              </div>
            ) : (
              <ReferrerRegistration />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
