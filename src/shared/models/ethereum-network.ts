export interface EthereumNetwork {
  id: EthereumNetworkID;
  name: string;
  displayName: string;
}

export enum EthereumNetworkID {
  Mainnet = '1',
  Goerli = '5',
  Sepolia = '11155111',
  X1Testnet = '195',
  ArbSepolia = '421614',
}

const ethereumOKXTestnet: EthereumNetwork = {
  name: 'X1Test',
  displayName: 'X1 Testnet',
  id: EthereumNetworkID.X1Testnet,
};

const ethereumMainnet: EthereumNetwork = {
  name: 'Mainnet',
  displayName: 'ETH Mainnet',
  id: EthereumNetworkID.Mainnet,
};

const ethereumGoerli: EthereumNetwork = {
  name: 'Goerli',
  displayName: 'Goerli',
  id: EthereumNetworkID.Goerli,
};

const ethereumSepolia: EthereumNetwork = {
  name: 'Sepolia',
  displayName: 'Sepolia',
  id: EthereumNetworkID.Sepolia,
};

const ethereumArbSepolia: EthereumNetwork = {
  name: 'ArbSepolia',
  displayName: 'Arbitrum Sepolia',
  id: EthereumNetworkID.ArbSepolia,
};

export const ethereumNetworks: EthereumNetwork[] = [
  ethereumMainnet,
  ethereumGoerli,
  ethereumSepolia,
  ethereumOKXTestnet,
  ethereumArbSepolia,
];

export const hexChainIDs: { [key in EthereumNetworkID]: string } = {
  [EthereumNetworkID.Mainnet]: '0x1',
  [EthereumNetworkID.Goerli]: '0x5',
  [EthereumNetworkID.Sepolia]: '0xAA36A7',
  [EthereumNetworkID.X1Testnet]: '0x3C',
  [EthereumNetworkID.ArbSepolia]: '0x66eee',
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

  [EthereumNetworkID.X1Testnet]: [
    {
      chainId: '0xC3',
      rpcUrls: ['https://testrpc.x1.tech', 'https://x1testrpc.okx.com/'],
      chainName: 'X1 testnet',
      nativeCurrency: {
        name: 'OKB',
        symbol: 'OKB',
        decimals: 18,
      },
      blockExplorerUrls: ['https://www.oklink.com/x1-test'],
    },
  ],
  [EthereumNetworkID.Sepolia]: [
    {
      chainId: '11155111',
      rpcUrls: ['https://ethereum-sepolia.publicnode.com/', 'https://sepolia.infura.io/v3/'],
      chainName: 'Sepolia Testnet',
      nativeCurrency: {
        name: 'SepoliaETH',
        symbol: 'SepoliaETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    },
  ],
  [EthereumNetworkID.Goerli]: [
    {
      chainId: '5',
      rpcUrls: ['https://ethereum-goerli.publicnode.com', 'https://goerli.infura.io/v3/'],
      chainName: 'Goerli Testnet',
      nativeCurrency: {
        name: 'GoerliETH',
        symbol: 'GoerliETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
  ],
  [EthereumNetworkID.Mainnet]: [
    {
      chainId: '1',
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://etherscan.io/'],
    },
  ],
};
