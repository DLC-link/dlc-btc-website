import { createContext } from 'react';

import { useEthereum } from '@hooks/use-ethereum';
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
    fundedVaults: [],
    closingVaults: [],
    closedVaults: [],
    isLoading: true,
  },
});

export function VaultContextProvider({ children }: HasChildren): React.JSX.Element {
  const ethereumHandler = useEthereum();
  const vaults = useVaults(ethereumHandler);

  return <VaultContext.Provider value={{ vaults }}>{children}</VaultContext.Provider>;
}
