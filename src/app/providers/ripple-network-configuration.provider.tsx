import React, { createContext, useEffect, useState } from 'react';

import { RippleWallet } from '@components/modals/select-wallet-modal/select-wallet-modal';
import { getRippleNetworkByID } from '@functions/configuration.functions';
import { useXRPLLedger } from '@hooks/use-xrpl-ledger';
import Xrp from '@ledgerhq/hw-app-xrp';
import { HasChildren } from '@models/has-children';
import { RippleNetwork, RippleNetworkConfiguration, RippleNetworkID } from '@models/ripple.models';
import { Client, Wallet } from 'dlc-btc-lib/models';
import { getRippleClient, getRippleWallet } from 'dlc-btc-lib/ripple-functions';
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
  connectLedgerWallet: (derivationPath: string) => Promise<void>;
  signTransaction: (transaction: any) => Promise<any>;
  rippleWallet: RippleWallet | undefined;
  rippleClient: Client;
  setRippleWallet: (rippleWallet: RippleWallet) => void;
  isRippleNetworkConfigurationLoading: boolean;
}
export const RippleNetworkConfigurationContext = createContext<RippleNetworkConfigurationContext>({
  setRippleNetworkID: (rippleNetworkID: RippleNetworkID) => {},
  rippleNetworkConfiguration: defaultRippleNetworkConfiguration,
  enabledRippleNetworks,
  rippleUserAddress: undefined,
  connectLedgerWallet: async (_derivationPath: string) => {},
  signTransaction: async (_transaction: any) => {},
  rippleClient: new Client(appConfiguration.xrplWebsocket),
  rippleWallet: undefined,
  setRippleWallet: (_rippleWallet: RippleWallet) => {},
  isRippleWalletConnected: false,
  isRippleNetworkConfigurationLoading: false,
});

export function RippleNetworkConfigurationContextProvider({
  children,
}: HasChildren): React.JSX.Element {
  const { xrplAddress, connectLedgerWallet, signTransaction, isConnected } = useXRPLLedger();
  const [rippleNetworkID, setRippleNetworkID] = useState<RippleNetworkID>(defaultRippleNetwork.id);
  const [rippleNetworkConfiguration, setRippleNetworkConfiguration] =
    useState<RippleNetworkConfiguration>(defaultRippleNetworkConfiguration);

  const rippleClient = getRippleClient(rippleNetworkConfiguration.websocketURL);

  const [rippleWallet, setRippleWallet] = useState<RippleWallet | undefined>(undefined);

  const [isRippleNetworkConfigurationLoading, setIsRippleNetworkConfigurationLoading] =
    useState(false);

  useEffect(() => {
    console.log('isConnected', isConnected);
  }, [isConnected]);

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
        rippleUserAddress: xrplAddress,
        signTransaction,
        rippleClient,
        rippleWallet,
        setRippleWallet,
        connectLedgerWallet,
        isRippleWalletConnected: isConnected,
        setRippleNetworkID,
      }}
    >
      {children}
    </RippleNetworkConfigurationContext.Provider>
  );
}
