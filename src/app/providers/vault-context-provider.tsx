import { createContext } from 'react';

import { useVaults } from '@hooks/use-vaults';
import { HasChildren } from '@models/has-children';
import { Vault } from '@models/vault';

interface VaultContextType {
  allVaults: Vault[];
  readyVaults: Vault[];
  pendingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
  isLoading: boolean;
}

export const VaultContext = createContext<VaultContextType>({
  allVaults: [],
  readyVaults: [],
  pendingVaults: [],
  fundedVaults: [],
  closingVaults: [],
  closedVaults: [],
  isLoading: true,
});

export function VaultContextProvider({ children }: HasChildren): React.JSX.Element {
  const {
    allVaults,
    readyVaults,
    fundedVaults,
    pendingVaults,
    closingVaults,
    closedVaults,
    isLoading,
  } = useVaults();

  return (
    <VaultContext.Provider
      value={{
        allVaults,
        readyVaults,
        pendingVaults,
        fundedVaults,
        closingVaults,
        closedVaults,
        isLoading,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}
