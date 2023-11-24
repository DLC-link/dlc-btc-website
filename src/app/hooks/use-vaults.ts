import { useMemo } from "react";
import { useSelector } from "react-redux";

import { Vault, VaultState } from "@models/vault";
import { RootState } from "@store/index";

export function useVaults(): {
  readyVaults: Vault[];
  fundingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
} {
  const { vaults } = useSelector((state: RootState) => state.vault);

  const readyVaults = useMemo(
    () =>
      vaults
        .filter((vault) => vault.state === VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults],
  );
  const fundedVaults = useMemo(
    () =>
      vaults
        .filter((vault) => vault.state === VaultState.FUNDED)
        .sort((a, b) => a.timestamp - b.timestamp),
    [vaults],
  );
  const fundingVaults = useMemo(
    () =>
      vaults
        .filter((vault) => vault.state === VaultState.FUNDING)
        .sort((a, b) => a.timestamp - b.timestamp),
    [vaults],
  );
  const closingVaults = useMemo(
    () =>
      vaults
        .filter((vault) => vault.state === VaultState.CLOSING)
        .sort((a, b) => a.timestamp - b.timestamp),
    [vaults],
  );
  const closedVaults = useMemo(
    () =>
      vaults
        .filter((vault) => vault.state === VaultState.CLOSED)
        .sort((a, b) => a.timestamp - b.timestamp),
    [vaults],
  );

  return {
    readyVaults,
    fundingVaults,
    closingVaults,
    fundedVaults,
    closedVaults,
  };
}
