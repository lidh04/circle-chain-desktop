/**
 * @fileOverview
 * @name wallet-service.ts
 * @author lidh04
 * @license copyright to shc
 */

import axios from 'axios';
import { Identity, Ownership, PublicWallet } from '../common/wallet-types';
import { store_get } from '../common/store-config';

type BalanceVO = {
  confirmed: number;
  unconfirmed: number;
};

export async function getWalletAssetsByAddress(address: string) : Promise<Partial<PublicWallet>>{
  const ownerships = await getAssetsOfAddress(address, 1) as Ownership[];
  const identities = await getAssetsOfAddress(address, 2) as Identity[];
  const balanceVO = await getBalance(address);

  return {
    address,
    balance: balanceVO.confirmed,
    identities,
    ownerships
  }
}

async function getBalance(address: string): Promise<BalanceVO> {
  const host = store_get("host");
  const url = `${host}/wallet/public/v1/get-balance-by-address?address=${address}`;
  const balanceVO: BalanceVO = {
    confirmed: 0,
    unconfirmed: 0
  };
  try {
    const response = await axios.get(url);
    if (response.status == 200) {
      const json = response.data as { status: number, data: { confirmed: number, unconfirmed: number } };
      if (json.status === 200) {
        console.log("url:", url, "json:", json);
        balanceVO.confirmed = json.data.confirmed as number;
        balanceVO.unconfirmed = json.data.unconfirmed as number;
      } else {
        console.error("not get balance for url:", url, "status:", response.status);
      }
    }
  } catch (err: any) {
    console.error(`fetch balance from url: ${url}, error`, err.name, err.message, err);
  }

  return balanceVO;
}

async function getAssetsOfAddress(address: string, type: number): Promise<Identity[] | Ownership[]> {
  const host = store_get("host");
  const url = `${host}/wallet/public/v1/get-assets-of-address?address=${address}&type=${type}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      const json = response.data as { status: number, data: { value: string, doubleHashHex: string }[] };
      console.log("url:", url, "json:", json);
      const data = json.data as { value: string, doubleHashHex: string }[];
      if (type === 1) { // ownership
        return (data || []).map(item => ({
          uuid: item.value,
          hash: item.doubleHashHex,
          type: 'ownership'
        }));
      } else { // 2 identity
        return (data || []).map(item => ({
          uuid: item.value,
          hash: item.doubleHashHex,
          type: 'identity'
        }));
      }
    } else {
      console.error("get url:", url, "failed, response status:", response.status);
    }
  } catch (err: any) {
    console.error("fetch url:", url, "error:", err.name, err.message, err);
  }
  return [];
}

export async function uploadUidAndAddress(uid: string, addresses: string[]) {
  const host = store_get("host");
  const url = `${host}/wallet/public/v1/upload-uid-and-address`;
  const data = {
    uid,
    addressList: addresses
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.info("post url:", url, "data:", data, "status:", response.status);
    if (response.status === 200) {
      const json = response.data as { status: number };
      return json.status === 200;
    }
  } catch (err: any) {
    console.error('post url:', url, "data:", data, "error:", err.name, err.message, err);
  }
  return false;
}
