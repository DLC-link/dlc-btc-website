import { RippleNetwork, RippleNetworkID } from '@models/ripple.models';

export const RippleMainnet: RippleNetwork = {
  id: RippleNetworkID.Mainnet,
  name: 'Mainnet',
  displayName: 'Mainnet',
};

export const RippleTestnet: RippleNetwork = {
  id: RippleNetworkID.Testnet,
  name: 'Testnet',
  displayName: 'Testnet',
};

export const supportedRippleNetworks: RippleNetwork[] = [RippleMainnet, RippleTestnet];
