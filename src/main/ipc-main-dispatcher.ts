import { BrowserWindow, ipcMain } from 'electron';
import os from 'os';
import { GET_CPU_COUNT, IpcChannel, RELOAD } from '../common/wallet-constants';
import setUpWalletDispatcher from './ipc-wallet-dispatcher';
import setUpAccountDispatcher from './ipc-account-dispatcher';
import setUpBlockDispatcher from './ipc-block-dispatcher';

export default function setUpIPCMainDispatchers(mainWindow: BrowserWindow) {
  ipcMain.on(IpcChannel, async (event, arg: string) => {
    const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
    console.log(msgTemplate(arg));
    event.reply('ipc-circle-chain', msgTemplate('pong'));
  });

  ipcMain.on(RELOAD, async (event, arg: string) => {
    mainWindow.webContents.reloadIgnoringCache();
  });

  ipcMain.handle(GET_CPU_COUNT, async (event) => {
    return os.cpus().length;
  });

  setUpWalletDispatcher();
  setUpAccountDispatcher();
  setUpBlockDispatcher();
}
