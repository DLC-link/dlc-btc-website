import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { RootState } from '@store/index';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { VaultState } from 'dlc-btc-lib/models';

interface UseVaultsReturnType {
  allVaults: Vault[];
  readyVaults: Vault[];
  pendingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
  isLoading: boolean;
}

export function useVaults(): UseVaultsReturnType {
  const dispatch = useDispatch();
  const { ethereumHandler, isEthereumHandlerSet } = useContext(EthereumHandlerContext);

  const { vaults } = useSelector((state: RootState) => state.vault);
  const { network } = useSelector((state: RootState) => state.account);

  const [isLoading, setIsLoading] = useState(true);

  const fetchVaultsIfReady = async () => {
    if (isEthereumHandlerSet) {
      setIsLoading(true);
      ethereumHandler
        ?.getAllUserVaults()
        .then(vaults => {
          const formattedVaults = vaults.map(vault => {
            return formatVault(vault);
          });

          dispatch(vaultActions.setVaults({ newVaults: formattedVaults, networkID: network.id }));
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error fetching vaults', error);
        });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchVaultsIfReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEthereumHandlerSet]);

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
  const pendingVaults = useMemo(
    () =>
      vaults[network.id]
        .filter(vault => vault.state === VaultState.PENDING)
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
    pendingVaults,
    closingVaults,
    fundedVaults,
    closedVaults,
    isLoading,
  };
}
