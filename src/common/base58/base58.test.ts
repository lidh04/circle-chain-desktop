/**
 * @fileOverview
 * @name base58.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { base58ToBinary, binaryToBase58 } from "./base58";

test("test binaryToBase58 and base58ToBinary", async () => {
  const mockBuffer = Buffer.from("this is the text data to test");
  const mockUint8Array = new Uint8Array(mockBuffer.byteLength);
  mockBuffer.map((b, i) => mockUint8Array[i] = b);
  const base58Str = binaryToBase58(mockUint8Array);
  const binary58 = base58ToBinary(base58Str);
  const base58Str2 = binaryToBase58(binary58);
  console.log("src uint8array:", mockUint8Array, `base58Str: ${base58Str}, base58Str2: ${base58Str2}`);
  expect(base58Str).toBe(base58Str2);
});
