import { Merchant } from './merchant';

enum BitcoinNetworkName {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  REGTEST = 'regtest',
}
export interface Configuration {
  attestorURLs: string[];
  enabledEthereumNetworkIDs: string[];
  bitcoinNetwork: BitcoinNetworkName;
  bitcoinBlockchainURL: string;
  bitcoinBlockchainExplorerURL: string;
  bitcoinBlockchainFeeEstimateURL: string;
  merchants: Merchant[];
}
