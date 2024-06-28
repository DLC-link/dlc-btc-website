import { createContext } from 'react';

import { UseVaultsReturnType, useVaults } from '@hooks/use-vaults';
import { HasChildren } from '@models/has-children';

interface VaultContextType {
  vaults: UseVaultsReturnType;
}

export const VaultContext = createContext<VaultContextType>({
  vaults: {
    allVaults: [],
    readyVaults: [],
    fundingVaults: [],
    pendingVaults: [],
    fundedVaults: [],
    closingVaults: [],
    closedVaults: [],
    isLoading: true,
  },
});

export function VaultContextProvider({ children }: HasChildren): React.JSX.Element {
  const vaults = useVaults();

  return <VaultContext.Provider value={{ vaults }}>{children}</VaultContext.Provider>;
}
