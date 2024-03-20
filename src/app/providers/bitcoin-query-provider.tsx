import { createContext } from 'react';

import { useBlockchainHeightQuery } from '@hooks/use-blockchain-height-query';
import { HasChildren } from '@models/has-children';

export interface BlockchainHeightContextProviderType {
  blockHeight: number | undefined;
}

export const BlockchainHeightContext = createContext<BlockchainHeightContextProviderType>({
  blockHeight: undefined,
});

export function BlockchainHeightContextProvider({ children }: HasChildren): React.JSX.Element {
  const blockHeight = useBlockchainHeightQuery();

  return (
    <BlockchainHeightContext.Provider value={{ blockHeight }}>
      {children}
    </BlockchainHeightContext.Provider>
  );
}
