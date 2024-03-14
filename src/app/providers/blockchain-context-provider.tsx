import React, { createContext, useState } from 'react';

import { UseBitcoinReturnType, useBitcoin } from '@hooks/use-bitcoin';
import { UseEthereumReturnType, useEthereum } from '@hooks/use-ethereum';
import { useEthereumAccount } from '@hooks/use-ethereum copy';
import { useObserver } from '@hooks/use-observer';
import { HasChildren } from '@models/has-children';
import { ethers } from 'ethers';

export interface BlockchainContextType {
  ethereum: UseEthereumReturnType;
  bitcoin: UseBitcoinReturnType;
}

interface EthereumContractConfig {
  protocolContract: ethers.Contract | undefined;
  dlcManagerContract: ethers.Contract | undefined;
  dlcBTCContract: ethers.Contract | undefined;
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null);

export function BlockchainContextProvider({ children }: HasChildren): React.JSX.Element {
  const [ethereumSigner, setEthereumSigner] = useState<any>(null);
  const [ethereumContractConfig, setEthereumContractConfig] = useState<
    EthereumContractConfig | undefined
  >(undefined);

  function setContract(contractName: string, contract: ethers.Contract): void {
    switch (contractName) {
      case 'protocolContract':
        setEthereumContractConfig({ ...ethereumContractConfig, protocolContract: contract });
        break;
      case 'dlcManagerContract':
        setEthereumContractConfig({ ...ethereumContractConfig, dlcManagerContract: contract });
        break;
      case 'dlcBTCContract':
        setEthereumContractConfig({ ...ethereumContractConfig, dlcBTCContract: contract });
        break;
      default:
        throw new Error('Invalid contract');
    }
  }

  const ethereum = useEthereum();
  const bitcoin = useBitcoin();

  useObserver(ethereum);

  return (
    <BlockchainContext.Provider value={{ ethereum, bitcoin }}>
      {children}
    </BlockchainContext.Provider>
  );
}
