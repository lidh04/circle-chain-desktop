/**
 * @fileOverview
 * @name create-wallet.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { EmailAccount } from '../common/account-types';
import { PrivateWalletPackage } from './wallet-privacy';
import createWallet from './create-wallet';

const account: EmailAccount = {
  value: "lidh04@qq.com",
  type: "email"
};
test("createWallet test", async () => {
  await PrivateWalletPackage.initLoad(account);
  try {
    const result = await createWallet();
    expect(result).not.toBe(null);
    console.log("result: ", result);
  } catch (err) {
  }
});
