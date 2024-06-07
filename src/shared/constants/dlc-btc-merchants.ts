import { Merchant, MerchantProofOfReserve } from '@models/merchant';

const AMBER_MAINNET: Merchant = {
  name: 'AMBER',
  address: '0xff200709bf9bbc5209ba4b5dd767913a8a06b73f',
  logo: '/images/logos/amber-logo.svg',
};

const AMBER_TESTNET: Merchant = {
  name: 'AMBER',
  address: '',
  logo: '/images/logos/amber-logo.svg',
};

const AMBER_DEVNET: Merchant = {
  name: 'AMBER',
  address: '',
  logo: '/images/logos/amber-logo.svg',
};

export const mainnetMerchants = [AMBER_MAINNET];
export const testnetMerchants = [AMBER_TESTNET];
export const devnetMerchants = [AMBER_DEVNET];

export const defaultMerchantProofOfReserveArray: MerchantProofOfReserve[] = mainnetMerchants.map(
  merchant => ({
    merchant,
    dlcBTCAmount: undefined,
  })
);
