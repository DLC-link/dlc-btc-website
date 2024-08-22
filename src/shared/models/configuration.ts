import { EthereumDeploymentPlan, EthereumNetworkID } from 'dlc-btc-lib/models';

import { Merchant } from './merchant';
import { Protocol } from './protocol';

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
  enabledEthereumNetworkIDs: EthereumNetworkID[];
  ethereumContractInformations: { name: string; deploymentPlans: EthereumDeploymentPlan[] }[];
  ethereumInfuraWebsocketURL: string;
  ethereumAlchemyWebsocketURL: string;
  bitcoinNetwork: BitcoinNetworkName;
  bitcoinNetworkIndex: number;
  bitcoinNetworkPreFix: BitcoinNetworkPrefix;
  bitcoinBlockchainURL: string;
  bitcoinBlockchainExplorerURL: string;
  bitcoinBlockchainFeeEstimateURL: string;
  merchants: Merchant[];
  protocols: Protocol[];
}
