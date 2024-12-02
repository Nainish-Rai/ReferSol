import { BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

export interface ReferrerProfile {
  owner: PublicKey;
  referralCode: string;
  totalReferrals: BN;
  totalRewards: BN;
  bump: number;
}

export interface Referral {
  referrer: PublicKey;
  referredUser: PublicKey;
  timestamp: BN;
  bump: number;
}

export interface ReferralAnalytics {
  dailyReferrals: number[];
  monthlyReferrals: number[];
  totalReferrals: number;
  totalRewards: number;
  recentReferrals: {
    referredUser: string;
    timestamp: number;
  }[];
}
