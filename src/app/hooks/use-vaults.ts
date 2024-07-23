import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { RootState } from '@store/index';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { getAllAddressVaults } from 'dlc-btc-lib/ethereum-functions';
import { EthereumNetwork, VaultState } from 'dlc-btc-lib/models';

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

  const { vaults } = useSelector((state: RootState) => state.vault);
  const { network: ethereumNetwork, address: ethereumUserAddress } = useSelector(
    (state: RootState) => state.account
  );

  const [isLoading, setIsLoading] = useState(true);

  const { getDLCManagerContract } = useContext(EthereumNetworkConfigurationContext);

  const fetchVaultsIfReady = async (ethereumAddress: string, ethereumNetwork: EthereumNetwork) => {
    setIsLoading(true);

    await getAllAddressVaults(await getDLCManagerContract(), ethereumAddress)
      .then(vaults => {
        const formattedVaults = vaults.map(vault => {
          return formatVault(vault);
        });

        dispatch(
          vaultActions.setVaults({ newVaults: formattedVaults, networkID: ethereumNetwork.id })
        );
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error fetching vaults', error);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    ethereumUserAddress && void fetchVaultsIfReady(ethereumUserAddress, ethereumNetwork);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumUserAddress]);

  const allVaults = useMemo(
    () =>
      [...vaults[ethereumNetwork ? ethereumNetwork.id : '42161']].sort(
        (a, b) => b.timestamp - a.timestamp
      ),
    [vaults, ethereumNetwork]
  );

  const readyVaults = useMemo(
    () =>
      vaults[ethereumNetwork.id]
        .filter(vault => vault.state === VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, ethereumNetwork]
  );
  const fundedVaults = useMemo(
    () =>
      vaults[ethereumNetwork.id]
        .filter(vault => vault.state === VaultState.FUNDED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, ethereumNetwork]
  );
  const pendingVaults = useMemo(
    () =>
      vaults[ethereumNetwork.id]
        .filter(vault => vault.state === VaultState.PENDING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, ethereumNetwork]
  );
  const closingVaults = useMemo(
    () =>
      vaults[ethereumNetwork.id]
        .filter(vault => vault.state === VaultState.CLOSING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, ethereumNetwork]
  );
  const closedVaults = useMemo(
    () =>
      vaults[ethereumNetwork.id]
        .filter(vault => vault.state === VaultState.CLOSED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, ethereumNetwork]
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
