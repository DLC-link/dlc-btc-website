import React, { createContext } from 'react';

import { useEthereumContracts } from '@hooks/use-ethereum-contracts';
import { EthereumNetwork } from '@models/ethereum-network';
import { HasChildren } from '@models/has-children';
import { ethers } from 'ethers';

export interface EthereumContextProviderType {
  protocolContract: any;
  dlcManagerContract: any;
  dlcBTCContract: any;
  getEthereumContracts: (
    ethereumSigner: ethers.providers.JsonRpcSigner,
    ethereumNetwork: EthereumNetwork
  ) => Promise<void>;
  contractsLoaded: boolean;
}

export const EthereumContext = createContext<any>({
  protocolContract: undefined,
  dlcManagerContract: undefined,
  dlcBTCContract: undefined,
  getEthereumContracts: async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ethereumSigner: ethers.providers.JsonRpcSigner,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ethereumNetwork: EthereumNetwork
  ) => {},
  contractsLoaded: false,
});

export function EthereumContextProvider({ children }: HasChildren): React.JSX.Element {
  const {
    protocolContract,
    dlcManagerContract,
    dlcBTCContract,
    getEthereumContracts,
    contractsLoaded,
  } = useEthereumContracts();

  return (
    <EthereumContext.Provider
      value={{
        protocolContract,
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
