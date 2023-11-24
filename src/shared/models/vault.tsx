import { BigNumber } from "ethers";

export enum VaultState {
  READY = 0,
  FUNDED = 1,
  CLOSING = 2,
  CLOSED = 3,
  FUNDING = 4,
}

export interface Vault {
  uuid: string;
  collateral: number;
  state: number;
  fundingTX: string;
  closingTX: string;
  timestamp: number;
}

export interface RawVault {
  uuid: string;
  protocolWallet: string;
  protocolContract: string;
  timestamp: BigNumber;
  valueLocked: BigNumber;
  creator: string;
  outcome: string;
  status: number;
  fundingTxId: string;
  closingTxId: string;
}
