export interface Network {
  id: EthereumNetwork;
  name: string;
}

enum EthereumNetwork {
  Mainnet = "ethereum.01",
  Goerli = "ethereum.05",
  Sepolia = "ethereum.06",
}

const EthereumMainnet: Network = {
  name: "Mainnet",
  id: EthereumNetwork.Mainnet,
};

const EthereumGoerli: Network = {
  name: "Goerli",
  id: EthereumNetwork.Goerli,
};

const EthereumSepolia: Network = {
  name: "Sepolia",
  id: EthereumNetwork.Sepolia,
};

export const ethereumNetworks: Network[] = [
  EthereumMainnet,
  EthereumGoerli,
  EthereumSepolia,
];
