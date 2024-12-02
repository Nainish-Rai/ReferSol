export interface Wallet {
  address: string | null;
  balance: number;
  isConnected: boolean;
}

export interface ReferralStats {
  totalReferrals: number;
  pendingRewards: number;
  claimedRewards: number;
  referralCode: string | null;
  dailyReferrals: number[];
  monthlyReferrals: number[];
  conversionRate: number;
  activeReferrals: number;
  referralHistory: ReferralRecord[];
}

export interface ReferralRecord {
  userAddress: string;
  timestamp: number;
  status: "pending" | "completed";
  reward: number;
}

export interface UIState {
  loading: boolean;
  error: string | null;
}
