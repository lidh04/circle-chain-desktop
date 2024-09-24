/**
 * @fileOverview
 * @name wallet-package.ts
 * @author Charles
 * @license copyright to shc
 */

import { createHash, randomBytes } from 'crypto';
import secp256k1 from 'secp256k1';
import r from 'jsrsasign';

import { access, chmod, mkdir, readFile, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { toBigIntBE, toBufferBE } from 'bigint-buffer';

import { Account, EmailAccount, PhoneAccount } from '../common/account-types';
import { PrivatePoem, PublicWallet, WalletPackage } from '../common/wallet-types';
import { binaryToBase58 } from '../common/base58/base58';
import { decrypt, encrypt } from '../common/crypto/crypto';
import { decode, encode } from '../common/cnradix/cnradix';
import { AddressSignVO, getWalletAssetsByAddress, uploadUidAndAddress } from './wallet-service';

interface PrivateEmailAccount extends EmailAccount {
  securityKey?: string;
  initVector?: string;
}

interface PrivatePhoneAccount extends PhoneAccount {
  securityKey?: string;
  initVector?: string;
}

let keyMap: Record<string, PrivatePoem> = {} as Record<string, PrivatePoem>;
let privateKeys: Array<Uint8Array> = [] as Array<Uint8Array>;
let account: PrivateEmailAccount | PrivatePhoneAccount | null = null;
const ADDRESS_CHECKSUM_LEN = 4;

function decodePrivatePoem(poem: string | PrivatePoem): Uint8Array {
  const nonCharRegExp = /[「」，。\s\t\n]/g;
  let poemContent;
  if (typeof poem === 'string') {
    poemContent = poem.replaceAll(nonCharRegExp, '');
  } else {
    poemContent = poem.title + poem.sentences.join('');
    poemContent = poemContent.replaceAll(nonCharRegExp, '');
  }
  const value = decode(poemContent);
  console.log(
    'keywords raw:',
    poem,
    'trimed content:',
    poemContent,
    'value:',
    value
  );
  const buf = toBufferBE(value, 32);
  return buf;
}
function makePrivatePoem(privKey: Uint8Array) {
  console.time('privateKey');
  const buf = Buffer.from(privKey);
  const value = toBigIntBE(buf);
  const encodedString = encode(value);
  // console.log('private key length:', privKeyHex.length, privKeyHex,
  // 'bigint value:', value,
  // 'encoded private key length:',encodedString.length, encodedString);
  if (encodedString.length <= 15) {
    throw new Error('invalid private key');
  }

  let title = '';
  let start = 0;
  const sentences: string[] = [] as string[];
  if (encodedString.length > 20) {
    start = encodedString.length - 20;
    title = `「${encodedString.substring(0, start)}」`;
  }
  sentences.push(`${encodedString.substring(start, 5 + start)}，`);
  start += 5;
  sentences.push(`${encodedString.substring(start, 5 + start)}。`);
  start += 5;
  sentences.push(`${encodedString.substring(start, 5 + start)}，`);
  start += 5;
  sentences.push(`${encodedString.substring(start)}。`);

  console.timeEnd('privateKey');
  return {
    title,
    sentences,
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

// eslint-disable-next-line @typescript-eslint/no-shadow
async function exists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function getPrivateKeyPath(account: Account) {
  const hash256 = createHash('sha256');
  const { value } = account;
  const data = Buffer.from(`circle-chain-desktop/private/${value}`);
  const hash256Str = hash256.update(data).digest('hex');
  const privatePath = `${os.homedir()}/.circle-chain/${hash256Str}`;
  console.log(`current path: ${privatePath}`);
  return privatePath;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function getAccountPath(account: Account): string {
  const hash256 = createHash('sha256');
  const data = Buffer.from(`circle-chain-desktop/account/${account.value}`);
  const hash256Str = hash256.update(data).digest('hex');
  const accountPath = `${os.homedir()}/.circle-chain/${hash256Str}`;
  console.log(`account path: ${accountPath}`);
  return accountPath;
}

async function saveAccount() {
  if (!account) {
    return false;
  }
  if (!account.securityKey) {
    account.securityKey = randomBytes(32).toString('hex');
  }
  if (!account.initVector) {
    account.initVector = randomBytes(16).toString('hex');
  }

  const accountPath = getAccountPath(account);
  try {
    if (!(await exists(accountPath))) {
      const baseDir = path.dirname(accountPath);
      await mkdir(baseDir, { recursive: true });
      console.log(`account path: ${accountPath} not exists, now create it!`);
    }
    const accountContent = JSON.stringify(account);
    await writeFile(accountPath, accountContent);
    await chmod(accountPath, 0o600);
    return true;
  } catch (err: any) {
    console.error(
      `cannot save account: ${JSON.stringify(account)}, error: ${err.message}`,
      err
    );
    return false;
  }
}

async function setPayPassword(payPassword: string) {
  if (!account) {
    return false;
  }

  account.payPassword = payPassword;
  return saveAccount();
}

function clearPrivateData() {
  privateKeys = [];
  keyMap = {};
}

async function loadAccount(
  accountPath: string
): Promise<PrivateEmailAccount | PrivatePhoneAccount | null> {
  if (!(await exists(accountPath))) {
    console.warn(`not exist path: ${path}`);
    return null;
  }

  const content = await readFile(accountPath, { encoding: 'utf8' });
  try {
    return JSON.parse(content);
  } catch (err: any) {
    console.error('cannot parse json:', content, ', error: ', err.message, err);
    // TODO try to parse the malformat json data
    return null;
  }
}

async function initLoad(accountInput: Account) {
  const accountPath = getAccountPath(accountInput);
  const existAccount = (await loadAccount(accountPath)) || accountInput;
  if (!account || account.value !== existAccount.value) {
    account = existAccount;
    if (account && !account.securityKey) {
      account.securityKey = randomBytes(32).toString('hex');
    }
    if (account && !account.initVector) {
      account.initVector = randomBytes(16).toString('hex');
    }
    await saveAccount();
  }
  if (!account) {
    console.error('cannot find the account');
    return false;
  }

  if (account && (!account.securityKey || !account.initVector)) {
    throw new Error(
      `securityKey: ${account.securityKey}\ninitVector: ${account.initVector}should all be non empty!`
    );
  }
  console.log('initLoad account:', account?.value);
  clearPrivateData();
  const pathStr = getPrivateKeyPath(account!);
  try {
    if (!(await exists(pathStr))) {
      console.log(
        `path: ${pathStr} not exists for account: ${JSON.stringify(
          accountInput
        )}`
      );
      return false;
    }

    const rawContent = await readFile(pathStr, { encoding: 'utf8' });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const securityKey = Buffer.from(account.securityKey!, 'hex');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const initVector = Buffer.from(account.initVector!, 'hex');
    const content = decrypt(securityKey, initVector, rawContent);
    const arr = JSON.parse(content) as Array<string>;
    const privKeys = arr.map((item) => Buffer.from(item, 'hex'));
    console.info(
      'read from the private key file, there are ',
      privKeys.length,
      'items'
    );
    // eslint-disable-next-line no-restricted-syntax
    for (const privKey of privKeys) {
      const uint8array = new Uint8Array(privKey.length);
      privKey.forEach((p, i) => {
        uint8array[i] = p;
      });
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      addPrivateKey(uint8array);
    }
    return true;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        'cannot read content for path:',
        pathStr,
        'error:',
        err.message,
        err
      );
    } else {
      console.error('cannot read content for path:', pathStr, 'error:', err);
    }
    return false;
  }
}

function signDataWithPrivateKey(data: Uint8Array, privateKey: Uint8Array) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const sig = new r.Signature({ alg: 'SHA256withECDSA' });
  const prevHex = Buffer.from(privateKey).toString('hex');
  sig.init({ d: prevHex, curve: 'secp256k1' });
  const dataHex = Buffer.from(data).toString('hex');
  sig.updateHex(dataHex);
  return sig.sign() as string;
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
  const addressBuffer = Buffer.concat([
    leaderBuffer,
    hashBuffer,
    checkSumBuffer,
  ]);
  const address = binaryToBase58(addressBuffer);
  return [address, pubKey];
}

function addPrivateKey(privateKey: Uint8Array): [string, Uint8Array] {
  const [address, pubKey] = getAddressAndPubKey(privateKey);
  if (keyMap[address]) {
    console.log('already exist private key, address: ', address);
    return [address, pubKey];
  }

  if (privateKeys.length >= 3) {
    throw new Error('you cannot create wallet more than 3!');
  }

  privateKeys.push(privateKey);
  const privatePoem = makePrivatePoem(privateKey);
  const key = decodePrivatePoem(privatePoem);

  /// / debug codes here
  // const oldValue = toBigIntBE(Buffer.from(privateKey));
  // const newValue = toBigIntBE(Buffer.from(key));
  // console.log('old:', oldValue, 'new:', newValue, 'equal:', oldValue === newValue);
  // console.log('private keys:', toBigIntBE(Buffer.from(privateKey)), 'private Poem:', privatePoem);
  /// /// end debug code

  keyMap[address] = privatePoem;
  return [address, pubKey];
}

async function addPrivateKeyAndSave(
  privateKey: Uint8Array
): Promise<[string, Uint8Array]> {
  if (!account) {
    throw new Error('account is not intialized!');
  }
  const result = addPrivateKey(privateKey);
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  await save(account);

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const uid = getUid(account);
  const addressSigns = [] as AddressSignVO[];
  const [address, pubKey] = getAddressAndPubKey(privateKey);
  const publicKey = Buffer.from(pubKey).toString('hex');
  const data = Buffer.from(address);
  const signDataHex = signDataWithPrivateKey(data, privateKey);
  addressSigns.push({
    publicKey,
    address,
    signData: signDataHex,
  });
  await uploadUidAndAddress(uid, addressSigns);
  return result;
}

// upload account public info to cloud.
async function uploadAccountInfo() {
  if (!account || Object.keys(keyMap).length === 0) {
    console.warn('account is empty or has no address, skip to upload info');
    return false;
  }

  const addressSigns = [] as AddressSignVO[];
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const uid = getUid(account);
  // eslint-disable-next-line no-restricted-syntax
  for (const privateKey of privateKeys) {
    const [address, pubKey] = getAddressAndPubKey(privateKey);
    const publicKey = Buffer.from(pubKey).toString('hex');
    const data = Buffer.from(address);
    const signDataHex: string = signDataWithPrivateKey(data, privateKey);
    addressSigns.push({
      publicKey,
      address,
      signData: signDataHex,
    });
  }
  return uploadUidAndAddress(uid, addressSigns);
}

// eslint-disable-next-line @typescript-eslint/no-shadow
function getUid(account: Account) {
  const valueData = Buffer.from(account.value);
  const uidUint8Array = doubleHash(valueData);
  const uid = Buffer.from(uidUint8Array).toString('hex');
  return uid;
}

// eslint-disable-next-line @typescript-eslint/no-shadow
async function save(account: PrivateEmailAccount | PrivatePhoneAccount) {
  if (!account.securityKey || !account.initVector) {
    throw new Error(
      'cannot save private info securityKey and initVector are not inited!'
    );
  }
  const pathStr = getPrivateKeyPath(account);
  if (!(await exists(pathStr))) {
    const dirName = path.dirname(pathStr);
    await mkdir(dirName, { recursive: true });
  }
  const arr = privateKeys.map((privKey) =>
    Buffer.from(privKey).toString('hex')
  );
  if (arr.length > 0) {
    const content = JSON.stringify(arr);
    const securityKey = Buffer.from(account.securityKey, 'hex');
    const initVector = Buffer.from(account.initVector, 'hex');
    const encrypted = encrypt(securityKey, initVector, content);
    await writeFile(pathStr, encrypted);
    await chmod(pathStr, 0o600);
  }
}

async function getWalletPackage(): Promise<WalletPackage> {
  if (!account) {
    throw new Error(
      'cannot get WalletPackage because account is not intialized!'
    );
  }

  const promises = privateKeys.map(async (pk) => {
    const [address, pubKey] = getAddressAndPubKey(pk);
    const publicKey = Buffer.from(pubKey).toString('hex');
    const walletAssets = await getWalletAssetsByAddress(address);
    return {
      address,
      publicKey,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      balance: walletAssets.balance!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      identities: walletAssets.identities!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ownerships: walletAssets.ownerships!,
    };
  });
  const publicWallets: PublicWallet[] = await Promise.all(promises);
  return {
    account: {
      type: account.type,
      value: account.value,
    },
    wallets: publicWallets,
  };
}

function signData(data: Uint8Array, address: string) {
  const privateKey = privateKeys.find((priv) => {
    const [addr, _] = getAddressAndPubKey(priv);
    return addr === address;
  });
  if (!privateKey) {
    throw new Error(`not found private key for address:${address}`);
  }
  return signDataWithPrivateKey(data, privateKey);
}

function signString(str: string, address: string) {
  const privateKey = privateKeys.find((priv) => {
    const [addr, _] = getAddressAndPubKey(priv);
    return addr === address;
  });
  if (!privateKey) {
    throw new Error(`not found private key for address:${address}`);
  }
  const data = Buffer.from(str);
  return signDataWithPrivateKey(data, privateKey);
}

function getPublicKey(address: string) {
  let publicKey;
  // eslint-disable-next-line no-restricted-syntax
  for (const priv of privateKeys) {
    const [addr, pubKey] = getAddressAndPubKey(priv);
    if (addr === address) {
      publicKey = pubKey;
      break;
    }
  }
  if (!publicKey) {
    throw new Error(`not found public key for address:${address}`);
  }

  return publicKey;
}

// eslint-disable-next-line import/prefer-default-export
export const PrivateWalletPackage = {
  initLoad,
  addPrivateKeyAndSave,
  decodePrivatePoem,
  getAddressAndPubKey,
  getWalletPackage,
  getAccount: (): Account | null => {
    return account ? { type: account.type, value: account.value } : null;
  },
  uploadAccountInfo,
  setPayPassword,
  getPayPassword: (): string => {
    if (!account) {
      return '';
    }
    return account.payPassword ? account.payPassword : '';
  },
  getEncodedPrivateKey: (address: string): PrivatePoem | null =>
    keyMap[address] ? keyMap[address] : null,
  getPublicKey,
  signData,
  signString,
};
