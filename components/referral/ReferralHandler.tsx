"use client";
import { useEffect } from "react";
import { useReferralProgram } from "@/hooks/useReferralProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useReferralStore } from "@/store/referralStore";

interface ReferralHandlerProps {
  referrerPubkey: string;
  referralCode: string;
}

export const ReferralHandler: React.FC<ReferralHandlerProps> = ({
  referrerPubkey,
  referralCode,
}) => {
  const { createReferral, loading, error } = useReferralProgram();
  const { connected } = useWallet();
  const { isProcessed, setIsProcessed, setReferrerPubkey, setReferralCode } =
    useReferralStore();

  useEffect(() => {
    setReferrerPubkey(referrerPubkey);
    setReferralCode(referralCode);
  }, [referrerPubkey, referralCode]);

  useEffect(() => {
    const processReferral = async () => {
      if (connected && !isProcessed) {
        try {
          const tx = await createReferral(
            new PublicKey(referrerPubkey),
            referralCode
          );
          if (tx) {
            setIsProcessed(true);
            alert("Referral processed successfully!");
          }
        } catch (err) {
          console.error("Error processing referral:", err);
        }
      }
    };

    processReferral();
  }, [connected, isProcessed]);

  if (!connected) {
    return (
      <div className="text-center p-6">
        <p>Please connect your wallet to process the referral</p>
      </div>
    );
  }

  if (isProcessed) {
    return (
      <div className="text-center p-6">
        <p className="text-green-500">Referral successfully processed!</p>
      </div>
    );
  }

  return (
    <div className="text-center p-6">
      {loading ? (
        <p>Processing referral...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>Initializing referral process...</p>
      )}
    </div>
  );
};
