import { createContext, useContext } from 'react';

import { useNFTs } from '@hooks/use-nfts';
import { useVaults } from '@hooks/use-vaults';
import { HasChildren } from '@models/has-children';
import { Vault } from '@models/vault';

import { NetworkConfigurationContext } from './network-configuration.provider';

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
  const rippleVaults = useNFTs();
  const ethereumVaults = useVaults();
  const { networkType } = useContext(NetworkConfigurationContext);

  const getVaults = (vaultType: keyof VaultContextType) =>
    networkType === 'evm' ? ethereumVaults[vaultType] : rippleVaults[vaultType];

  console.log('ethereumVaults', ethereumVaults);

  return (
    <VaultContext.Provider
      value={{
        allVaults: getVaults('allVaults'),
        readyVaults: getVaults('readyVaults'),
        pendingVaults: getVaults('pendingVaults'),
        fundedVaults: getVaults('fundedVaults'),
        closingVaults: getVaults('closingVaults'),
        closedVaults: getVaults('closedVaults'),
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}
