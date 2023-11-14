import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Vault, VaultStatus } from '@models/vault';
import { RootState } from '@store/index';

export function useVaults(): {
  readyVaults: Vault[];
  fundingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
} {
  const { vaults } = useSelector((state: RootState) => state.vault);

  const readyVaults = useMemo(
    () => vaults.filter(vault => vault.state === VaultStatus.READY),
    [vaults]
  );
  const fundedVaults = useMemo(
    () => vaults.filter(vault => vault.state === VaultStatus.FUNDED),
    [vaults]
  );
  const fundingVaults = useMemo(
    () => vaults.filter(vault => vault.state === VaultStatus.FUNDING),
    [vaults]
  );
  const closingVaults = useMemo(
    () => vaults.filter(vault => vault.state === VaultStatus.CLOSING),
    [vaults]
  );
  const closedVaults = useMemo(
    () => vaults.filter(vault => vault.state === VaultStatus.CLOSED),
    [vaults]
  );

  return { readyVaults, fundingVaults, closingVaults, fundedVaults, closedVaults };
}
