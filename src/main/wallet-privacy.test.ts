/**
 * @fileOverview
 * @name wallet-privacy.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { EmailAccount } from '../common/account-types';
import { PrivateWalletPackage } from './wallet-privacy';

const account: EmailAccount = {
  value: "lidh04@qq.com",
  type: "email"
};
test("initLoad test", async () => {
  const result = await PrivateWalletPackage.initLoad(account);
  expect(result).not.toBe(null);
  const accountReturn = PrivateWalletPackage.getAccount();
  console.log("account:", accountReturn);
  expect(accountReturn).not.toBe(null);

  const newAccount: EmailAccount = {
    type: "email",
    value: "random223@gmail.com"
  };
  const newResult = await PrivateWalletPackage.initLoad(newAccount);
  expect(newResult).not.toBe(null);
  const newAccountReturn = PrivateWalletPackage.getAccount();
  console.log("new account:", newAccountReturn);
  expect(newAccountReturn).toStrictEqual(newAccount);
  const newWalletPackage = await PrivateWalletPackage.getWalletPackage();
  expect(newWalletPackage).not.toBe(null);
  expect(newWalletPackage.account).toStrictEqual(newAccount);
  expect(newWalletPackage.wallets.length).toBe(0);

  // rollback
  const result2 = await PrivateWalletPackage.initLoad(account);
  expect(result2).not.toBe(null);
});

test("getWalletPackage test", async () => {
  const walletPackage = await PrivateWalletPackage.getWalletPackage();
  console.log("walletPackage:", walletPackage);
  expect(walletPackage).not.toBe(null);
});

test("getEncodedPrivateKey", async () => {
  const walletPackage = await PrivateWalletPackage.getWalletPackage();
  console.log("walletPackage:", walletPackage);
  expect(walletPackage).not.toBe(null);
  walletPackage.wallets.forEach((w) => {
    const address = w.address;
    const privatePoem = PrivateWalletPackage.getEncodedPrivateKey(address);
    console.log(`get private poem by address: ${address}, result: ${JSON.stringify(privatePoem)}`);
    expect(privatePoem).not.toBe(null);
  });
});
