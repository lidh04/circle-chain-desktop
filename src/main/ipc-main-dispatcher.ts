import { ipcMain } from 'electron';
import { IpcChannel } from '../common/wallet-constants';
import setUpWalletDispatcher from './ipc-wallet-dispatcher';
import setUpAccountDispatcher from './ipc-account-dispatcher';
import setUpBlockDispatcher from './ipc-block-dispatcher';

export default function setUpIPCMainDispatchers() {
  ipcMain.on(IpcChannel, async (event, arg: string) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-circle-chain', msgTemplate('pong'));
  });

  setUpWalletDispatcher();
  setUpAccountDispatcher();
  setUpBlockDispatcher();
}
