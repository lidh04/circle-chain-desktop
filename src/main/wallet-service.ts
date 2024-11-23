/**
 * @fileOverview
 * @name wallet-service.ts
 * @author lidh04
 * @license copyright to shc
 */

import axios from 'axios';
import wallet from '@lidh04/circle-chain-sdk';
import { Identity, MyBlockData, MyBlockRequest, Ownership, PublicWallet } from '../common/wallet-types';
import { store_get } from '../common/store-config';

type BalanceVO = {
  confirmed: number;
  unconfirmed: number;
};

export type AddressSignVO = {
  publicKey: string;
  address: string;
  signData: string;
};

export async function getWalletAssetsByAddress(address: string): Promise<Partial<PublicWallet>> {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const ownerships = (await getAssetsOfAddress(address, 1)) as Ownership[];
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const identities = (await getAssetsOfAddress(address, 2)) as Identity[];
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const balanceVO = await getBalance(address);

  return {
    address,
    balance: balanceVO.confirmed,
    identities,
    ownerships,
  };
}

async function getBalance(address: string): Promise<BalanceVO> {
  const host = store_get('host');
  const url = `${host}/wallet/public/v1/get-balance-by-address?address=${address}`;
  const balanceVO: BalanceVO = {
    confirmed: 0,
    unconfirmed: 0,
  };
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const json = response.data as {
        status: number;
        data: { confirmed: number; unconfirmed: number };
      };
      if (json.status === 200) {
        console.log('url:', url, 'json:', json);
        balanceVO.confirmed = json.data.confirmed as number;
        balanceVO.unconfirmed = json.data.unconfirmed as number;
      } else {
        console.error('not get balance for url:', url, 'status:', response.status);
      }
    }
  } catch (err: any) {
    console.error(`fetch balance from url: ${url}, error`, err.name, err.message, err);
  }

  return balanceVO;
}

async function getAssetsOfAddress(address: string, type: number): Promise<Identity[] | Ownership[]> {
  const host = store_get('host');
  const url = `${host}/wallet/public/v1/get-assets-of-address?address=${address}&type=${type}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const json = response.data as {
        status: number;
        data: { value: string; doubleHashHex: string }[];
      };
      console.log('url:', url, 'json:', json);
      const data = json.data as { value: string; doubleHashHex: string }[];
      if (type === 1) {
        // ownership
        return (data || []).map((item) => ({
          uuid: item.value,
          hash: item.doubleHashHex,
          type: 'ownership',
        }));
      } // 2 identity
      return (data || []).map((item) => ({
        uuid: item.value,
        hash: item.doubleHashHex,
        type: 'identity',
      }));
    }
    console.error('get url:', url, 'failed, response status:', response.status);
  } catch (err: any) {
    console.error('fetch url:', url, 'error:', err.name, err.message, err);
  }
  return [];
}

export async function uploadUidAndAddress(uid: string, addresses: AddressSignVO[]) {
  const host = store_get('host');
  const url = `${host}/wallet/public/v1/upload-uid-and-address`;
  const data = {
    uid,
    addressSignBeanList: addresses,
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.info('post url:', url, 'data:', data, 'status:', response.status);
    if (response.status === 200) {
      const json = response.data as { status: number };
      console.info('post url:', url, 'data:', data, 'status:', response.status, 'return data:', response.data);
      return json.status === 200;
    }
  } catch (err: any) {
    console.error('post url:', url, 'data:', data, 'error:', err.name, err.message, err);
  }
  return false;
}

export async function fetchMyBlockData(address: string) {
  const host = store_get('host');
  const url = `${host}/public/v1/miner/fetchMyBlock?address=${address}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const data = response.data as { status: number; message: string; data: MyBlockData };
      const { status, message, data: myBlockData } = data;
      if (status === 200) {
        return myBlockData;
      }
      console.error('cannot fetch my block data, status:', status, 'message:', message);
    }
    console.error('cannot fetch my block data, status:', response.status, 'message:', response.status);
  } catch (err: any) {
    console.error('get url:', url, 'error:', err.name, err.message, err);
  }

  return null;
}

export async function postMyBlock(data: MyBlockRequest) {
  const host = store_get('host');
  const url = `${host}/public/v1/miner/postMyBlock`;
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.info('post url:', url, 'data:', data, 'status:', response.status);
    if (response.status === 200) {
      const json = response.data as { status: number; data: boolean };
      console.info('post url:', url, 'data:', data, 'status:', response.status, 'return data:', response.data);
      return json.status === 200 && json.data;
    }
  } catch (err: any) {
    console.error('post url:', url, 'data:', data, 'error:', err.name, err.message, err);
  }
  return false;
}

export async function stopMineBlock() {
  await wallet.miner.terminateAndClearWorkers();
}

export async function mineBlock(address: string, threadCount: number) {
  let data: MyBlockData | null = null;
  let times = 0;
  while (times < 24 * 60 * 2) {
    // eslint-disable-next-line no-await-in-loop
    data = await fetchMyBlockData(address);
    if (data) {
      break;
    }
    times += 1;

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 30000);
    });
  }

  if (!data) {
    return {
      code: 404,
      msg: 'there is no block exists to be mined!',
    };
  }

  const { ipPort, blockHeaderHexString } = data;
  let minedBlockHeaderHexString;
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('mine block timeout!'));
    }, 30 * 60 * 1000);
  });
  try {
    const mineBlockPromise = wallet.miner.mineBlock(blockHeaderHexString, threadCount);
    minedBlockHeaderHexString = await Promise.any([timeoutPromise, mineBlockPromise]);
  } catch (err) {
    if (err instanceof Error) {
      const { message } = err;
      if (message.indexOf('not support') !== -1) {
        return {
          code: 10000,
          msg: message,
        };
      }
      if (message.indexOf('timeout') !== -1) {
        wallet.miner.terminateAndClearWorkers();
        return {
          code: 10000,
          msg: message,
        };
      }
    }
  }

  if (minedBlockHeaderHexString) {
    const postResult = await postMyBlock({
      address,
      ipPort,
      blockHeaderHexString: minedBlockHeaderHexString,
    });
    console.log('mine result:', postResult);
    return {
      code: 200,
      data: postResult,
      msg: 'success',
    };
  }

  return {
    code: 10000,
    msg: 'mined failure',
  };
}
