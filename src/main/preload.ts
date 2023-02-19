import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

import {
  Channels,
  GetWalletPackage,
  SendToChannel,
} from '../common/wallet-types';


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    getWalletPackage(email?: string) {
      return ipcRenderer.invoke(GetWalletPackage, email);
    },
    sendTo(from: string, toEmail: string, assetType: number, value: number | string) {
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
