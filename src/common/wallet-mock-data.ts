import {
  Identity,
  Ownership,
  PublicWallet,
  WalletPackage
} from './wallet-types';
import { TransVO } from './block-types';

const identities0: Identity[] = [
  {
    type: 'identity',
    uuid: '0de5a851ef1cda49de81689cb1',
    hash: ''
  },
];

const ownerships0: Ownership[] = [
  {
    type: 'ownership',
    uuid: '0d45ae51ef1cda49de81345cb1',
    hash: ''
  },
];

const identities1: Identity[] = [
  {
    type: 'identity',
    uuid: '234fde51ef1cda49de81345cb1',
    hash: ''
  },
];

const ownerships1: Ownership[] = [
  {
    type: 'ownership',
    uuid: '1567de51ef1cda49de81345cb1',
    hash: ''
  },
];

const identities2: Identity[] = [
  {
    type: 'identity',
    uuid: '1567de51ef1cda49de81345cb1',
    hash: ''
  },
];

const ownerships2: Ownership[] = [
  {
    type: 'ownership',
    uuid: '13deae51ef1cda49de81345cb1',
    hash: ''
  },
];

const wallets: PublicWallet[] = [
  {
    address: '1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj',
    publicKey: '',
    balance: 100,
    identities: identities0,
    ownerships: ownerships0,
  },
  {
    address: '12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S',
    publicKey: '',
    balance: 200,
    identities: identities1,
    ownerships: ownerships1,
  },
  {
    address: '1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1',
    publicKey: '',
    balance: 300,
    identities: identities2,
    ownerships: ownerships2,
  },
];

export const mockWalletPackage: WalletPackage = {
  account: {
    type: 'email',
    value: 'lidh04@qq.com',
  },
  wallets,
};

export const mockTransData: TransVO[] = [
  {
    from: "1MVQfJrU3mK3M62hygJz9pmgBxVoGzPaKj",
    to: "1Lnj3A96SEix2nyY3RTm5rbqCX4tNuAXLn",
    trans: "CRY: 100",
    txType: 0,
    timestamp: "2022-10-11 22:00:00",
  },
  {
    from: "12UdA785W3Y6M3SR8HxxExe7PRcwvVg88S",
    to: "14q7erUx3bMWjzhjrx5NeK1LUKSiWe5UMY",
    trans: "IDT: 0de5a851ef1cda49de81689cb1",
    txType: 2,
    timestamp: "2022-10-11 22:00:00",
  },
  {
    from: "1L8eRrBuWnBxcQ6DKCDkkPM7ozxDcmpho1",
    to: "1FYnGyxYA5XyyjiPSGGgGJgjX8VnvQ4xw",
    trans: "IDT: 0de5a851ef1cda49de81689cb1",
    txType: 2,
    timestamp: "2022-10-11 22:00:00",
  },
  {
    from: "16rcESr6pm3x3PByQH6JEbJBzZkf5W5NQk",
    to: "1AVJGYtEKaS6P39yNGCuEPPy2xXL9Tzw5T",
    trans: "OWN: 0de5a851ef1cda49de81689cb1'",
    txType: 1,
    timestamp: "2022-10-11 22:00:00",
  },
  {
    from: "1745rpVqjXSntEniXdFhvuRHNESoYpyynp",
    to: "1HQeLrWD7n9rp95aTRF9iZzE9NvtVCeXTN",
    trans: "OWN: 0de5a851ef1cda49de81689cb1",
    txType: 1,
    timestamp: "2022-10-11 22:00:00",
  },
  {
    from: "1Jhf7pUtmqK2ZqR9du7xa6uL1Qxdc14atG",
    to: "1NHYhHDdgoiMXcWCxtEceADyTCjGw5b4Gy",
    trans: "OWN: 0de5a851ef1cda49de81689cb1",
    txType: 1,
    timestamp: "2022-10-11 22:00:00",
  },
];
