/**
 * @fileOverview
 * @name blocks.ts
 * @author lidh04
 * @license copyright to shc
 */
import { TransVO, TxType } from "common/block-types";
import { AddressType } from "common/wallet-types";
import { store_get } from '../common/store-config';
import axios from 'axios';

type TransactionInfo = {
  fromAddress: string;
  toAddress: string;
  txId: string;
  idx: number;
  txType: number; // txType: 0 积分, 1 所有权, 2身份认证
  inOut: string;  // inOut代表输入还是输出: IN 输入, OUT 输出
  value: string;
  timestamp: string; // 产生时间 yyyy-mm-dd HH:MM:SS
};

export async function searchTransaction(address: string, addressType: AddressType, txType?: TxType, uuid?: string): Promise<TransVO[]> {
  const host = store_get("host");
  const url = `${host}/wallet/public/v1/search-transaction`;
  const data = {
    address,
    inOut: addressType == "from" ? "OUT" : "IN",
    transactionContent: {
      type: typeof (txType) === 'undefined' ? 0 : txType,
      uuid: ""
    }
  }
  if (!!uuid) {
    data.inOut = "";
    data.transactionContent.uuid = uuid;
  }
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (response.status === 200) {
      const json = response.data as { status: number, data: TransactionInfo[] };
      if (json.status === 200) {
        const data = json.data as TransactionInfo[];
        console.log("receive data from url:", url, "data:", data);
        return data.map(t => ({
          from: t.fromAddress,
          to: t.toAddress,
          txType: t.txType,
          trans: buildTrans(t),
          timestamp: t.timestamp
        }));
      }
    }
  } catch (err: any) {
    console.error("cannot post to url", url, "with data:", data, "error:", err.name, err.message, err);
  }

  return [];
}

function buildTrans(t: TransactionInfo) {
  switch (t.txType) {
    case 0:
      return `CRY: ${t.value}`;
    case 1:
      return `OWN: ${t.value}`;
    case 2:
      return `IDT: ${t.value}`;
    default:
      return "";
  }
}

export async function sendTo(from: string, toEmail: string, assetType: number, value: number | string) {
  // TODO add sendTO logic here!
  await new Promise(r => setTimeout(r, 7000));
  return true;
}
