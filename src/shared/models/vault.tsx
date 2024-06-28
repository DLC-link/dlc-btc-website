export interface Vault {
  uuid: string;
  timestamp: number;
  valueLocked: number;
  valueMinted: number;
  state: number;
  userPublicKey: string;
  fundingTX: string;
  closingTX: string;
  withdrawTX: string;
  btcFeeRecipient: string;
  btcMintFeeBasisPoints: number;
  btcRedeemFeeBasisPoints: number;
  taprootPubKey: string;
}
