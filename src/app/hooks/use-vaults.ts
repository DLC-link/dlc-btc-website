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
  const { network } = useSelector((state: RootState) => state.account);

  const readyVaults = useMemo(
    () =>
      vaults[network ? network.id : "1"]
        .filter((vault) => vault.state === VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network],
  );
  const fundedVaults = useMemo(
    () =>
      vaults[network ? network.id : "1"]
        .filter((vault) => vault.state === VaultState.FUNDED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network],
  );
  const fundingVaults = useMemo(
    () =>
      vaults[network ? network.id : "1"]
        .filter((vault) => vault.state === VaultState.FUNDING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network],
  );
  const closingVaults = useMemo(
    () =>
      vaults[network ? network.id : "1"]
        .filter((vault) => vault.state === VaultState.CLOSING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network],
  );
  const closedVaults = useMemo(
    () =>
      vaults[network ? network.id : "1"]
        .filter((vault) => vault.state === VaultState.CLOSED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, network],
  );

  return {
    readyVaults,
    fundingVaults,
    closingVaults,
    fundedVaults,
    closedVaults,
  };
}
