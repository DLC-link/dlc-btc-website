import { useContext } from 'react';

import { BlockchainContext, BlockchainContextType } from '@providers/blockchain-context-provider';

export function useBlockchainContext(): BlockchainContextType {
  const blockchainContext = useContext(BlockchainContext);

  if (!blockchainContext) {
    throw new Error(
      'Blockchain Context not found. Make sure you are using the BlockchainContextProvider.'
    );
  }

  return blockchainContext;
}
