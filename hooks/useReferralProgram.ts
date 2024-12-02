"use client";
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import * as anchor from "@project-serum/anchor";
import { getProgramInstance, PROGRAM_ID } from "../utils/program";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ReferralRecord } from "@/store/types";

export const useReferralProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const program = wallet ? getProgramInstance(connection, wallet) : null;

  const initializeReferrer = useCallback(
    async (referralCode: string) => {
      if (!program || !wallet) {
        setError("Wallet not connected");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [referrerPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("referrer"), wallet.publicKey.toBuffer()],
          PROGRAM_ID
        );

        const tx = await program.methods
          .initializeReferrer(referralCode)
          .accounts({
            referrer: referrerPDA,
            user: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        return tx;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error initializing referrer:", err);
      } finally {
        setLoading(false);
      }
    },
    [program, wallet]
  );

  const createReferral = useCallback(
    async (referrerPubkey: PublicKey, referralCode: string) => {
      if (!program || !wallet) {
        setError("Wallet not connected");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [referrerPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("referrer"), referrerPubkey.toBuffer()],
          PROGRAM_ID
        );

        const [referralPDA] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("referral"),
            referrerPDA.toBuffer(),
            wallet.publicKey.toBuffer(),
          ],
          PROGRAM_ID
        );

        const tx = await program.methods
          .createReferral(referralCode)
          .accounts({
            referrer: referrerPDA,
            referral: referralPDA,
            user: wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
          })
          .rpc();

        return tx;
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        console.error("Error creating referral:", err);
      } finally {
        setLoading(false);
      }
    },
    [program, wallet]
  );

  const getReferrerProfile = useCallback(
    async (userPubkey: PublicKey) => {
      if (!program) return null;

      try {
        const [referrerPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("referrer"), userPubkey.toBuffer()],
          PROGRAM_ID
        );

        const referrerAccount = await program.account.referrerProfile.fetch(
          referrerPDA
        );
        return referrerAccount;
      } catch (err) {
        console.error("Error fetching referrer profile:", err);
        return null;
      }
    },
    [program]
  );

  const fetchAnalytics = useCallback(
    async (userPubkey: PublicKey) => {
      if (!program) return null;

      try {
        const [referrerPDA] = PublicKey.findProgramAddressSync(
          [Buffer.from("referrer"), userPubkey.toBuffer()],
          PROGRAM_ID
        );

        // Fetch referrer account data
        const referrerAccount = await program.account.referrerProfile.fetch(
          referrerPDA
        );

        // Fetch all referrals for this referrer
        const referrals = await program.account.referral.all([
          {
            memcmp: {
              offset: 8, // After discriminator
              bytes: referrerPDA.toBase58(),
            },
          },
        ]);

        // Process referrals to get daily and monthly stats
        const now = Date.now();
        const dailyReferrals = Array(7).fill(0);
        const monthlyReferrals = Array(12).fill(0);
        const referralHistory: ReferralRecord[] = [];

        referrals.forEach((ref) => {
          const timestamp = ref.account.createdAt.toNumber() * 1000;
          const daysDiff = Math.floor(
            (now - timestamp) / (1000 * 60 * 60 * 24)
          );
          const monthsDiff = Math.floor(daysDiff / 30);

          if (daysDiff < 7) {
            dailyReferrals[daysDiff]++;
          }
          if (monthsDiff < 12) {
            monthlyReferrals[monthsDiff]++;
          }

          referralHistory.push({
            userAddress: ref.account.referee.toBase58(),
            timestamp,
            status: ref.account.isCompleted ? "completed" : "pending",
            reward: ref.account.rewardAmount.toNumber() / LAMPORTS_PER_SOL,
          });
        });

        // Calculate conversion rate and active referrals
        const activeReferrals = referrals.filter(
          (ref) => !ref.account.isCompleted
        ).length;
        const conversionRate =
          (referrals.filter((ref) => ref.account.isCompleted).length /
            referrals.length) *
          100;

        return {
          dailyReferrals,
          monthlyReferrals,
          conversionRate,
          activeReferrals,
          referralHistory,
          totalReferrals: referrals.length,
          pendingRewards:
            referrerAccount.pendingRewards.toNumber() / LAMPORTS_PER_SOL,
          claimedRewards:
            referrerAccount.claimedRewards.toNumber() / LAMPORTS_PER_SOL,
        };
      } catch (err) {
        console.error("Error fetching analytics:", err);
        return null;
      }
    },
    [program]
  );

  return {
    initializeReferrer,
    createReferral,
    getReferrerProfile,
    fetchAnalytics,
    loading,
    error,
  };
};
