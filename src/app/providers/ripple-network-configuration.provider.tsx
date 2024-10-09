import React, { createContext, useEffect, useState } from 'react';

import { RippleWallet } from '@components/modals/select-wallet-modal/select-wallet-modal';
import { getRippleNetworkByID } from '@functions/configuration.functions';
import { HasChildren } from '@models/has-children';
import { RippleNetwork, RippleNetworkConfiguration, RippleNetworkID } from '@models/ripple.models';
import { equals, find } from 'ramda';

import { supportedRippleNetworks } from '@shared/constants/ripple.constants';

const defaultRippleNetwork = (() => {
  const defaultNetwork = find(
    (chain: RippleNetwork) => equals(chain.id, appConfiguration.enabledRippleNetworkIDs.at(0)),
    supportedRippleNetworks
  );
  if (!defaultNetwork) {
    throw new Error('Default Ripple Network not found');
  }
  return defaultNetwork;
})();

const enabledRippleNetworks = appConfiguration.enabledRippleNetworkIDs.map(id =>
  getRippleNetworkByID(id)
);

function getRippleNetworkConfiguration(
  rippleNetworkID: RippleNetworkID
): RippleNetworkConfiguration {
  switch (rippleNetworkID) {
    case RippleNetworkID.Mainnet:
      return {
        rippleExplorerAPIURL: 'https://livenet.xrpl.org/',
        websocketURL: 'wss://s1.ripple.com/',
        ripplemAttestorChainID: 'xrpl-ripple-mainnet',
      };
    case RippleNetworkID.Testnet:
      return {
        rippleExplorerAPIURL: 'https://testnet.xrpl.org/',
        websocketURL: 'wss://s.altnet.rippletest.net:51233',
        ripplemAttestorChainID: 'xrpl-ripple-testnet',
      };

    default:
      throw new Error(`Unsupported Ethereum network ID: ${rippleNetworkID}`);
  }
}

const defaultRippleNetworkConfiguration = getRippleNetworkConfiguration(
  defaultRippleNetwork.id.toString() as RippleNetworkID
);

interface RippleNetworkConfigurationContext {
  rippleNetworkConfiguration: RippleNetworkConfiguration;
  setRippleNetworkID: (rippleNetworkID: RippleNetworkID) => void;
  enabledRippleNetworks: RippleNetwork[];
  rippleUserAddress: string | undefined;
  isRippleWalletConnected: boolean;
  rippleWallet: RippleWallet | undefined;
  setRippleWallet: (rippleWallet: RippleWallet) => void;
  setIsRippleWalletConnected: (isConnected: boolean) => void;
  isRippleNetworkConfigurationLoading: boolean;
}
export const RippleNetworkConfigurationContext = createContext<RippleNetworkConfigurationContext>({
  setRippleNetworkID: () => {},
  rippleNetworkConfiguration: defaultRippleNetworkConfiguration,
  enabledRippleNetworks,
  rippleUserAddress: undefined,
  rippleWallet: undefined,
  isRippleWalletConnected: false,
  setRippleWallet: () => {},
  setIsRippleWalletConnected: () => {},
  isRippleNetworkConfigurationLoading: false,
});

export function RippleNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const [rippleNetworkID, setRippleNetworkID] = useState<RippleNetworkID>(defaultRippleNetwork.id);
  const [rippleNetworkConfiguration, setRippleNetworkConfiguration] =
    useState<RippleNetworkConfiguration>(defaultRippleNetworkConfiguration);

  const [rippleUserAddress, setRippleUserAddress] = useState<string | undefined>(
    'rfvtbrXSxLsxVWDktR4sdzjJgv8EnMKFKG'
  );

  const [rippleWallet, setRippleWallet] = useState<RippleWallet | undefined>(undefined);

  const [isRippleNetworkConfigurationLoading, setIsRippleNetworkConfigurationLoading] =
    useState(false);

  const [isRippleWalletConnected, setIsRippleWalletConnected] = useState(false);
  useEffect(() => {
    setIsRippleNetworkConfigurationLoading(true);

    const currentRippleNetworkConfiguration = getRippleNetworkConfiguration(
      rippleNetworkID.toString() as RippleNetworkID
    );

    setRippleNetworkConfiguration(currentRippleNetworkConfiguration);
    setIsRippleNetworkConfigurationLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rippleNetworkID]);

  return (
    <RippleNetworkConfigurationContext.Provider
      value={{
        rippleNetworkConfiguration,
        isRippleNetworkConfigurationLoading,
        enabledRippleNetworks,
        rippleUserAddress,
        rippleWallet,
        setRippleWallet,
        isRippleWalletConnected,
        setIsRippleWalletConnected,
        setRippleNetworkID,
      }}
    >
      {children}
    </RippleNetworkConfigurationContext.Provider>
  );
}
