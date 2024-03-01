import { createContext } from 'react';

import { UseVaultsReturnType, useVaults } from '@hooks/use-vaults';
import { HasChildren } from '@models/has-children';

import { useBlockchainContext } from '@hooks/use-blockchain-context';

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
  const blockchainContext = useBlockchainContext();
  const { ethereum } = blockchainContext;

  const vaults = useVaults(ethereum);

  return <VaultContext.Provider value={{ vaults }}>{children}</VaultContext.Provider>;
}
