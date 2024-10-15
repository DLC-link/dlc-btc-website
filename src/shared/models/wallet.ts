export enum BitcoinWalletType {
  Leather = 'Leather',
  Ledger = 'Ledger',
  Unisat = 'Unisat',
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

export enum XRPWalletType {
  Ledger = 'Ledger',
  Gem = 'Gem',
}

export interface XRPWallet {
  id: XRPWalletType;
  name: string;
  icon: string;
}

const ledgerXRP: XRPWallet = {
  id: XRPWalletType.Ledger,
  name: 'Ledger',
  icon: './images/logos/ledger-logo.svg',
};

// const gemXRP: XRPWallet = {
//   id: XRPWalletType.Gem,
//   name: 'Gem',
//   icon: '/images/logos/gem-logo.svg',
// };

export const xrpWallets: XRPWallet[] = [ledgerXRP];
export const bitcoinWallets: BitcoinWallet[] = [leather, ledger, unisat];
