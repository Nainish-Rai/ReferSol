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
}

export interface UIState {
  loading: boolean;
  error: string | null;
}
