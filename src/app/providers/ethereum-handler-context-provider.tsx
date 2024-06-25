import React, { createContext } from 'react';

import { useEthereumHandler } from '@hooks/use-ethereum-handler';
import { HasChildren } from '@models/has-children';
import { WalletType } from '@models/wallet';
import { EthereumHandler, ReadOnlyEthereumHandler } from 'dlc-btc-lib';
import { EthereumNetwork, SupportedNetwork } from 'dlc-btc-lib/models';
import { Contract } from 'ethers';

interface EthereumHandlerContextProviderType {
  ethereumHandler: EthereumHandler | undefined;
  readOnlyEthereumHandler: ReadOnlyEthereumHandler | undefined;
  userPointsContractReader: Contract | undefined;
  isEthereumHandlerSet: boolean;
  isReadOnlyEthereumHandlerSet: boolean;
  getEthereumHandler: (
    ethereumWalletType: WalletType,
    ethereumNetworkName: SupportedNetwork,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  recommendTokenToMetamask: () => Promise<void>;
}

export const EthereumHandlerContext = createContext<EthereumHandlerContextProviderType>({
  ethereumHandler: undefined,
  readOnlyEthereumHandler: undefined,
  userPointsContractReader: undefined,
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
    userPointsContractReader,
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
        userPointsContractReader,
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
