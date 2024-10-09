import { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

  const { isConnected, address: ethereumUserAddress } = useAccount();

  const { vaults } = useSelector((state: RootState) => state.vault);

  const [isLoading, setIsLoading] = useState(true);

  const { ethereumNetworkConfiguration, isEthereumNetworkConfigurationLoading } = useContext(
    EthereumNetworkConfigurationContext
  );

  const fetchVaultsIfReady = async (ethereumAddress: string) => {
    setIsLoading(true);

    await getAllAddressVaults(ethereumNetworkConfiguration.dlcManagerContract, ethereumAddress)
      .then(vaults => {
        const formattedVaults = vaults.map(vault => {
          return formatVault(vault);
        });

        dispatch(
          vaultActions.setVaults({
            newVaults: formattedVaults,
            networkID: ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID,
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
    if (isConnected && ethereumUserAddress && !isEthereumNetworkConfigurationLoading) {
      console.log('fetching vaults');
      void fetchVaultsIfReady(ethereumUserAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isConnected,
    ethereumUserAddress,
    isEthereumNetworkConfigurationLoading,
    ethereumNetworkConfiguration,
  ]);

  const allVaults = useMemo(() => {
    const networkVaults =
      vaults[ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID] || [];
    return [...networkVaults].sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults, ethereumNetworkConfiguration]);

  const readyVaults = useMemo(() => {
    const networkVaults =
      vaults[ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID] || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.READY)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults, ethereumNetworkConfiguration]);

  const fundedVaults = useMemo(() => {
    const networkVaults =
      vaults[ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID] || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.FUNDED)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults, ethereumNetworkConfiguration]);

  const pendingVaults = useMemo(() => {
    const networkVaults =
      vaults[ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID] || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.PENDING)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults, ethereumNetworkConfiguration]);

  const closingVaults = useMemo(() => {
    const networkVaults =
      vaults[ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID] || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.CLOSING)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults, ethereumNetworkConfiguration]);

  const closedVaults = useMemo(() => {
    const networkVaults =
      vaults[ethereumNetworkConfiguration.chain.id.toString() as EthereumNetworkID] || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.CLOSED)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults, ethereumNetworkConfiguration]);

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
