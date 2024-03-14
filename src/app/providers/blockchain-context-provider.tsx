import React, { createContext, useEffect, useState } from 'react';

import { useEthereum } from '@hooks/use-ethereum';
import { useEthereumContracts } from '@hooks/use-ethereum-contracts';
import { useObserver } from '@hooks/use-observer';
import { HasChildren } from '@models/has-children';
import { Contract, ethers } from 'ethers';

export interface EthereumContextProviderType {
  ethereumContractConfig: EthereumContractConfig;
  setEthereumSigner: (signer: ethers.providers.JsonRpcSigner) => void;
}

export interface EthereumContractConfig {
  protocolContract: Contract | undefined;
  dlcManagerContract: Contract | undefined;
  dlcBTCContract: Contract | undefined;
}

export const EthereumContext = createContext<any>({});

export function EthereumContextProvider({ children }: HasChildren): React.JSX.Element {
  const ethereumSigner = React.useRef<any>();

  function setEthereumSignerHandler(signer: ethers.providers.JsonRpcSigner): void {
    if (signer === undefined) return;
    console.log('Setting Ethereum Signer:', signer);

    ethereumSigner.current = signer;
  }

  const { protocolContract, dlcManagerContract, dlcBTCContract } = useEthereumContracts(
    ethereumSigner.current
  );

  useEffect(() => {
    console.log('Ethereum Signer:', ethereumSigner);
    console.log('Protocol Contract:', protocolContract);
    console.log('DLC Manager Contract:', dlcManagerContract);
    console.log('DLC BTC Contract:', dlcBTCContract);
  }, [ethereumSigner, protocolContract, dlcManagerContract, dlcBTCContract]);

  const ethereumHandler = useEthereum();

  useObserver({ protocolContract, dlcManagerContract, dlcBTCContract }, ethereumHandler);

  return (
    <EthereumContext.Provider
      value={{
        ethereumContractConfig: { protocolContract, dlcManagerContract, dlcBTCContract },
        setEthereumSigner: setEthereumSignerHandler,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
}
