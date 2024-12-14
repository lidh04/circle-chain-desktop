import { ipcMain } from 'electron';
import Store from 'electron-store';
import {
  CreateWallet,
  GET_MINE_BLOCK_INFO_CHANNEL,
  GetEncodedPrivateKey,
  GetWalletPackage,
  ImportWallet,
  MINE_BLOCK_INFO_STORE_KEY,
  MINE_BLOCK_LOG_STORE_KEY,
  MINE_BLOCK_REPLY_CHANNEL,
  MINE_BLOCK_REQUEST_CHANNEL,
  READ_MINE_BLOCK_LOG_CHANNEL,
  SAVE_MINE_BLOCK_LOG_CHANNEL,
  SendToChannel,
  SET_MINE_BLOCK_INFO_CHANNEL,
  STOP_MINE_BLOCK_CHANNEL,
} from '../common/wallet-constants';
import createWallet from './create-wallet';
import { EmailAccount } from '../common/account-types';
import { PrivateWalletPackage } from './wallet-privacy';
import { sendTo } from './blocks';
import { mineBlock, stopMineBlock } from './wallet-service';

export default function setUpWalletDispatcher() {
  ipcMain.handle(CreateWallet, async () => {
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
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('cannot get wallet package by email:', email, 'error:', err.message, err);
      }

      throw err;
    }
  });

  ipcMain.handle(ImportWallet, async (event, keywords: string) => {
    console.log('import keywords:', keywords);
    try {
      const newPrivateKey = PrivateWalletPackage.decodePrivatePoem(keywords);
      return await PrivateWalletPackage.addPrivateKeyAndSave(newPrivateKey);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('cannot import wallet by keyworkds:', keywords, 'error:', err.message, err);
      }

      throw err;
    }
  });

  ipcMain.handle(GetEncodedPrivateKey, async (event, address: string) => {
    const privatePoem = PrivateWalletPackage.getEncodedPrivateKey(address);
    console.log('get encoded private key by address:', address, 'result:', privatePoem);
    return privatePoem;
  });

  ipcMain.handle(
    SendToChannel,
    async (event, from: string, toEmail: string, assetType: number, value: number | string, payPassword: string) => {
      console.log(
        `${SendToChannel} from: ${from}, toEmail: ${toEmail}, assetType: ${assetType}, value: ${value}, pay password: ${payPassword}`
      );
      return sendTo(from, toEmail, assetType, value, payPassword);
    }
  );

  ipcMain.handle(GET_MINE_BLOCK_INFO_CHANNEL, async () => {
    const store = new Store();
    const content = store.get(MINE_BLOCK_INFO_STORE_KEY, '');
    console.log('key:', MINE_BLOCK_INFO_STORE_KEY, 'content:', content);
    return content;
  });

  ipcMain.handle(SET_MINE_BLOCK_INFO_CHANNEL, async (event, mineBlockInfo: string) => {
    const store = new Store();
    store.set(MINE_BLOCK_INFO_STORE_KEY, mineBlockInfo);
    return true;
  });

  ipcMain.handle(SAVE_MINE_BLOCK_LOG_CHANNEL, async (event, logs: string[]) => {
    const store = new Store();
    store.set(MINE_BLOCK_LOG_STORE_KEY, logs);
    return true;
  });

  ipcMain.handle(READ_MINE_BLOCK_LOG_CHANNEL, async () => {
    const store = new Store();
    const value = store.get(MINE_BLOCK_LOG_STORE_KEY);
    if (!value) {
      return [] as string[];
    }

    return value as string[];
  });

  ipcMain.on(MINE_BLOCK_REQUEST_CHANNEL, (event, address: string, threadCount: number) => {
    const mineBlockInfo = JSON.stringify({
      isLoading: true,
      address,
      core: threadCount,
    });
    const store = new Store();
    store.set(MINE_BLOCK_INFO_STORE_KEY, mineBlockInfo);

    mineBlock(event, address, threadCount)
      // eslint-disable-next-line promise/always-return
      .then((result) => {
        event.reply(MINE_BLOCK_REPLY_CHANNEL, JSON.stringify(result));
      })
      .catch((error) => {
        console.error('mine block error:', error);
        if (error instanceof Error) {
          event.reply(
            MINE_BLOCK_REPLY_CHANNEL,
            JSON.stringify({
              code: 500,
              msg: error.message,
            })
          );
        }
      });
    return true;
  });

  ipcMain.handle(STOP_MINE_BLOCK_CHANNEL, async () => {
    return stopMineBlock();
  });
}
