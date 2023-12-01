export interface Network {
  id: EthereumNetwork;
  name: string;
}

export enum EthereumNetwork {
  Mainnet = "1",
  Goerli = "5",
  Sepolia = "11155111",
  X1Testnet = "195",
}

const ethereumOKXTestnet: Network = {
  name: "X1Test",
  id: EthereumNetwork.X1Testnet,
};

const ethereumMainnet: Network = {
  name: "Mainnet",
  id: EthereumNetwork.Mainnet,
};

const ethereumGoerli: Network = {
  name: "Goerli",
  id: EthereumNetwork.Goerli,
};

const ethereumSepolia: Network = {
  name: "Sepolia",
  id: EthereumNetwork.Sepolia,
};

export const ethereumNetworks: Network[] = [
  ethereumMainnet,
  ethereumGoerli,
  ethereumSepolia,
  ethereumOKXTestnet,
];

export const hexChainIDs: { [key in EthereumNetwork]: string } = {
  [EthereumNetwork.Mainnet]: "0x1",
  [EthereumNetwork.Goerli]: "0x5",
  [EthereumNetwork.Sepolia]: "0xAA36A7",
  [EthereumNetwork.X1Testnet]: "0x3C",
};

export const addNetworkParams = {
  [EthereumNetwork.X1Testnet]: [
    {
      chainId: "0xC3",
      rpcUrls: ["https://testrpc.x1.tech", "https://x1testrpc.okx.com/"],
      chainName: "X1 testnet",
      nativeCurrency: {
        name: "OKB",
        symbol: "OKB",
        decimals: 18,
      },
      blockExplorerUrls: ["https://www.oklink.com/x1-test"],
    },
  ],
  [EthereumNetwork.Sepolia]: [
    {
      chainId: "11155111",
      rpcUrls: [
        "https://ethereum-sepolia.publicnode.com/",
        "https://sepolia.infura.io/v3/",
      ],
      chainName: "Sepolia Testnet",
      nativeCurrency: {
        name: "SepoliaETH",
        symbol: "SepoliaETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://sepolia.etherscan.io/"],
    },
  ],
  [EthereumNetwork.Goerli]: [
    {
      chainId: "5",
      rpcUrls: [
        "https://ethereum-goerli.publicnode.com",
        "https://goerli.infura.io/v3/",
      ],
      chainName: "Goerli Testnet",
      nativeCurrency: {
        name: "GoerliETH",
        symbol: "GoerliETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://goerli.etherscan.io/"],
    },
  ],
  [EthereumNetwork.Mainnet]: [
    {
      chainId: "1",
      rpcUrls: ["https://mainnet.infura.io/v3/"],
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherscan.io/"],
    },
  ],
};
