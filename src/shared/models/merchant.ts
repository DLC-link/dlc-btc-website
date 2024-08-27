export interface Merchant {
  name: string;
  addresses: string[];
  logo: string;
}

export interface MerchantProofOfReserve {
  merchant: Merchant;
  dlcBTCAmount: number | undefined;
}
