import React, { createContext } from 'react';

import { useEthereumContracts } from '@hooks/use-ethereum-contracts';
import { EthereumNetwork } from '@models/ethereum-network';
import { HasChildren } from '@models/has-children';
import { ethers } from 'ethers';

export interface EthereumContextProviderType {
  dlcManagerContract: any;
  observerDLCManagerContract: any;
  dlcBTCContract: any;
  getEthereumContracts: (
    ethereumSigner: ethers.providers.JsonRpcSigner,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  contractsLoaded: boolean;
}

export const EthereumContext = createContext<any>({
  dlcManagerContract: undefined,
  observerDLCManagerContract: undefined,
  dlcBTCContract: undefined,
  getEthereumContracts: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ethereumSigner: ethers.providers.JsonRpcSigner,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _ethereumNetwork: EthereumNetwork
  ) => {},
  contractsLoaded: false,
});

export function EthereumContextProvider({ children }: HasChildren): React.JSX.Element {
  const {
    observerDLCManagerContract,
    dlcManagerContract,
    dlcBTCContract,
    getEthereumContracts,
    contractsLoaded,
  } = useEthereumContracts();

  return (
    <EthereumContext.Provider
      value={{
        observerDLCManagerContract,
        dlcManagerContract,
        dlcBTCContract,
        getEthereumContracts,
        contractsLoaded,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
