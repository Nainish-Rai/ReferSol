/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Key, useEffect, useState } from "react";
import { useReferralProgram } from "@/hooks/useReferralProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { ReferralAnalytics as ReferralAnalyticsType } from "@/types";
// import { useReferralStore } from "@/store/referralStore";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export const ReferralAnalytics = () => {
  const { publicKey } = useWallet();
  const { getReferrerProfile } = useReferralProgram();
  const [analytics, setAnalytics] = useState<ReferralAnalyticsType | null>(
    null
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!publicKey) return;

      const profile = await getReferrerProfile(publicKey);
      if (!profile) return;

      // Process referrals into daily and monthly buckets
      // const now = Date.now();
      const dailyReferrals = Array(7).fill(0);
      const monthlyReferrals = Array(12).fill(0);

      // Convert the raw data to our analytics format
      setAnalytics({
        dailyReferrals,
        monthlyReferrals,
        totalReferrals: profile.totalReferrals.toNumber(),
        totalRewards: profile.totalRewards.toNumber() / LAMPORTS_PER_SOL,
        recentReferrals: [], // You'll need to fetch these separately
      });
    };

    fetchAnalytics();
  }, [publicKey, getReferrerProfile]);

  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  interface DailyData {
    name: string;
    referrals: number;
  }

  const dailyData: DailyData[] = analytics.dailyReferrals.map(
    (value: any, index: number) => ({
      name: `Day ${index + 1}`,
      referrals: value,
    })
  );

  const monthlyData = analytics.monthlyReferrals.map(
    (value: any, index: number) => ({
      name: new Date(2024, index).toLocaleString("default", { month: "short" }),
      referrals: value,
    })
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Daily Referrals</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="referrals" stroke="#8b5cf6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-neutral-800/50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="referrals" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        <div className="bg-neutral-800/50 p-4 rounded-lg">
          <h3 className="text-sm text-neutral-400">Total Referrals</h3>
          <p className="text-2xl font-bold">{analytics.totalReferrals}</p>
        </div>
        <div className="bg-neutral-800/50 p-4 rounded-lg">
          <h3 className="text-sm text-neutral-400">Total Rewards</h3>
          <p className="text-2xl font-bold">
            {analytics.totalRewards.toFixed(2)} SOL
          </p>
        </div>
      </div>

      <div className="bg-neutral-800/50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Recent Referrals</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left p-2">User</th>
                <th className="text-left p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentReferrals.map(
                (
                  record: {
                    referredUser: string | any[];
                    timestamp: string | number | Date;
                  },
                  index: Key | null | undefined
                ) => (
                  <tr key={index}>
                    <td className="p-2">
                      {record.referredUser.slice(0, 8)}...
                    </td>
                    <td className="p-2">
                      {new Date(record.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
