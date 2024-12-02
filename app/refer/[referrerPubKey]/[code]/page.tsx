// src/app/refer/[referrerPubkey]/[code]/page.tsx
"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ReferralHandler } from "@/components/referral/ReferralHandler";
import Link from "next/link";

interface PageProps {
  params: {
    referrerPubKey: string;
    code: string;
  };
}

export default function ReferralPage({ params }: PageProps) {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between p-24
                     bg-gradient-to-br from-purple-900/30 via-black to-purple-950/40
                     relative overflow-hidden animate-[gradientFlow_15s_ease_infinite]
                     bg-[size:200%_200%]"
    >
      {/* Gradient orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-white/90">
              Web3 Referral Platform
            </Link>
            <WalletMultiButton />
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900/70 backdrop-blur-lg rounded-xl shadow-2xl border border-neutral-800/50 p-6">
            <h1 className="text-2xl font-bold mb-6 text-white/90">
              Welcome to Web3 Referral Program
            </h1>
            <ReferralHandler
              referrerPubkey={params.referrerPubKey}
              referralCode={params.code}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
