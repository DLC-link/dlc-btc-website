import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { isEnabledEthereumNetwork } from '@functions/configuration.functions';
import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { RootState } from '@store/index';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { getAllAddressVaults } from 'dlc-btc-lib/ethereum-functions';
import { EthereumNetworkID, VaultState } from 'dlc-btc-lib/models';
import { useAccount } from 'wagmi';

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

  const { isConnected, address, chainId, chain } = useAccount();

  const { vaults } = useSelector((state: RootState) => state.vault);

  const [isLoading, setIsLoading] = useState(true);

  const { getReadOnlyDLCManagerContract } = useContext(EthereumNetworkConfigurationContext);

  const fetchVaultsIfReady = async (ethereumAddress: string) => {
    setIsLoading(true);

    await getAllAddressVaults(getReadOnlyDLCManagerContract(), ethereumAddress)
      .then(vaults => {
        const formattedVaults = vaults.map(vault => {
          return formatVault(vault);
        });

        dispatch(
          vaultActions.setVaults({
            newVaults: formattedVaults,
            networkID: chainId as unknown as EthereumNetworkID,
          })
        );
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error fetching vaults', error);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    isConnected && chain && isEnabledEthereumNetwork(chain) && void fetchVaultsIfReady(address!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, chainId]);

  const allVaults = useMemo(
    () =>
      [
        ...vaults[
          chain && isEnabledEthereumNetwork(chain)
            ? (chain.id.toString() as EthereumNetworkID)
            : appConfiguration.enabledEthereumNetworkIDs[0]
        ],
      ].sort((a, b) => b.timestamp - a.timestamp),
    [vaults, chain]
  );

  const readyVaults = useMemo(
    () =>
      vaults[
        chain && isEnabledEthereumNetwork(chain)
          ? (chain.id.toString() as EthereumNetworkID)
          : appConfiguration.enabledEthereumNetworkIDs[0]
      ]
        .filter(vault => vault.state === VaultState.READY)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, chain]
  );
  const fundedVaults = useMemo(
    () =>
      vaults[
        chain && isEnabledEthereumNetwork(chain)
          ? (chain.id.toString() as EthereumNetworkID)
          : appConfiguration.enabledEthereumNetworkIDs[0]
      ]
        .filter(vault => vault.state === VaultState.FUNDED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, chain]
  );
  const pendingVaults = useMemo(
    () =>
      vaults[
        chain && isEnabledEthereumNetwork(chain)
          ? (chain.id.toString() as EthereumNetworkID)
          : appConfiguration.enabledEthereumNetworkIDs[0]
      ]
        .filter(vault => vault.state === VaultState.PENDING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, chain]
  );
  const closingVaults = useMemo(
    () =>
      vaults[
        chain && isEnabledEthereumNetwork(chain)
          ? (chain.id.toString() as EthereumNetworkID)
          : appConfiguration.enabledEthereumNetworkIDs[0]
      ]
        .filter(vault => vault.state === VaultState.CLOSING)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, chain]
  );
  const closedVaults = useMemo(
    () =>
      vaults[
        chain && isEnabledEthereumNetwork(chain)
          ? (chain.id.toString() as EthereumNetworkID)
          : appConfiguration.enabledEthereumNetworkIDs[0]
      ]
        .filter(vault => vault.state === VaultState.CLOSED)
        .sort((a, b) => b.timestamp - a.timestamp),
    [vaults, chain]
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
