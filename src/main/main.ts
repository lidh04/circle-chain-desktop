import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { mkdir, readFile, writeFile, chmod } from "fs/promises";
import path from 'path';

import {
  AddressType,
  CreateWallet,
  GetEncodedPrivateKey,
  GetWalletPackage,
  IpcChannel,
  SearchTransaction,
  SendToChannel
} from '../common/wallet-types';
import {
  EmailAccount,
  GetAccount,
  PhoneAccount,
  SaveAccount
} from '../common/account-types';
import { PrivateWalletPackage } from './wallet-privacy';
import { TxType } from '../common/block-types';
import { getAccountInfoPath } from '../common/acount';
import {
  mockTransData,
} from '../common/wallet-mock-data';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';
import createWallet from './create-wallet';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on(IpcChannel, async (event, arg: string) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-circle-chain', msgTemplate('pong'));
});

ipcMain.handle(CreateWallet, async (event) => {
  console.log("create wallet request...");
  const wallet = await createWallet();
  return wallet;
});

ipcMain.handle(GetWalletPackage, async (event, email: string) => {
  console.log("get wallet package by email:", email);
  try {
    if (email) {
      const account: EmailAccount = {
        type: "email",
        value: email
      };
      await PrivateWalletPackage.initLoad(account);
    }
    return await PrivateWalletPackage.getWalletPackage();
  } catch (err: any) {
    console.error("cannot get wallet package by email:", email, "error:", err.message, err);
    throw err;
  }
});

ipcMain.handle(GetEncodedPrivateKey, async (event, address: string) => {
  const privatePoem = PrivateWalletPackage.getEncodedPrivateKey(address);
  console.log("get encoded private key by address:", address, "result:", privatePoem);
  return privatePoem;
});

ipcMain.handle(GetAccount, async (event) => {
  const accountInfoPath = getAccountInfoPath();
  try {
    const content = await readFile(accountInfoPath, { encoding: "utf8" });
    const account = JSON.parse(content);
    console.log("get account:", account, "in account info path:", accountInfoPath);
    return account;
  } catch (err: any) {
    console.warn("get file error:", err.message, err);
    return null;
  }
});

ipcMain.handle(SaveAccount, async (event, account: EmailAccount | PhoneAccount) => {
  const content = JSON.stringify(account);
  const accountInfoPath = getAccountInfoPath();
  try {
    const dirname = path.dirname(accountInfoPath);
    await mkdir(dirname, { recursive: true });
    await writeFile(accountInfoPath, content);
    await chmod(accountInfoPath, 0o600);
    return true;
  } catch (err: any) {
    console.error("cannot write file in path: ", accountInfoPath, "error:", err.message, err);
    return false;
  }
});

ipcMain.handle(SearchTransaction, async (event, address: string, addressType: AddressType, txType?: TxType, uuid?: string) => {
  console.log("search transaction by address:", address, "addressType:", addressType, "txType:", txType, "uuid:", uuid);
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
});

ipcMain.handle(SendToChannel, async (event, from: string, toEmail: string, assetType: number, value: number | string) => {
  console.log(`${SendToChannel} from: ${from}, toEmail: ${toEmail}, assetType: ${assetType}, value: ${value}`);
  await new Promise(r => setTimeout(r, 7000));
  return true;
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  //mainWindow.setResizable(false);
  mainWindow.maximize();
  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
