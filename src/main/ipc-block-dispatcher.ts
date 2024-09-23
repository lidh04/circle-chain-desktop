import { ipcMain } from 'electron';
import { AddressType, SearchTransaction } from '../common/wallet-types';
import { TxType } from '../common/block-types';
import { searchTransaction } from './blocks';

export default function setUpBlockDispatcher() {
  ipcMain.handle(
    SearchTransaction,
    async (
      event,
      address: string,
      addressType: AddressType,
      txType?: TxType,
      uuid?: string
    ) => {
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
