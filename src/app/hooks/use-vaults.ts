import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { Vault, VaultState } from '@models/vault';
import { RootState } from '@store/index';

import { UseEthereumReturnType } from './use-ethereum';

export interface UseVaultsReturnType {
  allVaults: Vault[];
  readyVaults: Vault[];
  fundingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
  isLoading: boolean;
}

export function useVaults(ethereum?: UseEthereumReturnType): UseVaultsReturnType {
  const { vaults } = useSelector((state: RootState) => state.vault);
  const { address, network } = useSelector((state: RootState) => state.account);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address || !network || !ethereum) return;
    const { getAllVaults, isLoaded: isEthereumConfigLoaded } = ethereum;

    if (!isEthereumConfigLoaded) return;

    const fetchData = async () => {
      setIsLoading(true);
      await getAllVaults();
      setIsLoading(false);
    };
    fetchData();
  }, [address, network, ethereum?.isLoaded]);

  console.log('vaults', vaults);
  console.log('network', network);

  const allVaults = useMemo(
    () =>
      vaults[network ? network.id : '1']
        .filter(vault => vault.state !== VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );

  const readyVaults = useMemo(
    () =>
      vaults[network ? network.id : '1']
        .filter(vault => vault.state === VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const fundedVaults = useMemo(
    () =>
      vaults[network ? network.id : '1']
        .filter(vault => vault.state === VaultState.FUNDED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const fundingVaults = useMemo(
    () =>
      vaults[network ? network.id : '1']
        .filter(vault => vault.state === VaultState.FUNDING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const closingVaults = useMemo(
    () =>
      vaults[network ? network.id : '1']
        .filter(vault => vault.state === VaultState.CLOSING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network]
  );
  const closedVaults = useMemo(
    () =>
      vaults[network ? network.id : '1']
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
