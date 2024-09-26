import { bitcoin, regtest, testnet } from 'dlc-btc-lib/constants';

export const BITCOIN_NETWORK_MAP = {
  mainnet: bitcoin,
  testnet: testnet,
  regtest: regtest,
};

export const BITCOIN_BLOCK_CONFIRMATIONS = 6;
