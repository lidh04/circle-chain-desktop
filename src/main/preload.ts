import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Account, RegisterInput, ResetPasswordInput, VerifyCodeInput } from '../common/account-types';

import {
  Channels,
  CreateWallet,
  GET_CPU_COUNT,
  GET_MINE_BLOCK_INFO_CHANNEL,
  GetAccount,
  GetEncodedPrivateKey,
  GetPayPassword,
  GetWalletPackage,
  ImportWallet,
  LOGIN_PASSWORD,
  LOGIN_VERIFY_CODE,
  LOGOUT,
  MINE_BLOCK_REQUEST_CHANNEL,
  READ_MINE_BLOCK_LOG_CHANNEL,
  REGISTER,
  RELOAD,
  RESET_PASSWORD,
  SAVE_MINE_BLOCK_LOG_CHANNEL,
  SaveAccount,
  SearchTransaction,
  SEND_LOGIN_VERIFY_CODE,
  SEND_REGISTER_VERIFY_CODE,
  SEND_RESET_PASSWORD_VERIFY_CODE,
  SendToChannel,
  SET_MINE_BLOCK_INFO_CHANNEL,
  SetPayPassword,
  STOP_MINE_BLOCK_CHANNEL
} from '../common/wallet-constants';
import { TxType } from '../common/block-types';
import { AddressType } from '../common/wallet-types';

const electronHandler = {
  ipcRenderer: {
    getCpuCount() {
      return ipcRenderer.invoke(GET_CPU_COUNT);
    },
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
    sendResetPasswordVerifyCode(input: VerifyCodeInput) {
      return ipcRenderer.invoke(SEND_RESET_PASSWORD_VERIFY_CODE, input);
    },
    resetPassword(input: ResetPasswordInput) {
      return ipcRenderer.invoke(RESET_PASSWORD, input);
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
    setMineBlockInfo(mineBlockInfo: string) {
      return ipcRenderer.invoke(SET_MINE_BLOCK_INFO_CHANNEL, mineBlockInfo);
    },
    getMineBlockInfo() {
      return ipcRenderer.invoke(GET_MINE_BLOCK_INFO_CHANNEL);
    },
    mineBlock(address: string, threadCount: number) {
      return ipcRenderer.send(MINE_BLOCK_REQUEST_CHANNEL, address, threadCount);
    },
    stopMineBlock() {
      return ipcRenderer.invoke(STOP_MINE_BLOCK_CHANNEL);
    },
    saveMineBlockLog(logs: string[]) {
      return ipcRenderer.invoke(SAVE_MINE_BLOCK_LOG_CHANNEL, logs);
    },
    readMineBlockLog() {
      return ipcRenderer.invoke(READ_MINE_BLOCK_LOG_CHANNEL);
    },
    on(channel: string, func: (...args: string[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: string[]) => func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: string, func: (...args: string[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
