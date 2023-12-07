import React, { createContext } from 'react';

import { UseBitcoinReturnType, useBitcoin } from '@hooks/use-bitcoin';
import { UseEthereumReturnType, useEthereum } from '@hooks/use-ethereum';
import { useObserver } from '@hooks/use-observer';
import { HasChildren } from '@models/has-children';

interface BlockchainContextType {
  ethereum: UseEthereumReturnType;
  bitcoin: UseBitcoinReturnType;
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null);

export function BlockchainContextProvider({ children }: HasChildren): React.JSX.Element {
  const ethereum = useEthereum();
  const bitcoin = useBitcoin();

  useObserver(ethereum);

  return (
    <BlockchainContext.Provider value={{ ethereum, bitcoin }}>
      {children}
    </BlockchainContext.Provider>
  );
}
