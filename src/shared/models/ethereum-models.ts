import { EthereumDeploymentPlan, EthereumNetwork } from 'dlc-btc-lib/models';

export interface EthereumNetworkConfiguration {
  ethereumExplorerAPIURL: string;
  ethereumAttestorChainID:
    | 'evm-sepolia'
    | 'evm-arbitrum'
    | 'evm-arbsepolia'
    | 'evm-base'
    | 'evm-basesepolia'
    | 'evm-hardhat-arb';
  enabledEthereumNetworks: EthereumNetwork[];
  ethereumContractDeploymentPlans: EthereumDeploymentPlan[];
}

export interface TimeStampedEvent {
  timestamp: number;
  amount: number;
  totalValueLocked: number;
}
export interface DetailedEvent {
  from: string;
  to: string;
  value: number;
  timestamp: number;
  txHash: string;
}

export interface ProtocolRewards {
  name: string;
  points: number;
  currentDLCBTC: number;
  multiplier: number;
}

export interface PointsData {
  total: number;
  protocols: ProtocolRewards[];
}
