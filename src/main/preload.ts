import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  PhoneAccount,
  SaveAccount,
  EmailAccount,
  GetAccount,
} from '../common/account-types';

import {
  AddressType,
  Channels,
  CreateWallet,
  GetEncodedPrivateKey,
  GetPayPassword,
  GetWalletPackage,
  ImportWallet,
  SearchTransaction,
  SendToChannel,
  SetPayPassword,
} from '../common/wallet-types';
import { TxType } from '../common/block-types';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    createWallet() {
      return ipcRenderer.invoke(CreateWallet, null);
    },
    getWalletPackage(email?: string) {
      return ipcRenderer.invoke(GetWalletPackage, email);
    },
    importWallet(keywords: string) {
      return ipcRenderer.invoke(ImportWallet, keywords);
    },
    searchTransaction(
      address: string,
      addressType: AddressType,
      txType?: TxType,
      uuid?: string
    ) {
      return ipcRenderer.invoke(
        SearchTransaction,
        address,
        addressType,
        txType,
        uuid
      );
    },
    getEncodedPrivateKey(address: string) {
      return ipcRenderer.invoke(GetEncodedPrivateKey, address);
    },
    getAccount() {
      return ipcRenderer.invoke(GetAccount, null);
    },
    saveAccount(account: EmailAccount | PhoneAccount) {
      return ipcRenderer.invoke(SaveAccount, account);
    },
    getPayPassword() {
      return ipcRenderer.invoke(GetPayPassword, null);
    },
    setPayPassword(payPassword: string) {
      return ipcRenderer.invoke(SetPayPassword, payPassword);
    },
    sendTo(
      from: string,
      toEmail: string,
      assetType: TxType,
      value: number | string,
      payPassword: string
    ) {
      return ipcRenderer.invoke(
        SendToChannel,
        from,
        toEmail,
        assetType,
        value,
        payPassword
      );
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
