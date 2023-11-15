export enum WalletType {
  Metamask,
}

export interface Wallet {
  id: WalletType;
  name: string;
  logo: string;
}

const metamask: Wallet = {
  id: WalletType.Metamask,
  name: "Metamask",
  logo: "/images/logos/metamask-logo.svg",
};

export const ethereumWallets: Wallet[] = [metamask];
