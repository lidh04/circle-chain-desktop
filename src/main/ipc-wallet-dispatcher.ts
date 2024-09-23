import { ipcMain } from 'electron';
import {
  CreateWallet,
  GetEncodedPrivateKey,
  GetWalletPackage,
  ImportWallet,
  SendToChannel
} from '../common/wallet-types';
import createWallet from './create-wallet';
import { EmailAccount } from '../common/account-types';
import { PrivateWalletPackage } from './wallet-privacy';
import { sendTo } from './blocks';

export default function setUpWalletDispatcher() {
  ipcMain.handle(CreateWallet, async (event) => {
    console.log('create wallet request...');
    const wallet = await createWallet();
    return wallet;
  });

  ipcMain.handle(GetWalletPackage, async (event, email: string) => {
    console.log('get wallet package by email:', email);
    try {
      if (email) {
        const account: EmailAccount = {
          type: 'email',
          value: email,
        };
        await PrivateWalletPackage.initLoad(account);
      }
      return await PrivateWalletPackage.getWalletPackage();
    } catch (err: any) {
      console.error(
        'cannot get wallet package by email:',
        email,
        'error:',
        err.message,
        err
      );
      throw err;
    }
  });

  ipcMain.handle(ImportWallet, async (event, keywords: string) => {
    console.log('import keywords:', keywords);
    try {
      const newPrivateKey = PrivateWalletPackage.decodePrivatePoem(keywords);
      return await PrivateWalletPackage.addPrivateKeyAndSave(newPrivateKey);
    } catch (err: any) {
      console.error(
        'cannot import wallet by keyworkds:',
        keywords,
        'error:',
        err.message,
        err
      );
      throw err;
    }
  });

  ipcMain.handle(GetEncodedPrivateKey, async (event, address: string) => {
    const privatePoem = PrivateWalletPackage.getEncodedPrivateKey(address);
    console.log(
      'get encoded private key by address:',
      address,
      'result:',
      privatePoem
    );
    return privatePoem;
  });

  ipcMain.handle(
    SendToChannel,
    async (
      event,
      from: string,
      toEmail: string,
      assetType: number,
      value: number | string,
      payPassword: string
    ) => {
      console.log(
        `${SendToChannel} from: ${from}, toEmail: ${toEmail}, assetType: ${assetType}, value: ${value}, pay password: ${payPassword}`
      );
      return sendTo(from, toEmail, assetType, value, payPassword);
    }
  );
}
