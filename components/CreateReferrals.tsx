"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3, Idl } from "@project-serum/anchor";
import { useState } from "react";
import { useUIStore } from "@/store/uiStore";

// Import your IDL
import idl from "../public/idl.json";

const PROGRAM_ID = "Hko13xpywriTmjsjPzaurFUm5vExQdWRM916V36iDNeo";

export const CreateReferral = () => {
  const { connected, publicKey } = useWallet();
  const [referralCode, setReferralCode] = useState("");
  const { setLoading, setError } = useUIStore();

  const getProgram = () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const provider = new AnchorProvider(connection, window.solana, {
      commitment: "processed",
    });
    return new Program(idl as Idl, PROGRAM_ID, provider);
  };

  const createReferral = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);
      const program = getProgram();

      // First, find the referrer's PDA
      // We'll need to iterate through existing referrer accounts to find the matching code
      const referrers = await program.account.referrerProfile.all();
      interface ReferrerAccount {
        referralCode: string;
        owner: PublicKey;
        totalReferrals: number;
        totalRewards: number;
      }

      const referrer = referrers.find(
        (r) => (r.account as ReferrerAccount).referralCode === referralCode
      );

      if (!referrer) {
        setError("Invalid referral code");
        return;
      }

      const [referrerPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("referrer"),
          (referrer.account as ReferrerAccount).owner.toBuffer(),
        ],
        new PublicKey(PROGRAM_ID)
      );

      const [referralPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("referral"), referrerPda.toBuffer(), publicKey.toBuffer()],
        new PublicKey(PROGRAM_ID)
      );

      await program.methods
        .createReferral(referralCode)
        .accounts({
          referrer: referrerPda,
          referral: referralPda,
          user: publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

      setError(null);
      setReferralCode("");
      alert("Referral created successfully!");
    } catch (err) {
      console.error("Error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to create referral"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return null;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-4">
      <h2 className="text-2xl font-bold mb-4">Use a Referral Code</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Enter Referral Code
          </label>
          <input
            type="text"
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
            placeholder="Enter someone's referral code"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md"
            maxLength={20}
          />
        </div>
        <button
          onClick={createReferral}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          disabled={!referralCode}
        >
          Use Referral Code
        </button>
      </div>
    </div>
  );
};
