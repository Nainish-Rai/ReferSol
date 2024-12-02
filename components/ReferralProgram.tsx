/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";

// Import your IDL
import idl from "../public/idl.json";

const PROGRAM_ID = "Hko13xpywriTmjsjPzaurFUm5vExQdWRM916V36iDNeo"; // Replace with your deployed program ID

export const ReferralProgram = () => {
  const { connected, publicKey } = useWallet();
  const [referralCode, setReferralCode] = useState("");
  const { setLoading, setError } = useUIStore();
  const [referrerProfile, setReferrerProfile] = useState<any>(null);

  const getProgram = () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const provider = new AnchorProvider(connection, window.solana, {
      commitment: "processed",
    });
    return new Program(idl as any, PROGRAM_ID, provider);
  };

  const initializeReferrer = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      const program = getProgram();

      const [referrerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("referrer"), publicKey.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );

      await program.methods
        .initializeReferrer(referralCode)
        .accounts({
          referrer: referrerPda,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      setError(null);
      await fetchReferrerProfile();
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to initialize referrer"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchReferrerProfile = async () => {
    if (!connected || !publicKey) return;

    try {
      const program = getProgram();
      const [referrerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("referrer"), publicKey.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );

      const account = await program.account.referrerProfile.fetch(referrerPda);
      setReferrerProfile(account);
    } catch (err) {
      console.log("No referrer profile found");
      setReferrerProfile(null);
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchReferrerProfile();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="p-4 text-center text-gray-300">
        Please connect your wallet to use the referral program
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 rounded-xl shadow-md border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">
        Solana Referral Program
      </h2>

      {referrerProfile ? (
        <div className="space-y-4">
          <h3 className="text-xl text-gray-200">Your Referral Profile</h3>
          <div className="bg-gray-900 p-4 rounded border border-gray-700">
            <p className="text-gray-300">
              Referral Code: {referrerProfile.referralCode}
            </p>
            <p className="text-gray-300">
              Total Referrals: {referrerProfile.totalReferrals.toString()}
            </p>
            <p className="text-gray-300">
              Total Rewards: {referrerProfile.totalRewards.toString()} SOL
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Create Your Referral Code
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="Enter referral code"
              className="block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={20}
            />
          </div>
          <button
            onClick={initializeReferrer}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors duration-200"
            disabled={!referralCode}
          >
            Initialize Referrer Profile
          </button>
        </div>
      )}
    </div>
  );
};
