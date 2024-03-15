import { useContext } from 'react';

import { EthereumContext, EthereumContextProviderType } from '@providers/ethereum-context-provider';

export function useEthereumContext(): EthereumContextProviderType {
  return useContext(EthereumContext);
}
