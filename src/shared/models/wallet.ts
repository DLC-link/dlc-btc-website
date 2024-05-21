export enum BitcoinWalletType {
  Leather = 'Leather',
  Ledger = 'Ledger',
}

export interface BitcoinWallet {
  id: BitcoinWalletType;
  name: string;
  logo: string;
}

const leather: BitcoinWallet = {
  id: BitcoinWalletType.Leather,
  name: 'Leather',
  logo: '/images/logos/leather-logo.svg',
};

const ledger: BitcoinWallet = {
  id: BitcoinWalletType.Ledger,
  name: 'Ledger',
  logo: '/images/logos/ledger-square-logo.svg',
};

export const bitcoinWallets: BitcoinWallet[] = [leather, ledger];

export enum WalletType {
  Metamask = 'MetaMask',
  Coinbase = 'CoinbaseWallet',
  Trust = 'TrustWallet',
}

export interface Wallet {
  id: WalletType;
  name: string;
  logo: string;
}

const metamask: Wallet = {
  id: WalletType.Metamask,
  name: 'Metamask',
  logo: '/images/logos/metamask-logo.svg',
};

export const ethereumWallets: Wallet[] = [metamask];
