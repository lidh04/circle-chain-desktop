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

type TrySendToRequest = {
  from: string;
  address?: string;
  receivePhone?: string;
  email?: string;
  transContent: TransactionContentPO;
};

type ConfirmSendToRequest = {
  publicKey: string;
  keyToSignedDataMap: Record<string, string>;
  unsignedTxJson: string;
};

type RemoteInput = {
  txId: string;
  txIdStr: string;
  txOutputIndex: number;
  unlockScript: unknown;
  serialNO: number;
};

type RemoteOutput = {
  txId: string;
  txIdStr: string;
  idx: number;
  status: number;
  value: unknown;
  lockScript: unknown;
};
type RemoteTransaction = {
  txId: string;
  txIdStr: string;
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
        const txInfos = json.data as TransactionInfo[];
        console.log('receive data from url:', url, 'data:', JSON.stringify(txInfos));
        return txInfos.map((tx) => ({
          from: tx.fromAddress,
          to: tx.toAddress,
          txType: tx.txType as TxType,
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          trans: buildTrans(tx),
          timestamp: tx.timestamp,
        }));
      }
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('cannot post to url', url, 'with data:', data, 'error:', err.name, err.message, err);
    }
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

export async function sendTo(from: string, toEmail: string, assetType: number, value: number | string) {
  const host = storeGet('host');
  const url = `${host}/wallet/public/v1/try-send-to`;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const valueHex = makeValueHex(value);
  const data: TrySendToRequest = {
    from,
    email: toEmail,
    transContent: {
      type: assetType,
      valueHex,
    },
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
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const keyToSignedDataMap: Record<string, string> = makeKeyToSignedDataMap(tx, from);
        const confirmSendToRequest: ConfirmSendToRequest = {
          publicKey: Buffer.from(publicKey).toString('hex'),
          keyToSignedDataMap,
          unsignedTxJson: txJson,
        };
        console.log('confirmSendToRequest:', confirmSendToRequest);
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('try to send to request url:', url, 'error:', err.name, err.message, err);
      return [false, err.message as string];
    }
    return [false, 'unknown error'];
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
    const key = `${input.txIdStr}:${input.txOutputIndex}`;
    const data = Buffer.from(key);
    const signedData = PrivateWalletPackage.signData(data, address);
    record[key] = signedData;
  });
  return record;
}
