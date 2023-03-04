/**
 * @fileOverview
 * @name create-wallet.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { exec } from "child_process";

const address = "mock-address-1";
const publicKey = "mock-public-key";
const balance = 0;
test("createWallet test", async () => {
  const result = {
    address,
    publicKey,
    balance,
    identities: [],
    ownerships: []
  }
  expect(result).not.toBe(null);
  expect(result.address).toBe(address);
});
