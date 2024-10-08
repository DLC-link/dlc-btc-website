export interface RippleNetwork {
  id: RippleNetworkID;
  name: string;
  displayName: string;
}
export enum RippleNetworkID {
  Mainnet = '0',
  Testnet = '1',
}

export interface RippleNetworkConfiguration {
  rippleExplorerAPIURL: string;
  websocketURL: string;
  ripplemAttestorChainID: 'xrpl-ripple-mainnet' | 'xrpl-ripple-testnet';
}
