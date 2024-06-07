export interface Merchant {
  name: string;
  address: string;
  logo: string;
}

export interface MerchantProofOfReserve {
  merchant: Merchant;
  dlcBTCAmount: number | undefined;
}
