import { EmailAccount, PhoneAccount } from './account-types';

export type Channels = 'ipc-circle-chain';
export const IpcChannel = 'ipc-circle-chain';
export type GetWalletPackageChannel = 'get-wallet-package';
export const GetWalletPackage = 'get-wallet-package';
export const GetEncodedPrivateKey = 'get-encoded-private-key';
export const SearchTransaction = 'search-transaction';
export const CreateWallet = 'create-wallet';

export const SendToChannel = 'send-to';

export type AddressType = 'from' | 'to';

export interface AutocompleteOption {
  value: string;
  label: string;
}

export type WalletLabelHandler = (address: string, index: number) => string;

export const makeWalletLabel: WalletLabelHandler = (address, index) => {
  const ending = address.substring(address.length - 5);
  return `wallet ${index+1}(...${ending})`;
}

export type AssetLabelHander = (asset: string, type: string) => string;
export const makeAssetLabel: AssetLabelHander = (asset, type) => {
  const heading = asset.substring(0, 8);
  return `${type}/${heading}...`;
}

export const checkValidAddress = (address: string): boolean => {
  return !!address && address.length === 34;
}

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
  account: EmailAccount | PhoneAccount;
  wallets: PublicWallet[];
}

export function addressListOf(walletPackage: WalletPackage) {
  return walletPackage.wallets.map((w) => w.address);
}

export function allBalanceOf(walletPackage: WalletPackage) {
  return walletPackage.wallets.map((w) => w.balance)
    .reduce((prev, total) => total + prev, 0);
}

export function identityCount(walletPackage: WalletPackage) {
  return walletPackage.wallets.map((w) => w.identities.length)
    .reduce((prev, total) => total + prev, 0);
}

export function ownershipCount(walletPackage: WalletPackage) {
  return walletPackage.wallets.map((w) => w.ownerships.length)
    .reduce((prev, total) => total + prev, 0);
}


export function validateEmail(inputText: string) {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (inputText.match(mailformat)) {
    return true;
  } else {
    return false;
  }
}

export function checkValidAsset(asset: string) {
  if (asset.length >= 26) {
    return true;
  }

  return false;
}
