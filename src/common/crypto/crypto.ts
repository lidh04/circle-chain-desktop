/**
 * @fileOverview
 * @name crypto.ts
 * @author lidh04
 * @license copyright to shc
 */
import { createCipheriv, createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-cbc";

export function encrypt(securityKey: Uint8Array, initVector: Uint8Array, message: string): string {
  const cipher = createCipheriv(ALGORITHM, securityKey, initVector);
  // encrypt the message
  // input encoding
  // output encoding
  let encryptedData = cipher.update(message, "utf-8", "hex");
  encryptedData += cipher.final("hex");
  return encryptedData;
}

export function decrypt(securityKey: Uint8Array, initVector: Uint8Array, encryptedData: string): string {
  const decipher = createDecipheriv(ALGORITHM, securityKey, initVector);
  let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
  decryptedData += decipher.final("utf8");
  return decryptedData;
}
