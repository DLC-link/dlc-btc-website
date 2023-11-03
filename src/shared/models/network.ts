export interface Network {
  name: string;
  id: AllNetwork;
}

export enum EthereumNetwork {
  EthereumMainnet = 'ethereum.01',
  EthereumGoerli = 'ethereum.05',
  EthereumSepolia = 'ethereum.06',
}

export enum StacksNetwork {
  StacksMainnet = 'stacks.01',
  StacksTestnet = 'stacks.02',
}

export type AllNetwork = EthereumNetwork | StacksNetwork;

export const EthereumMainnet: Network = {
  name: 'Ethereum Mainnet',
  id: EthereumNetwork.EthereumMainnet
};

export const EthereumGoerli: Network = {
  name: 'Ethereum Goerli',
  id: EthereumNetwork.EthereumGoerli
};

export const EthereumSepolia: Network = {
  name: 'Ethereum Sepolia',
  id: EthereumNetwork.EthereumSepolia
};

export const StacksMainnet: Network = {
  name: 'Stacks Mainnet',
  id: StacksNetwork.StacksMainnet,
};

export const StacksTestnet: Network = {
  name: 'Stacks Testnet',
  id: StacksNetwork.StacksTestnet,
};


export const ethereumNetworks: Network[] = [EthereumMainnet, EthereumGoerli, EthereumSepolia];
export const stacksNetworks: Network[] = [StacksMainnet, StacksTestnet];
export const networks: Network[] = [...ethereumNetworks, ...stacksNetworks];
