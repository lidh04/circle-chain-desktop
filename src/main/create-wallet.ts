/**
 * @fileOverview
 * @name create-wallet.ts
 * @author lidh04
 * @license copyright to shc
 */

import { randomBytes } from "crypto";
import secp256k1 from "secp256k1";

import { PrivateWalletPackage } from "./wallet-privacy";
import { PublicWallet } from '../common/wallet-types';

const PRIV_KEY_LEN = 32;
export default async function createWallet(): Promise<PublicWallet> {
  // generate privKey
  let privKey: Uint8Array;
  do {
    privKey = randomBytes(PRIV_KEY_LEN);
  } while (!secp256k1.privateKeyVerify(privKey));
  const [address, pubKey] = await PrivateWalletPackage.addPrivateKeyAndSave(privKey);
  const publicKey = Buffer.from(pubKey).toString("hex");
  return {
    address,
    publicKey,
    balance: 0,
    identities: [],
    ownerships: []
  };
}
