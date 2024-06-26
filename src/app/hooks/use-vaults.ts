import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Vault, VaultState } from '@models/vault';
import { RootState } from '@store/index';

import { useEthereum } from './use-ethereum';
import { useEthereumContext } from './use-ethereum-context';

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
  const { contractsLoaded } = useEthereumContext();
  const { getAllVaults } = useEthereum();

  const { vaults } = useSelector((state: RootState) => state.vault);
  const { network } = useSelector((state: RootState) => state.account);

  const [isLoading, setIsLoading] = useState(true);

  const fetchVaultsIfReady = async () => {
    if (contractsLoaded) {
      setIsLoading(true);
      await getAllVaults();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchVaultsIfReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractsLoaded]);

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
