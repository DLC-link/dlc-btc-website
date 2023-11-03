import { Network, ethereumNetworks, stacksNetworks } from './network';

export enum WalletType {
  Metamask,
}

export interface Wallet {
  id: string;
  name: string;
  logo: string;
  networks: Network[];
}

export const metamask: Wallet = {
  id: 'metamask',
  name: 'Metamask',
  logo: 'public/images/logos/metamask_logo.svg',
  networks: ethereumNetworks,
};

export const leather: Wallet = {
  id: 'stacks',
  name: 'Leather',
  logo: 'public/images/logos/leather_logo.svg',
  networks: stacksNetworks,
};

export const wallets: Wallet[] = [metamask, leather];
