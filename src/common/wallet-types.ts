import { Account } from './account-types';

export type AddressType = 'from' | 'to';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export type WalletLabelHandler = (address: string, index: number) => string;

export const makeWalletLabel: WalletLabelHandler = (address, index) => {
  const ending = address.substring(address.length - 5);
  return `wallet ${index + 1}(...${ending})`;
};

export type AssetLabelHandler = (asset: string, type: string) => string;
export const makeAssetLabel: AssetLabelHandler = (asset, type) => {
  const heading = asset.substring(0, 8);
  return `${type}/${heading}...`;
};

export const checkValidAddress = (address: string): boolean => {
  return !!address && address.length === 34;
};

export interface Asset {
  uuid: string;
  hash: string;
}

export interface Identity extends Asset {
  type: 'identity';
}

export interface Ownership extends Asset {
  type: 'ownership';
}

export interface PublicWallet {
  address: string;
  publicKey: string;
  balance: number;
  identities: Identity[];
  ownerships: Ownership[];
}

export interface PrivatePoem {
  title: string;
  sentences: string[];
}

export interface WalletPackage {
  account: Account;
  wallets: PublicWallet[];
}

export interface MyBlockData {
  ipPort: string;
  blockHeaderHexString: string;
}

export interface MyBlockRequest {
  address: string;
  ipPort: string;
  blockHeaderHexString: string;
}

export function addressListOf(walletPackage: WalletPackage) {
  return walletPackage.wallets.map((w) => w.address);
}

export function allBalanceOf(walletPackage: WalletPackage) {
  return walletPackage.wallets
    .map((w) => w.balance)
    .reduce((prev, total) => total + prev, 0);
}

export function identityCount(walletPackage: WalletPackage) {
  return walletPackage.wallets
    .map((w) => w.identities.length)
    .reduce((prev, total) => total + prev, 0);
}

export function ownershipCount(walletPackage: WalletPackage) {
  return walletPackage.wallets
    .map((w) => w.ownerships.length)
    .reduce((prev, total) => total + prev, 0);
}

export function validateEmail(inputText: string) {
  const mailFormat =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (inputText.match(mailFormat)) {
    return true;
  }
  return false;
}

export function checkPayPassword(payPassword: string) {
  return payPassword.length >= 6;
}

export function checkValidAsset(asset: string) {
  if (asset.length >= 26) {
    return true;
  }

  return false;
}
