import React, { createContext } from 'react';

import { useEthereumHandler } from '@hooks/use-ethereum-handler';
import { HasChildren } from '@models/has-children';
import { WalletType } from '@models/wallet';
import { EthereumHandler, ReadOnlyEthereumHandler } from 'dlc-btc-lib';
import { SupportedNetwork } from 'dlc-btc-lib/models';

interface EthereumHandlerContextProviderType {
  ethereumHandler: EthereumHandler | undefined;
  readOnlyEthereumHandler: ReadOnlyEthereumHandler | undefined;
  isEthereumHandlerSet: boolean;
  isReadOnlyEthereumHandlerSet: boolean;
  getEthereumHandler: (
    ethereumWalletType: WalletType,
    ethereumNetwork: SupportedNetwork
  ) => Promise<void>;
  recommendTokenToMetamask: () => Promise<void>;
}

export const EthereumHandlerContext = createContext<EthereumHandlerContextProviderType>({
  ethereumHandler: undefined,
  readOnlyEthereumHandler: undefined,
  isEthereumHandlerSet: false,
  isReadOnlyEthereumHandlerSet: false,
  getEthereumHandler: async () => {
    throw new Error('getEthereumHandler not implemented');
  },
  recommendTokenToMetamask: async () => {
    throw new Error('recommendTokenToMetamask not implemented');
  },
});

export function EthereumHandlerContextProvider({ children }: HasChildren): React.JSX.Element {
  const {
    ethereumHandler,
    readOnlyEthereumHandler,
    isEthereumHandlerSet,
    isReadOnlyEthereumHandlerSet,
    getEthereumHandler,
    recommendTokenToMetamask,
  } = useEthereumHandler();

  return (
    <EthereumHandlerContext.Provider
      value={{
        ethereumHandler,
        readOnlyEthereumHandler,
        isEthereumHandlerSet,
        isReadOnlyEthereumHandlerSet,
        getEthereumHandler,
        recommendTokenToMetamask,
      }}
    >
      {children}
    </EthereumHandlerContext.Provider>
  );
}
