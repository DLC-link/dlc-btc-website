import { EthereumNetwork } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';
import { Chain } from 'viem';

export interface EthereumNetworkConfiguration {
  ethereumExplorerAPIURL: string;
  websocketURL: string;
  httpURL: string;
  ethereumAttestorChainID:
    | 'evm-mainnet'
    | 'evm-sepolia'
    | 'evm-arbitrum'
    | 'evm-arbsepolia'
    | 'evm-base'
    | 'evm-basesepolia'
    | 'evm-hardhat-arb'
    | 'evm-hardhat-eth';
  enabledEthereumNetworks: EthereumNetwork[];
  dlcManagerContract: Contract;
  dlcBTCContract: Contract;
  chain: Chain;
}

export interface DetailedEvent {
  from: string;
  to: string;
  value: number;
  timestamp: number;
  txHash: string;
  isCCIP: boolean;
  chain: string;
  eventType: 'mint' | 'burn' | 'transfer';
}
export interface FormattedEvent {
  merchant: string;
  dlcBTCAmount: number;
  txHash: string;
  date: string;
  chain: string;
  isMint: boolean;
  isCCIP: boolean;
}
