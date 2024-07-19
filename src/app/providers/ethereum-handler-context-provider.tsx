import React, { createContext } from 'react';

import { useEthereumHandler } from '@hooks/use-ethereum-handler';
import { HasChildren } from '@models/has-children';
import { WalletType } from '@models/wallet';
import { EthereumHandler } from 'dlc-btc-lib';
import { EthereumNetwork } from 'dlc-btc-lib/models';

interface EthereumHandlerContextProviderType {
  ethereumHandler: EthereumHandler | undefined;
  isEthereumHandlerSet: boolean;
  getEthereumHandler: (
    ethereumWalletType: WalletType,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  recommendTokenToMetamask: () => Promise<void>;
}

export const EthereumHandlerContext = createContext<EthereumHandlerContextProviderType>({
  ethereumHandler: undefined,
  isEthereumHandlerSet: false,
  getEthereumHandler: async () => {
    throw new Error('getEthereumHandler not implemented');
  },
  recommendTokenToMetamask: async () => {
    throw new Error('recommendTokenToMetamask not implemented');
  },
});

export function EthereumHandlerContextProvider({ children }: HasChildren): React.JSX.Element {
  const { ethereumHandler, isEthereumHandlerSet, getEthereumHandler, recommendTokenToMetamask } =
    useEthereumHandler();

  return (
    <EthereumHandlerContext.Provider
      value={{
        ethereumHandler,
        isEthereumHandlerSet,
        getEthereumHandler,
        recommendTokenToMetamask,
      }}
    >
      {children}
    </EthereumHandlerContext.Provider>
  );
}
