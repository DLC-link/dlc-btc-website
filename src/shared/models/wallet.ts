export enum BitcoinWalletType {
  Leather = 'Leather',
  Ledger = 'Ledger',
  Unisat = 'Unisat',
  Fordefi = 'Fordefi',
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

const unisat: BitcoinWallet = {
  id: BitcoinWalletType.Unisat,
  name: 'Unisat',
  logo: '/images/logos/unisat-logo.svg',
};

const fordefi: BitcoinWallet = {
  id: BitcoinWalletType.Fordefi,
  name: 'Fordefi',
  logo: '/images/logos/fordefi-logo.svg',
};

export const bitcoinWallets: BitcoinWallet[] = [leather, ledger, unisat, fordefi];
