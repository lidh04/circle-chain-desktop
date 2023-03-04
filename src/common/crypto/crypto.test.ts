/**
 * @fileOverview
 * @name crypto.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { randomBytes } from "crypto";
import { decrypt, encrypt } from "./crypto";

const securityKey = randomBytes(32);
const initVector = randomBytes(16);
test("test crypto and decrypt methods", async () => {
  const message = "this is the test origin text here!";
  const encrypted = encrypt(securityKey, initVector, message);
  console.log("message:", message, "encrypt:", encrypted);
  expect(encrypted).not.toBe("");
  const decrypted = decrypt(securityKey, initVector, encrypted);
  console.log("message:", message, "encrypt:", encrypted, "decrypted:", decrypted);
  expect(decrypted).toBe(message);
});
