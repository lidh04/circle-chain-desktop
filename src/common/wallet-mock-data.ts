import {
  Identity,
  Ownership,
  PublicWallet,
  WalletPackage
} from './wallet-types';

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
