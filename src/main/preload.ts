import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Account, RegisterInput, VerifyCodeInput } from '../common/account-types';

import {
  Channels,
  CreateWallet,
  GetAccount,
  GetEncodedPrivateKey,
  GetPayPassword,
  GetWalletPackage,
  ImportWallet,
  LOGIN_PASSWORD,
  LOGIN_VERIFY_CODE,
  LOGOUT,
  REGISTER,
  RELOAD,
  SaveAccount,
  SearchTransaction,
  SEND_LOGIN_VERIFY_CODE,
  SEND_REGISTER_VERIFY_CODE,
  SendToChannel,
  SetPayPassword
} from '../common/wallet-constants';
import { TxType } from '../common/block-types';
import { AddressType } from '../common/wallet-types';

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
    searchTransaction(address: string, addressType: AddressType, txType?: TxType, uuid?: string) {
      return ipcRenderer.invoke(SearchTransaction, address, addressType, txType, uuid);
    },
    getEncodedPrivateKey(address: string) {
      return ipcRenderer.invoke(GetEncodedPrivateKey, address);
    },
    getAccount() {
      return ipcRenderer.invoke(GetAccount, null);
    },
    saveAccount(account: Account) {
      return ipcRenderer.invoke(SaveAccount, account);
    },
    getPayPassword() {
      return ipcRenderer.invoke(GetPayPassword, null);
    },
    setPayPassword(payPassword: string) {
      return ipcRenderer.invoke(SetPayPassword, payPassword);
    },
    loginWitPassword(input: Account) {
      return ipcRenderer.invoke(LOGIN_PASSWORD, input);
    },
    loginWithVerifyCode(input: Account) {
      return ipcRenderer.invoke(LOGIN_VERIFY_CODE, input);
    },
    register(input: RegisterInput) {
      return ipcRenderer.invoke(REGISTER, input);
    },
    sendLoginVerifyCode(input: VerifyCodeInput) {
      return ipcRenderer.invoke(SEND_LOGIN_VERIFY_CODE, input);
    },
    sendRegisterVerifyCode(input: VerifyCodeInput) {
      return ipcRenderer.invoke(SEND_REGISTER_VERIFY_CODE, input);
    },
    logout() {
      return ipcRenderer.invoke(LOGOUT);
    },
    reload() {
      return ipcRenderer.send(RELOAD, RELOAD);
    },
    sendTo(from: string, toEmail: string, assetType: TxType, value: number | string, payPassword: string) {
      return ipcRenderer.invoke(SendToChannel, from, toEmail, assetType, value, payPassword);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) => func(...args);
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
