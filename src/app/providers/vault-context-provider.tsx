import { createContext, useContext } from 'react';

import { UseVaultsReturnType, useVaults } from '@hooks/use-vaults';
import { HasChildren } from '@models/has-children';

import { BlockchainContext } from './blockchain-context-provider';

interface VaultContextType {
  vaults: UseVaultsReturnType;
}

export const VaultContext = createContext<VaultContextType>({
  vaults: {
    allVaults: [],
    readyVaults: [],
    fundingVaults: [],
    fundedVaults: [],
    closingVaults: [],
    closedVaults: [],
    isLoading: true,
  },
});

export function VaultContextProvider({ children }: HasChildren): React.JSX.Element {
  const blockchainContext = useContext(BlockchainContext);
  const vaults = useVaults(blockchainContext?.ethereum);

  return <VaultContext.Provider value={{ vaults }}>{children}</VaultContext.Provider>;
}
