
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

export interface PrivateWallet extends PublicWallet {
  privateKey: string;
}

export interface EmailAccount {
  type: 'email';
  value: string;
}

export interface PhoneAccount {
  type: 'phone';
  value: string;
}

export interface WalletPackage {
  account: EmailAccount | PhoneAccount;
  wallets: PublicWallet[];
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
