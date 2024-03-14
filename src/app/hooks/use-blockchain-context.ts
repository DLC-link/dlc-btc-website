import { useContext } from 'react';

import {
  EthereumContext,
  EthereumContextProviderType,
} from '@providers/blockchain-context-provider';

export function useBlockchainContext(): EthereumContextProviderType {
  const blockchainContext = useContext(EthereumContext);

  if (!blockchainContext) {
    throw new Error(
      'Blockchain Context not found. Make sure you are using the BlockchainContextProvider.'
    );
  }

  return blockchainContext;
}
