export interface Network {
  id: EthereumNetwork;
  name: string;
}

export enum EthereumNetwork {
  Mainnet = '1',
  Goerli = '5',
  Sepolia = '6',
  X1Testnet = '195',
}

const EthreumOKXTestnet: Network = {
  name: 'X1test',
  id: EthereumNetwork.X1Testnet,
};

// const EthereumMainnet: Network = {
//   name: "Mainnet",
//   id: EthereumNetwork.Mainnet,
// };

// const EthereumGoerli: Network = {
//   name: "Goerli",
//   id: EthereumNetwork.Goerli,
// };

// const EthereumSepolia: Network = {
//   name: "Sepolia",
//   id: EthereumNetwork.Sepolia,
// };

export const ethereumNetworks: Network[] = [
  // EthereumMainnet,
  // EthereumGoerli,
  // EthereumSepolia,
  EthreumOKXTestnet,
];
