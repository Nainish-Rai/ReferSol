import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "../public/idl.json";
import { Idl } from "@project-serum/anchor";

export const PROGRAM_ID = new PublicKey(
  "Hko13xpywriTmjsjPzaurFUm5vExQdWRM916V36iDNeo"
);

export const getProgramInstance = (
  connection: Connection,
  wallet: AnchorWallet
) => {
  if (!wallet) return null;

  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  return new anchor.Program(idl as Idl, PROGRAM_ID, provider);
};
