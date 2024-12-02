"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReferralProgram } from "../../hooks/useReferralProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { useReferralStore } from "@/store/referralStore";

export const ReferrerRegistration = () => {
  const router = useRouter();
  const [inputCode, setInputCode] = useState("");
  const { setReferralCode } = useReferralStore();
  const { initializeReferrer, getReferrerProfile, loading, error } =
    useReferralProgram();
  const { connected, publicKey } = useWallet();

  useEffect(() => {
    const checkRegistration = async () => {
      if (connected && publicKey) {
        const profile = await getReferrerProfile(publicKey);
        if (profile) {
          router.push("/dashboard");
        }
      }
    };

    checkRegistration();
  }, [connected, publicKey, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected) return;

    try {
      const tx = await initializeReferrer(inputCode);
      if (tx) {
        setReferralCode(inputCode);
        alert("Successfully registered as referrer!");
        setInputCode("");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-neutral-900/70 backdrop-blur-lg rounded-xl shadow-2xl border border-neutral-800/50">
      <h2 className="text-2xl font-bold mb-6 text-white/90">
        Become a Referrer
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Choose your referral code
          </label>
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            maxLength={20}
            className="mt-1 block w-full rounded-lg bg-neutral-800/50 border border-neutral-700
                     text-white placeholder-neutral-500 px-4 py-3 backdrop-blur-sm
                     focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40
                     focus:outline-none transition-colors duration-200"
            placeholder="Enter referral code"
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm mb-6">{error}</p>}
        <button
          type="submit"
          disabled={!connected || loading}
          className="w-full bg-purple-600/80 hover:bg-purple-500/80 text-white py-3 px-4
                   rounded-lg backdrop-blur-sm transition-colors duration-200
                   disabled:bg-neutral-700/50 disabled:cursor-not-allowed
                   font-medium shadow-lg shadow-purple-900/20"
        >
          {loading ? "Processing..." : "Register as Referrer"}
        </button>
      </form>
    </div>
  );
};
