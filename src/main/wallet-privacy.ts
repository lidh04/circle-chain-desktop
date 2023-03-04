/**
 * @fileOverview
 * @name wallet-package.ts
 * @author Charles
 * @license copyright to shc
 */

import { binary_to_base58 } from "base58-js";
import { createHash } from "crypto";
import secp256k1 from "secp256k1";

import { readFile, writeFile } from "fs/promises";
import os from 'os';

import {
  EmailAccount,
  Identity,
  Ownership,
  PhoneAccount,
  PrivatePoem,
  PublicWallet,
  WalletPackage
} from '../common/wallet-types';

export const PrivateWalletPackage = (function() {
  let keyMap: Record<string, PrivatePoem> = {} as Record<string, PrivatePoem>;
  let privateKeys: Array<Uint8Array> = [] as Array<Uint8Array>;
  let account: EmailAccount | PhoneAccount | null = null;
  const ADDRESS_CHECKSUM_LEN = 4;

  function makePrivatePoem(privKey: Uint8Array) {
    const title = "";
    const sentences = [""];
    return {
      title,
      sentences
    };
  }

  function doubleHash(data: Uint8Array): Uint8Array {
    const sha256 = createHash('sha256');
    return sha256.update(sha256.update(data).digest()).digest();
  }

  function checksum(pubKeyHash: Uint8Array): Uint8Array {
    const doubleHashData = doubleHash(pubKeyHash);
    return doubleHashData.subarray(0, ADDRESS_CHECKSUM_LEN);
  }

  function getPrivateKeyPath(account: EmailAccount | PhoneAccount) {
    const hash256 = createHash('sha256');
    const value = account.value;
    const data = Buffer.from(`circle-chain-desktop/${value}`);
    const hash256Str = hash256.update(data).digest("hex");
    const path = os.homedir() + "./circle-chain/" + hash256Str;
    return path;
  }

  async function initLoad(accountInput: EmailAccount | PhoneAccount) {
    account = accountInput;
    const path = getPrivateKeyPath(account);
    try {
      const content = await readFile(path, { encoding: 'utf8' });
      const arr = JSON.parse(content) as Array<string>;
      const privKeys = arr.map(item => Buffer.from(item, "hex"));
      privateKeys = []; // clear old private keys
      for (const privKey of privKeys) {
        addPrivateKey(privKey);
      }
      return true;
    } catch (err: any) {
      console.error("cannot read content for path:", path, "error:", err.message, err);
      return false;
    }
  }

  function getPublicKeyHash(pubKey: Uint8Array): Uint8Array {
    let hash = createHash('ripemd160');
    hash = hash.update(pubKey);
    // get the public key in a compressed format
    const pubKeyHash = hash.digest();
    return pubKeyHash;
  }

  function getAddressAndPubKey(privateKey: Uint8Array): [string, Uint8Array] {
    // get the public key in a compressed format
    const pubKey = secp256k1.publicKeyCreate(privateKey);
    const pubKeyHash = getPublicKeyHash(pubKey);
    const leaderBuffer = Buffer.from([0]);
    const hashBuffer = Buffer.from(pubKeyHash);
    const checkSumBuffer = Buffer.from(checksum(pubKeyHash));
    const addressBuffer = Buffer.concat([leaderBuffer, hashBuffer, checkSumBuffer]);
    const address = binary_to_base58(addressBuffer);
    return [address, pubKey];
  }

  function addPrivateKey(privateKey: Uint8Array): [string, Uint8Array] {
    privateKeys.push(privateKey);
    const privatePoem = makePrivatePoem(privateKey);
    const [address, pubKey] = getAddressAndPubKey(privateKey);
    keyMap[address] = privatePoem;
    return [address, pubKey];
  }

  async function addPrivateKeyAndSave(privateKey: Uint8Array): Promise<[string, Uint8Array]> {
    if (!account) {
      throw new Error("account is not intialized!");
    }
    const result = addPrivateKey(privateKey);
    await save(account);
    return result;
  }

  async function save(account: EmailAccount | PhoneAccount) {
    const path = getPrivateKeyPath(account);
    const arr = privateKeys.map(privKey => Buffer.from(privKey).toString("hex"));
    if (arr.length > 0) {
      const content = JSON.stringify(arr);
      await writeFile(path, content);
    }
  }

  async function getWalletPackage(): Promise<WalletPackage> {
    if (!account) {
      throw new Error("cannot get WalletPackage because account is not intialized!");
    }

    const promises = privateKeys.map(async (pk) => {
      const [address, pubKey] = getAddressAndPubKey(pk);
      const publicKey = Buffer.from(pubKey).toString("hex");
      const balance = 0;
      const identities = [] as Identity[];
      const ownerships = [] as Ownership[];
      return {
        address,
        publicKey,
        balance,
        identities,
        ownerships
      };
    })
    const publicWallets: PublicWallet[] = await Promise.all(promises);
    return {
      account,
      wallets: publicWallets
    };
  }

  return {
    initLoad,
    addPrivateKeyAndSave,
    getWalletPackage,
    getEncodedPrivateKey: (address: string): PrivatePoem | null => keyMap[address] ? keyMap[address] : null,
  };
}());
