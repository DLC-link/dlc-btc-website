import React, { createContext } from 'react';
import { useDispatch } from 'react-redux';

import { UseBitcoinReturn } from '@hooks/use-bitcoin';
import { useBitcoin } from '@hooks/use-bitcoin';
import { UseEthereumReturn, useEthereum } from '@hooks/use-ethereum';
import { useObserver } from '@hooks/use-observer';
import { HasChildren } from '@models/has-children';

interface BlockchainContextType {
  ethereum: UseEthereumReturn;
  bitcoin: UseBitcoinReturn;
}

export const BlockchainContext = createContext<BlockchainContextType | null>(null);

export function BlockchainContextProvider({ children }: HasChildren): React.JSX.Element {
  const dispatch = useDispatch();
  const ethereum = useEthereum();
  const bitcoin = useBitcoin(ethereum, dispatch);
  
  useObserver(ethereum, dispatch);

  return (
    <BlockchainContext.Provider value={{ ethereum, bitcoin }}>
      {children}
    </BlockchainContext.Provider>
  );
}
