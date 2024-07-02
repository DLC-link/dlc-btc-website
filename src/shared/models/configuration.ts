import { Merchant } from './merchant';

enum BitcoinNetworkName {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  REGTEST = 'regtest',
}

enum AppEnvironment {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  DEVNET = 'devnet',
  LOCALHOST = 'localhost',
}

type BitcoinNetworkPrefix = 'bc1' | 'tb1' | 'bcrt1';
export interface Configuration {
  appEnvironment: AppEnvironment;
  attestorURLs: string[];
  enabledEthereumNetworkIDs: string[];
  bitcoinNetwork: BitcoinNetworkName;
  bitcoinNetworkPreFix: BitcoinNetworkPrefix;
  bitcoinBlockchainURL: string;
  bitcoinBlockchainExplorerURL: string;
  bitcoinBlockchainFeeEstimateURL: string;
  merchants: Merchant[];
}
