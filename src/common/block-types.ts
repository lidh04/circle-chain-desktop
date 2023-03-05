export type TxType = 0 | 1 | 2;
export interface Output {
  txId: string;
  outputIdx: number;
  value: string;
  addrs: string[];
  lockScript: string;
}

export interface Input {
  txId: string;
  idx: number;
  addrs: string[];
  curTxId: string;
  curIdx: number;
  unlockScript: string;
}

export interface Transaction {
  txId: string;
  txType: TxType;
  blockHash: string;
  inputs: Input[];
  outputs: Output[];
  merkleRootHash: string;
}

export interface Block {
  hash: string;
  prevHash: string;
  height: number;
  difficulty: number;
  nonce: number;
  merkleRootHash: string;
  transactions: Transaction[];
}

export interface TransVO {
  from: string;
  to: string;
  trans: string;
  txType: TxType;
  timestamp: Date | string;
}
