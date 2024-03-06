/**
 * @fileOverview
 * @name wallet-privacy.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { EmailAccount } from '../common/account-types';
import { PrivateWalletPackage } from './wallet-privacy';

const account: EmailAccount = {
  value: 'smd.source@gmail.com',
  type: 'email',
};
describe('test suites for wallet privacy', () => {
  test('initLoad test', async () => {
    const result = await PrivateWalletPackage.initLoad(account);
    expect(result).toBe(true);
    const accountReturn = PrivateWalletPackage.getAccount();
    console.log('account:', accountReturn);
    expect(accountReturn).not.toBe(null);

    const newAccount: EmailAccount = {
      type: 'email',
      value: 'random223@gmail.com',
    };
    const newResult = await PrivateWalletPackage.initLoad(newAccount);
    expect(newResult).toBe(false);
    const newAccountReturn = PrivateWalletPackage.getAccount();
    console.log('new account:', newAccountReturn);
    expect(newAccountReturn).toStrictEqual(newAccount);
    const newWalletPackage = await PrivateWalletPackage.getWalletPackage();
    expect(newWalletPackage).not.toBe(null);
    expect(newWalletPackage.account).toStrictEqual(newAccount);
    expect(newWalletPackage.wallets.length).toBe(0);

    // rollback
    const result2 = await PrivateWalletPackage.initLoad(account);
    expect(result2).toBe(true);
  });

  test('getWalletPackage test', async () => {
    const walletPackage = await PrivateWalletPackage.getWalletPackage();
    console.log('walletPackage:', walletPackage);
    expect(walletPackage).not.toBe(null);
  });

  test('getEncodedPrivateKey', async () => {
    const walletPackage = await PrivateWalletPackage.getWalletPackage();
    console.log('walletPackage:', walletPackage);
    expect(walletPackage).not.toBe(null);
    walletPackage.wallets.forEach((w) => {
      const { address } = w;
      const privatePoem = PrivateWalletPackage.getEncodedPrivateKey(address);
      console.log(
        `get private poem by address: ${address}, result: ${JSON.stringify(
          privatePoem
        )}`
      );
      expect(privatePoem).not.toBe(null);
    });
  });

  test('makePoemAndDecodePoemTest', async () => {
    const result = await PrivateWalletPackage.initLoad(account);
    expect(result).toBe(true);
    const walletPackage = await PrivateWalletPackage.getWalletPackage();
    console.log('walletPackage:', walletPackage);
    expect(walletPackage).not.toBe(null);
    walletPackage.wallets.forEach((w) => {
      const { address } = w;
      const privatePoem = PrivateWalletPackage.getEncodedPrivateKey(address);
      console.log(
        `get private poem by address: ${address}, result: ${JSON.stringify(
          privatePoem
        )}`
      );
      expect(privatePoem).not.toBe(null);
      const privateKey = PrivateWalletPackage.decodePrivatePoem(privatePoem!);
      const privArray = new Uint8Array(32);
      privateKey.forEach((code, index) => {
        privArray[index] = code;
      });
      const [address2, pubKey2] = PrivateWalletPackage.getAddressAndPubKey(privArray);
      const pubKeyHex2 = Buffer.from(pubKey2).toString('hex');
      console.log(
        'origin address:',
        address,
        'address2:',
        address2,
        'origin pubkey:',
        w.publicKey,
        'pubKey2:',
        pubKeyHex2
      );
      expect(address2).toBe(w.address);
      expect(pubKeyHex2).toBe(w.publicKey);
    });
  });
});
