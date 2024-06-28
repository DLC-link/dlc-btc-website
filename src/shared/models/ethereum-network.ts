export interface EthereumNetwork {
  id: EthereumNetworkID;
  name: string;
  displayName: string;
  defaultNodeURL: string;
}

export enum EthereumNetworkID {
  ArbSepolia = '421614',
  Arbitrum = '42161',
  Hardhat = '31337',
}

export const ethereumArbSepolia: EthereumNetwork = {
  name: 'ArbSepolia',
  displayName: 'Arbitrum Sepolia',
  id: EthereumNetworkID.ArbSepolia,
  defaultNodeURL: 'https://sepolia-rollup.arbitrum.io/rpc',
};

export const ethereumArbitrum: EthereumNetwork = {
  name: 'Arbitrum',
  displayName: 'Arbitrum',
  id: EthereumNetworkID.Arbitrum,
  defaultNodeURL: 'https://arb1.arbitrum.io/rpc',
};

const ethereumHardhat: EthereumNetwork = {
  name: 'Hardhat',
  displayName: 'Hardhat',
  id: EthereumNetworkID.Hardhat,
  defaultNodeURL: 'http://192.168.86.32:8545',
};

export const ethereumNetworks: EthereumNetwork[] = [
  ethereumArbSepolia,
  ethereumArbitrum,
  ethereumHardhat,
];

export const hexChainIDs: { [key in EthereumNetworkID]: string } = {
  [EthereumNetworkID.ArbSepolia]: '0x66eee',
  [EthereumNetworkID.Arbitrum]: '0xa4b1',
  [EthereumNetworkID.Hardhat]: '0x7a69',
};

export const addNetworkParams = {
  [EthereumNetworkID.ArbSepolia]: [
    {
      chainId: '0x66eee',
      rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc', 'https://arb-sepolia.infura.io/v3/'],
      chainName: 'Arbitrum Sepolia Testnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://sepolia.arbiscan.io/'],
    },
  ],
  [EthereumNetworkID.Arbitrum]: [
    {
      chainId: '42161',
      rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum-mainnet.infura.io'],
      chainName: 'Arbitrum One',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://arbiscan.io/'],
    },
  ],
  [EthereumNetworkID.Hardhat]: [
    {
      chainId: '31337',
      rpcUrls: ['http://localhost:8545'],
      chainName: 'Hardhat',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: [],
    },
  ],
};
