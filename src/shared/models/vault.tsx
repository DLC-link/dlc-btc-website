export enum VaultStatus {
  READY,
  FUNDED,
  CLOSING,
  CLOSED,
  FUNDING,
}

export interface Vault {
  uuid: string;
  collateral: number;
  state: VaultStatus;
  fundingTX: string;
  closingTX: string;
}
