import { ipcMain } from 'electron';
import { chmod, mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import wallet from '@lidh04/circle-chain-sdk';
// @ts-ignore
import { Account, RegisterInput, VerifyCodeInput } from '../common/account-types';
import { getAccountInfoPath } from '../common/acount';
import { PrivateWalletPackage } from './wallet-privacy';
import {
  GetAccount,
  GetPayPassword,
  LOGIN_PASSWORD,
  LOGIN_VERIFY_CODE,
  REGISTER,
  SaveAccount,
  SEND_LOGIN_VERIFY_CODE,
  SEND_REGISTER_VERIFY_CODE,
  SetPayPassword
} from '../common/wallet-constants';
import WalletError from '../common/wallet-error';

let uploaded = false;
export default function setUpAccountDispatcher() {
  ipcMain.handle(GetAccount, async (event) => {
    const accountInfoPath = getAccountInfoPath();
    try {
      const content = await readFile(accountInfoPath, { encoding: 'utf8' });
      const account = JSON.parse(content);
      console.log(
        'get account:',
        account,
        'in account info path:',
        accountInfoPath
      );
      if (!uploaded) {
        // async upload account info
        PrivateWalletPackage.uploadAccountInfo()
          .then((r) => {
            console.log('upload account info result:', r);
            uploaded = r;
            return uploaded;
          })
          .catch((err) => console.error('upload account info error:', err));
      } else {
        console.log('account info already uploaded');
      }
      return account;
    } catch (err: any) {
      console.warn('get file error:', err.message, err);
      return null;
    }
  });

  ipcMain.handle(SaveAccount, async (event, account: Account) => {
    const content = JSON.stringify(account);
    const accountInfoPath = getAccountInfoPath();
    try {
      const dirname = path.dirname(accountInfoPath);
      await mkdir(dirname, { recursive: true });
      await writeFile(accountInfoPath, content);
      await chmod(accountInfoPath, 0o600);
      return true;
    } catch (err: any) {
      console.error(
        'cannot write file in path: ',
        accountInfoPath,
        'error:',
        err.message,
        err
      );
      return false;
    }
  });

  ipcMain.handle(GetPayPassword, () => {
    return PrivateWalletPackage.getPayPassword();
  });

  ipcMain.handle(SetPayPassword, async (event, payPassword: string) => {
    await PrivateWalletPackage.setPayPassword(payPassword);
  });

  ipcMain.handle(LOGIN_PASSWORD, async (event, account: Account) => {
    const { type, value, password } = account;
    let response;
    if (!password) {
      console.error('password is empty');
      return false;
    }

    if (type === 'email') {
      response = await wallet.user.login({
        email: value,
        password,
      });
    } else {
      response = await wallet.user.login({
        phone: value,
        password,
      });
    }

    const { status, message } = response || {};
    if (status === 200) {
      console.log('login success for user:', value);
      return true;
    }

    console.error('login failure for user:', value);
    throw new WalletError(status, message);
  });

  ipcMain.handle(LOGIN_VERIFY_CODE, async (event, account: Account) => {
    const { type, value, verifyCode } = account;
    let response;
    if (!verifyCode) {
      console.error('verifyCode is empty for login verify code api');
      return false;
    }

    if (type === 'email') {
      // response = await wallet.user.login({
      //   email: value,
      //   verifyCode,
      // });
    } else {
      // response = await wallet.user.login({
      //   phone: value,
      //   verifyCode,
      // });
    }

    const { status, message } = response || {};
    if (status === 200) {
      console.log('login success for user:', value);
      return true;
    }

    console.error('login failure for user:', value);
    throw new WalletError(status, message);
  });

  ipcMain.handle(
    SEND_LOGIN_VERIFY_CODE,
    async (event, input: VerifyCodeInput) => {
      const { type, value } = input;
      let response;
      if (type === 'email') {
        // response = await wallet.user.sendVerifyCode({
        //   email: value,
        // });
      } else {
        // response = await wallet.user.sendVerifyCode({
        //   phone: value,
        // });
      }
      const { status, message } = response || {};
      if (status === 200) {
        console.log('send login verify code success for user:', value);
        return true;
      }

      console.error('send login verify code failure for user:', value);
      throw new WalletError(status, message);
    }
  );

  ipcMain.handle(
    SEND_REGISTER_VERIFY_CODE,
    async (event, input: VerifyCodeInput) => {
      const { type, value } = input;
      let response;
      if (type === 'email') {
        // response = await wallet.user.sendVerifyCode({
        //   email: value,
        // });
      } else {
        // response = await wallet.user.sendVerifyCode({
        //   phone: value,
        // });
      }
      const { status, message } = response || {};
      if (status === 200) {
        console.log('send register verify code success for user:', value);
        return true;
      }

      console.error('send register verify code failure for user:', value);
      throw new WalletError(status, message);
    }
  );

  ipcMain.handle(REGISTER, async (event, input: RegisterInput) => {
    const { type, value, passwordInput1, passwordInput2, verifyCode } = input;
    let response;
    if (type === 'email') {
      // response = await wallet.user.register({
      //   email: value,
      //   passwordInput1,
      //   passwordInput2,
      //   verifyCode,
      // });
    } else {
      // response = await wallet.user.register({
      //   phone: value,
      //   passwordInput1,
      //   passwordInput2,
      //   verifyCode,
      // });
    }
    const { status, message } = response || {};
    if (status === 200) {
      console.log('send register success for user:', value);
      return true;
    }

    console.error('send register failure for user:', value);
    throw new WalletError(status, message);
  });
}
