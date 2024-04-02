import { BigNumber } from 'ethers';

export enum VaultState {
  READY = 0,
  FUNDED = 1,
  CLOSING = 2,
  CLOSED = 3,
  FUNDING = 4,
}

export interface Vault {
  uuid: string;
  timestamp: number;
  collateral: number;
  state: number;
  fundingTX: string;
  closingTX: string;
  btcFeeRecipient: string;
  btcMintFeeBasisPoints: number;
  btcRedeemFeeBasisPoints: number;
  taprootPubkey: string;
}

export interface RawVault {
  uuid: string;
  protocolContract: string;
  timestamp: BigNumber;
  valueLocked: BigNumber;
  creator: string;
  status: number;
  fundingTxId: string;
  closingTxId: string;
  btcFeeRecipient: string;
  btcMintFeeBasisPoints: BigNumber;
  btcRedeemFeeBasisPoints: BigNumber;
  taprootPubkey: string;
}
