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
