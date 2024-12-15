import { ipcMain } from 'electron';
import { SearchTransaction } from '../common/wallet-constants';
import { TxType } from '../common/block-types';
import { searchTransaction } from './blocks';
import { AddressType } from '../common/wallet-types';

export default function setUpBlockDispatcher() {
  ipcMain.handle(
    SearchTransaction,
    async (event, address: string, addressType: AddressType, txType?: TxType, uuid?: string) => {
      console.log(
        'search transaction by address:',
        address,
        'addressType:',
        addressType,
        'txType:',
        txType,
        'uuid:',
        uuid
      );
      return searchTransaction(address, addressType, txType, uuid);
    }
  );
}
