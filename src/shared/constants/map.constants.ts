import {
  bitcoin,
  ethereumArbitrum,
  ethereumArbitrumSepolia,
  regtest,
  testnet,
} from 'dlc-btc-lib/constants';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { EthereumNetwork } from 'dlc-btc-lib/models';

export const BITCOIN_NETWORK_MAP = {
  mainnet: bitcoin,
  testnet: testnet,
  regtest: regtest,
};

export const ETHEREUM_NETWORK_MAP: { [P in EthereumNetworkID]: EthereumNetwork } = {
  [EthereumNetworkID.Arbitrum]: ethereumArbitrum,
  [EthereumNetworkID.ArbitrumSepolia]: ethereumArbitrumSepolia,
};
