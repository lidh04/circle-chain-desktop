import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import {
  Channels,
  GetWalletPackage,
  GetEncodedPrivateKey,
  SearchTransaction,
  SendToChannel,
  AddressType,
} from '../common/wallet-types';

import { TxType } from '../common/block-types';


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    getWalletPackage(email?: string) {
      return ipcRenderer.invoke(GetWalletPackage, email);
    },
    searchTransaction(address: string, addressType: AddressType, txType?: TxType, uuid?: string) {
      return ipcRenderer.invoke(SearchTransaction, address, addressType, txType, uuid);
    },
    getEncodedPrivateKey(address: string) {
      return ipcRenderer.invoke(GetEncodedPrivateKey, address);
    },
    sendTo(from: string, toEmail: string, assetType: TxType, value: number | string) {
      return ipcRenderer.invoke(SendToChannel, from, toEmail, assetType, value);
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
