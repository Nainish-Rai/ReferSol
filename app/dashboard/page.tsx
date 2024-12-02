// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useReferralProgram } from "@/hooks/useReferralProgram";
import { useReferralStore } from "@/store/referralStore";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { ReferralAnalytics } from "@/components/analytics/ReferralAnalytics";

export default function DashboardPage() {
  const { publicKey, connected } = useWallet();
  const { getReferrerProfile } = useReferralProgram();
  const { referralCode, totalReferrals, updateStats } = useReferralStore();

  useEffect(() => {
    const fetchProfile = async () => {
      if (publicKey) {
        const referrerProfile = await getReferrerProfile(publicKey);
        if (referrerProfile) {
          updateStats({
            referralCode: referrerProfile.referralCode,
            totalReferrals: referrerProfile.totalReferrals,
          });
        }
      }
    };

    if (connected) {
      fetchProfile();
    }
  }, [connected, publicKey]);

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

        <main className="py-8">
          <div className="max-w-4xl mx-auto">
            {!connected ? (
              <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-purple-500/20 shadow-2xl">
                <h2 className="text-2xl font-bold mb-4 text-white/80">
                  Please connect your wallet
                </h2>
              </div>
            ) : referralCode && totalReferrals !== undefined ? (
              <div className="space-y-6">
                <div className="bg-neutral-900/70 backdrop-blur-lg rounded-xl shadow-2xl border border-neutral-800/50 p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white/90">
                    Your Referral Dashboard
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50">
                      <h3 className="text-lg font-medium text-neutral-300">
                        Your Referral Code
                      </h3>
                      <p className="text-2xl font-bold mt-2 text-white">
                        {referralCode}
                      </p>
                    </div>
                    <div className="bg-neutral-800/50 p-4 rounded-lg border border-neutral-700/50">
                      <h3 className="text-lg font-medium text-neutral-300">
                        Total Referrals
                      </h3>
                      <p className="text-2xl font-bold mt-2 text-white">
                        {totalReferrals.toString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2 text-neutral-300">
                      Your Referral Link
                    </h3>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={`${window.location.origin}/refer/${publicKey}/${referralCode}`}
                        className="flex-1 p-2 bg-neutral-800/50 border border-neutral-700 rounded text-white"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/refer/${publicKey}/${referralCode}`
                          );
                        }}
                        className="px-4 py-2 bg-purple-600/80 hover:bg-purple-500/80 text-white rounded-lg
                               backdrop-blur-sm transition-colors duration-200"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900/70 backdrop-blur-lg rounded-xl shadow-2xl border border-neutral-800/50 p-6">
                  <h2 className="text-2xl font-bold mb-6 text-white/90">
                    Analytics Dashboard
                  </h2>
                  <ReferralAnalytics />
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-900/50 rounded-xl border border-purple-500/20 shadow-2xl">
                <p className="text-white/80">
                  You haven&apos;t registered as a referrer yet.
                </p>
                <Link
                  href="/"
                  className="inline-block mt-4 px-4 py-2 bg-purple-600/80 hover:bg-purple-500/80
                           text-white rounded-lg backdrop-blur-sm transition-colors duration-200"
                >
                  Register as Referrer
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </main>
  );
}
