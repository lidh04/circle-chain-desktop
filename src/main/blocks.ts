/**
 * @fileOverview
 * @name blocks.ts
 * @author lidh04
 * @license copyright to shc
 */
import { mockTransData } from '../common/wallet-mock-data';
import { TransVO, TxType } from "common/block-types";
import { AddressType } from "common/wallet-types";

export async function searchTransaction(address: string, addressType: AddressType, txType?: TxType, uuid?: string): Promise<TransVO[]> {
  // TODO add search codes here
  if (!address) {
    if (txType === 0 || txType === 1 || txType === 2) {
      return mockTransData.filter((t) => t.txType === txType);
    } else if (uuid) {
      return mockTransData.filter((t) => t.trans.indexOf(uuid) !== -1);
    }
    return mockTransData;
  }

  const filteredTransData = mockTransData.filter((t) => addressType === 'from' ? t.from === address : t.to === address);
  return filteredTransData;
}

export async function sendTo(from: string, toEmail: string, assetType: number, value: number | string) {
  // TODO add sendTO logic here!
  await new Promise(r => setTimeout(r, 7000));
  return true;
}
