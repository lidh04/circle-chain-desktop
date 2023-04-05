/**
 * @fileOverview
 * @name cnradix.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { encode, decode } from './cnradix'

test('test encode and decode apis', async () => {
  const value = 18014398509481982n;
  const encodedString = encode(value);
  console.log('value:', value, 'encoded string:', encodedString);
  expect(encodedString).not.toBe(null);

  const decodeValue = decode(encodedString);
  console.log('value:', value, 'encoded string:', encodedString, 'decoded value:', decodeValue);
  expect(decodeValue).toBe(value);
});
