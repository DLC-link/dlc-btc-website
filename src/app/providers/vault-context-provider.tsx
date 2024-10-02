import { createContext } from 'react';

import { useNFTs } from '@hooks/use-nfts';
import { HasChildren } from '@models/has-children';
import { Vault } from '@models/vault';

interface VaultContextType {
  allVaults: Vault[];
  readyVaults: Vault[];
  pendingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
}

export const VaultContext = createContext<VaultContextType>({
  allVaults: [],
  readyVaults: [],
  pendingVaults: [],
  fundedVaults: [],
  closingVaults: [],
  closedVaults: [],
});

export function VaultContextProvider({ children }: HasChildren): React.JSX.Element {
  const { allVaults, readyVaults, fundedVaults, pendingVaults, closingVaults, closedVaults } =
    useNFTs();

  return (
    <VaultContext.Provider
      value={{
        allVaults,
        readyVaults,
        pendingVaults,
        fundedVaults,
        closingVaults,
        closedVaults,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}
