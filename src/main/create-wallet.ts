/**
 * @fileOverview
 * @name create-wallet.ts
 * @author lidh04
 * @license copyright to shc
 */

import { randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';

import { PrivateWalletPackage } from './wallet-privacy';
import { Identity, Ownership, PublicWallet } from '../common/wallet-types';

const PRIVATE_KEY_LEN = 32;
export default async function createWallet(): Promise<PublicWallet> {
  const privateKeyArray = new Uint8Array(PRIVATE_KEY_LEN);
  let verifyOk = false;
  // generate privKey
  while (!verifyOk) {
    const privKey = randomBytes(PRIVATE_KEY_LEN);
    privKey.forEach((c, index) => {
      privateKeyArray[index] = c;
    });
    // console.log('private keys: ', privKey.toString('hex'), 'array:', privKey.length);
    try {
      verifyOk = secp256k1.privateKeyVerify(privateKeyArray);
      console.log('private key verify result:', verifyOk);
    } catch (err) {
      verifyOk = false;
      if (err instanceof Error) {
        console.error('secp256k1 privateKeyVerify error:', err.message, err);
      }
    }
  }
  const [address, pubKey] = await PrivateWalletPackage.addPrivateKeyAndSave(privateKeyArray);
  const publicKey = Buffer.from(pubKey).toString('hex');
  return {
    address,
    publicKey,
    balance: 0,
    unconfirmed: 0,
    identities: [] as Identity[],
    ownerships: [] as Ownership[],
  };
}
