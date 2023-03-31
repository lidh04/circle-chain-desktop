/**
 * @fileOverview
 * @name wallet-package.ts
 * @author Charles
 * @license copyright to shc
 */

import { createHash, randomBytes } from "crypto";
import secp256k1 from "secp256k1";

import { decrypt, encrypt } from "../common/crypto/crypto";
import { readFile, writeFile, access, mkdir, chmod } from "fs/promises";
import os from 'os';
import path from "path";

import { EmailAccount, PhoneAccount } from '../common/account-types';
import {
  PrivatePoem,
  PublicWallet,
  WalletPackage
} from '../common/wallet-types';
import { binaryToBase58 } from '../common/base58/base58';
import { getWalletAssetsByAddress } from "./wallet-service";

interface PrivateEmailAccount extends EmailAccount {
  securityKey?: string;
  initVector?: string;
}

interface PrivatePhoneAccount extends PhoneAccount {
  securityKey?: string;
  initVector?: string;
}

export const PrivateWalletPackage = (function() {
  let keyMap: Record<string, PrivatePoem> = {} as Record<string, PrivatePoem>;
  let privateKeys: Array<Uint8Array> = [] as Array<Uint8Array>;
  let account: PrivateEmailAccount | PrivatePhoneAccount | null = null;
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
    const data1 = sha256.update(data).digest();
    const sha256Again = createHash('sha256');
    return sha256Again.update(data1).digest();
  }

  function checksum(pubKeyHash: Uint8Array): Uint8Array {
    const doubleHashData = doubleHash(pubKeyHash);
    return doubleHashData.subarray(0, ADDRESS_CHECKSUM_LEN);
  }

  async function exists(path: string) {
    try {
      await access(path)
      return true
    } catch {
      return false
    }
  }

  function getPrivateKeyPath(account: EmailAccount | PhoneAccount) {
    const hash256 = createHash('sha256');
    const value = account.value;
    const data = Buffer.from(`circle-chain-desktop/private/${value}`);
    const hash256Str = hash256.update(data).digest("hex");
    const path = os.homedir() + "/.circle-chain/" + hash256Str;
    console.log(`current path: ${path}`);
    return path;
  }

  function getAccountPath(account: EmailAccount | PhoneAccount): string {
    const hash256 = createHash('sha256');
    const data = Buffer.from(`circle-chain-desktop/account/${account.value}`);
    const hash256Str = hash256.update(data).digest("hex");
    const path = os.homedir() + "/.circle-chain/" + hash256Str;
    console.log(`account path: ${path}`);
    return path;
  }

  async function saveAccount() {
    if (!account) {
      return false;
    }
    if (!account.securityKey) {
      account.securityKey = randomBytes(32).toString("hex");
    }
    if (!account.initVector) {
      account.initVector = randomBytes(16).toString("hex");
    }

    const accountPath = getAccountPath(account);
    try {
      if (!await exists(accountPath)) {
        const baseDir = path.dirname(accountPath);
        await mkdir(baseDir, { recursive: true });
        console.log(`account path: ${accountPath} not exists, now create it!`);
      }
      const accountContent = JSON.stringify(account);
      await writeFile(accountPath, accountContent);
      await chmod(accountPath, 0o600);
      return true;
    } catch (err: any) {
      console.error(`cannot save account: ${JSON.stringify(account)}, error: ${err.message}`, err);
      return false;
    }
  }

  function clearPrivateData() {
    privateKeys = [];
    keyMap = {};
  }

  async function loadAccount(accountPath: string): Promise<PrivateEmailAccount | PrivatePhoneAccount | null> {
    if (!await exists(accountPath)) {
      console.warn(`not exist path: ${path}`);
      return null;
    }

    const content = await readFile(accountPath, { encoding: "utf8" });
    try {
      return JSON.parse(content);
    } catch (err: any) {
      console.error("cannot parse json:", content, ", error: ", err.message, err);
      // TODO try to parse the malformat json data
      return null;
    }
  }

  async function initLoad(accountInput: EmailAccount | PhoneAccount) {
    const accountPath = getAccountPath(accountInput);
    const existAccount = await loadAccount(accountPath) || accountInput;
    if (!account || account.value !== existAccount.value) {
      account = existAccount;
      if (!account.securityKey) {
        account.securityKey = randomBytes(32).toString("hex");
      }
      if (!account.initVector) {
        account.initVector = randomBytes(16).toString("hex");
      }
      await saveAccount();
    }

    if (!account.securityKey || !account.initVector) {
      throw new Error("securityKey:" + account.securityKey +
        "initVector:" + account.initVector + "should all be non empty!");
    }
    console.log("initLoad account:", account.value);
    clearPrivateData();
    const pathStr = getPrivateKeyPath(account!);
    try {
      if (!await exists(pathStr)) {
        console.log(`path: ${pathStr} not exists for account: ${JSON.stringify(accountInput)}`);
        return false;
      }

      const rawContent = await readFile(pathStr, { encoding: 'utf8' });
      const securityKey = Buffer.from(account.securityKey!, "hex");
      const initVector = Buffer.from(account.initVector!, "hex");
      const content = decrypt(securityKey, initVector, rawContent);
      const arr = JSON.parse(content) as Array<string>;
      const privKeys = arr.map(item => Buffer.from(item, "hex"));
      console.info("read from the private key file, there are ", privKeys.length, "items");
      for (const privKey of privKeys) {
        const uint8array = new Uint8Array(privKey.length);
        privKey.forEach((p, i) => { uint8array[i] = p; });
        addPrivateKey(uint8array);
      }
      return true;
    } catch (err: any) {
      console.error("cannot read content for path:", pathStr, "error:", err.message, err);
      return false;
    }
  }

  function getPublicKeyHash(pubKey: Uint8Array): Uint8Array {
    const sha256 = createHash('sha256');
    const hash256Binary = sha256.update(pubKey).digest();
    const ripemd160 = createHash('ripemd160');
    // get the public key in a compressed format
    const pubKeyHash = ripemd160.update(hash256Binary).digest();
    return pubKeyHash;
  }

  function getAddressAndPubKey(privateKey: Uint8Array): [string, Uint8Array] {
    // get the public key in a compressed format
    const pubKey = secp256k1.publicKeyCreate(privateKey);
    const pubKeyHash = getPublicKeyHash(pubKey);
    const leaderBuffer = Buffer.from([0]);
    const hashBuffer = Buffer.from(pubKeyHash);

    const payloadBuffer = Buffer.concat([leaderBuffer, hashBuffer]);
    const checkSumBuffer = Buffer.from(checksum(payloadBuffer));
    const addressBuffer = Buffer.concat([leaderBuffer, hashBuffer, checkSumBuffer]);
    const address = binaryToBase58(addressBuffer);
    return [address, pubKey];
  }

  function addPrivateKey(privateKey: Uint8Array): [string, Uint8Array] {
    if (privateKeys.length >= 3) {
      throw new Error("you cannot create wallet more than 3!");
    }

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

  async function save(account: PrivateEmailAccount | PrivatePhoneAccount) {
    if (!account.securityKey || !account.initVector) {
      throw new Error("cannot save private info securityKey and initVector are not inited!");
    }
    const pathStr = getPrivateKeyPath(account);
    if (!await exists(pathStr)) {
      const dirName = path.dirname(pathStr);
      await mkdir(dirName, { recursive: true });
    }
    const arr = privateKeys.map(privKey => Buffer.from(privKey).toString("hex"));
    if (arr.length > 0) {
      const content = JSON.stringify(arr);
      const securityKey = Buffer.from(account.securityKey, "hex");
      const initVector = Buffer.from(account.initVector, "hex");
      const encrypted = encrypt(securityKey, initVector, content);
      await writeFile(pathStr, encrypted);
      await chmod(pathStr, 0o600);
    }
  }

  async function getWalletPackage(): Promise<WalletPackage> {
    if (!account) {
      throw new Error("cannot get WalletPackage because account is not intialized!");
    }

    const promises = privateKeys.map(async (pk) => {
      const [address, pubKey] = getAddressAndPubKey(pk);
      const publicKey = Buffer.from(pubKey).toString("hex");
      const walletAssets = await getWalletAssetsByAddress(address);
      return {
        address,
        publicKey,
        balance: walletAssets.balance!,
        identities: walletAssets.identities!,
        ownerships: walletAssets.ownerships!
      };
    })
    const publicWallets: PublicWallet[] = await Promise.all(promises);
    return {
      account: {
        type: account.type,
        value: account.value
      },
      wallets: publicWallets
    };
  }

  function signData(data: Uint8Array, address: string) {
    const privateKey = privateKeys.find(priv => {
      const [addr, _] = getAddressAndPubKey(priv);
      return addr === address;
    });
    if (!privateKey) {
      throw new Error('not found private key for address:' + address);
    }

    const signedData = secp256k1.ecdsaSign(data, privateKey);
    return signedData.signature;
  }

  function getPublicKey(address: string) {
    let publicKey;
    for (const priv of privateKeys) {
      const [addr, pubKey] = getAddressAndPubKey(priv);
      if (addr === address) {
        publicKey = pubKey;
        break;
      }
    }
    if (!publicKey) {
      throw new Error('not found public key for address:' + address);
    }

    return publicKey;
  }

  return {
    initLoad,
    addPrivateKeyAndSave,
    getWalletPackage,
    getAccount: (): EmailAccount | PhoneAccount | null => {
      return account ? { type: account.type, value: account.value } : null;
    },
    getEncodedPrivateKey: (address: string): PrivatePoem | null => keyMap[address] ? keyMap[address] : null,
    getPublicKey,
    signData,
  };
}());
