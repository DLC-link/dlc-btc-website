import { useContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { Vault, VaultState } from '@models/vault';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { RootState } from '@store/index';

export interface UseVaultsReturnType {
  allVaults: Vault[];
  readyVaults: Vault[];
  fundingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
  isLoading: boolean;
}

export function useVaults(): UseVaultsReturnType {
  const { ethereumHandler } = useContext(EthereumHandlerContext);

  const { vaults } = useSelector((state: RootState) => state.vault);
  const { network } = useSelector((state: RootState) => state.account);

  const { isLoading } = useQuery(['vaults'], ethereumHandler?.getAllVaults!, {
    enabled: !!ethereumHandler,
    refetchInterval: 60000,
  });

  const allVaults = useMemo(
    () => [...vaults[network ? network.id : '42161']].sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );

  const readyVaults = useMemo(
    () =>
      vaults[network.id]
        .filter(vault => vault.state === VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const fundedVaults = useMemo(
    () =>
      vaults[network.id]
        .filter(vault => vault.state === VaultState.FUNDED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const fundingVaults = useMemo(
    () =>
      vaults[network.id]
        .filter(vault => vault.state === VaultState.FUNDING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const closingVaults = useMemo(
    () =>
      vaults[network.id]
        .filter(vault => vault.state === VaultState.CLOSING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const closedVaults = useMemo(
    () =>
      vaults[network.id]
        .filter(vault => vault.state === VaultState.CLOSED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );

  return {
    allVaults,
    readyVaults,
    fundingVaults,
    closingVaults,
    fundedVaults,
    closedVaults,
    isLoading,
  };
}
