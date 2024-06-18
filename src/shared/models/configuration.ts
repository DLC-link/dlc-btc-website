import { Merchant } from './merchant';

enum BitcoinNetworkName {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
  REGTEST = 'regtest',
}

type BitcoinNetworkPrefix = 'bc1' | 'tb1' | 'bcrt1';
export interface Configuration {
  attestorURLs: string[];
  enabledEthereumNetworkIDs: string[];
  infuraWebsocketURL: string;
  bitcoinNetwork: BitcoinNetworkName;
  bitcoinNetworkPreFix: BitcoinNetworkPrefix;
  bitcoinBlockchainURL: string;
  bitcoinBlockchainExplorerURL: string;
  bitcoinBlockchainFeeEstimateURL: string;
  merchants: Merchant[];
}
