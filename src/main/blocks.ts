/**
 * @fileOverview
 * @name blocks.ts
 * @author lidh04
 * @license copyright to shc
 */
import axios from 'axios';
import { AddressType } from 'common/wallet-types';
import { TransVO, TxType } from 'common/block-types';
import { PrivateWalletPackage } from './wallet-privacy';
import storeGet from '../common/store-config';

type TransactionInfo = {
  fromAddress: string;
  toAddress: string;
  txId: string;
  idx: number;
  txType: number; // txType: 0 积分, 1 所有权, 2身份认证
  inOut: string; // inOut代表输入还是输出: IN 输入, OUT 输出
  value: string;
  timestamp: string; // 产生时间 yyyy-mm-dd HH:MM:SS
};

type TransactionContentPO = {
  type: number;
  valueHex?: string;
};

type SendToRequest = {
  from: string;
  address?: string;
  receivePhone?: string;
  email?: string;
  transContent: TransactionContentPO;
  payPassword: string;
};

type ConfirmSendToRequest = {
  publicKey: string;
  keyToSignedDataMap: Record<string, string>;
  unsignedTxJson: string;
};

type RemoteInput = {
  txId: Uint8Array;
  txOutputIndex: number;
  unlockScript: any;
  serialNO: number;
};

type RemoteOutput = {
  txId: Uint8Array;
  idx: number;
  status: number;
  value: any;
  lockScript: any;
};
type RemoteTransaction = {
  txId: Uint8Array;
  type: number;
  inputs: RemoteInput[];
  outputs: RemoteOutput[];
  createTime: number;
};

export async function searchTransaction(
  address: string,
  addressType: AddressType,
  txType?: TxType,
  uuid?: string
): Promise<TransVO[]> {
  const host = storeGet('host');
  const url = `${host}/wallet/public/v1/search-transaction`;
  const data = {
    address,
    inOut: addressType === 'from' ? 'OUT' : 'IN',
    transactionContent: {
      type: typeof txType === 'undefined' ? 0 : txType,
      uuid: '',
    },
  };
  if (uuid) {
    data.inOut = '';
    data.transactionContent.uuid = uuid;
  }
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const json = response.data as { status: number; data: TransactionInfo[] };
      if (json.status === 200) {
        const data = json.data as TransactionInfo[];
        console.log('receive data from url:', url, 'data:', data);
        return data.map((t) => ({
          from: t.fromAddress,
          to: t.toAddress,
          txType: t.txType as TxType,
          trans: buildTrans(t),
          timestamp: t.timestamp,
        }));
      }
    }
  } catch (err: any) {
    console.error('cannot post to url', url, 'with data:', data, 'error:', err.name, err.message, err);
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
      return '';
  }
}

export async function sendTo(
  from: string,
  toEmail: string,
  assetType: number,
  value: number | string,
  payPassword: string
) {
  const host = storeGet('host');
  const url = `${host}/wallet/public/v1/try-send-to`;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const valueHex = makeValueHex(value);
  const data: SendToRequest = {
    from,
    email: toEmail,
    transContent: {
      type: assetType,
      valueHex,
    },
    payPassword,
  };
  try {
    console.log('begin to post url:', url, 'data:', data);
    const tryResponse = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let msg = '';
    if (tryResponse.status === 200) {
      const json = tryResponse.data as {
        status: number;
        data: string;
        message: string;
      };
      msg = json.message;
      console.log('get data from url:', url, 'json data:', json);
      if (json.status === 200) {
        const txJson = json.data;
        const tx = JSON.parse(txJson) as RemoteTransaction;
        const publicKey = PrivateWalletPackage.getPublicKey(from);
        const keyToSignedDataMap: Record<string, string> = makeKeyToSignedDataMap(tx, from);
        const confirmSendToRequest: ConfirmSendToRequest = {
          publicKey: Buffer.from(publicKey).toString('hex'),
          keyToSignedDataMap,
          unsignedTxJson: txJson,
        };
        const confirmUrl = `${host}/wallet/public/v1/confirm-send-to`;
        const confirmResponse = await axios.post(confirmUrl, confirmSendToRequest, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (confirmResponse.status === 200) {
          const confirmJson = confirmResponse.data as {
            status: number;
            data: boolean;
            message: string;
          };
          msg = confirmJson.message;
          console.log('get data from confirmUrl:', confirmUrl, 'json data:', confirmJson);
          if (confirmJson.status === 200) {
            return [confirmJson.data, msg];
          }
          return [false, msg];
        }
        console.error('confirm url:', confirmUrl, 'status:', confirmResponse.status);
        return [false, `status: ${confirmResponse.status}`];
      }
      return [false, msg];
    }
    console.error('post url:', url, 'data:', data, 'status:', tryResponse.status);
    return [false, `status: ${tryResponse.status}`];
  } catch (err: any) {
    console.error('try to send to request url:', url, 'error:', err.name, err.messge, err);
    return [false, err.message as string];
  }
}

function makeValueHex(value: number | string) {
  if (!Number.isFinite(value)) {
    return value as string;
  }

  const numberValue = value as number;
  const buf = Buffer.allocUnsafe(16);
  buf.fill(0);
  buf.writeBigUInt64BE(BigInt(numberValue), 0);
  return buf.toString('hex');
}

function makeKeyToSignedDataMap(tx: RemoteTransaction, address: string) {
  const record: Record<string, string> = {};
  tx.inputs.forEach((input) => {
    const key = `${Buffer.from(input.txId).toString('hex')}:${input.txOutputIndex}`;
    const data = Buffer.from(key);
    const signedData = PrivateWalletPackage.signData(data, address);
    record[key] = Buffer.from(signedData).toString('hex');
  });
  return record;
}
