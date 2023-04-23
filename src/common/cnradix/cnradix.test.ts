/**
 * @fileOverview
 * @name cnradix.test.ts
 * @author lidh04
 * @license copyright to shc
 */

import { encode, decode } from './cnradix'

test('test encode and decode apis', async () => {
  const values = [
    65280249784937451100252689180631191298491461790297530900719776106506177332000n,
    30823399389957737481453665787321264786771550183771699104150439986608938249162n,
    21359059409986726676457718066274830583967201436621442493270221116647745554265n
  ]
  values.forEach((value) => {
    const encodedString = encode(value);
    console.log('value:', value, 'encoded string:', encodedString);
    expect(encodedString).not.toBe(null);

    const decodeValue = decode(encodedString);
    console.log('value:', value, 'encoded string:', encodedString, 'decoded value:', decodeValue);
    expect(decodeValue).toBe(value);
  });
});
