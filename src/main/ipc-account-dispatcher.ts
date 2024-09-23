import { ipcMain } from 'electron';
import { EmailAccount, GetAccount, PhoneAccount, SaveAccount } from '../common/account-types';
import { getAccountInfoPath } from '../common/acount';
import { chmod, mkdir, readFile, writeFile } from 'fs/promises';
import { PrivateWalletPackage } from './wallet-privacy';
import path from 'path';
import { GetPayPassword, SetPayPassword } from '../common/wallet-types';

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

  ipcMain.handle(
    SaveAccount,
    async (event, account: EmailAccount | PhoneAccount) => {
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
    }
  );

  ipcMain.handle(GetPayPassword, () => {
    return PrivateWalletPackage.getPayPassword();
  });

  ipcMain.handle(SetPayPassword, async (event, payPassword: string) => {
    await PrivateWalletPackage.setPayPassword(payPassword);
  });
}
