import { useContext, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { NetworkConfigurationContext } from '@providers/network-configuration.provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { RippleHandler } from 'dlc-btc-lib';
import { VaultState } from 'dlc-btc-lib/models';
import { isEmpty } from 'ramda';

interface useNFTsReturnType {
  allVaults: Vault[];
  readyVaults: Vault[];
  pendingVaults: Vault[];
  fundedVaults: Vault[];
  closingVaults: Vault[];
  closedVaults: Vault[];
  isLoading: boolean;
}

enum VaultAction {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  DEPOSIT_PENDING = 'depositPending',
  WITHDRAW_PENDING = 'withdrawPending',
  DEPOSIT_SUCCESS = 'depositSuccess',
  WITHDRAW_SUCCESS = 'withdrawSuccess',
}

export function useNFTs(): useNFTsReturnType {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const { networkType } = useContext(NetworkConfigurationContext);
  const xrplHandler = RippleHandler.fromSeed('sEdSKUhR1Hhwomo7CsUzAe2pv7nqUXT');

  const [dispatchTuple, setDispatchTuple] = useState<[string, VaultAction, number?]>([
    '',
    VaultAction.DEPOSIT,
  ]);

  async function fetchXRPLVaults(): Promise<Vault[]> {
    setIsLoading(true);
    let xrplRawVaults: any[] = [];

    const previousVaults: Vault[] | undefined = queryClient.getQueryData(['xrpl-vaults']);

    try {
      xrplRawVaults = await xrplHandler.getContractVaults();
    } catch (error) {
      console.error('Error fetching XRPL Vaults', error);
      return previousVaults ?? [];
    }

    const xrplVaults = xrplRawVaults.map(vault => {
      return formatVault(vault);
    });

    if (previousVaults) {
      const missingVaults = previousVaults.filter((previousVault: Vault) => {
        return !xrplVaults.some((vault: Vault) => vault.uuid === previousVault.uuid);
      });

      if (missingVaults.length > 0) {
        return previousVaults;
      }
    }

    queryClient.setQueryData(['xrpl-vaults'], xrplVaults);

    if (previousVaults && previousVaults.length > 0) {
      const newVaults = xrplVaults.filter((vault: Vault) => {
        return !previousVaults.some(
          (previousVault: Vault) =>
            previousVault.uuid === vault.uuid &&
            previousVault.state === vault.state &&
            previousVault.valueLocked === vault.valueLocked &&
            previousVault.valueMinted === vault.valueMinted
        );
      });

      newVaults.forEach((vault: Vault) => {
        const previousVault = previousVaults.find(
          (previousVault: Vault) => previousVault.uuid === vault.uuid
        );

        if (!previousVault) {
          if (vault.uuid !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
            setDispatchTuple([vault.uuid, VaultAction.DEPOSIT]);
          }
          return;
        }

        if (previousVault.state !== vault.state) {
          switch (vault.state) {
            case VaultState.FUNDED:
              if (previousVault.valueMinted < previousVault.valueLocked) {
                setDispatchTuple([
                  vault.uuid,
                  VaultAction.WITHDRAW_SUCCESS,
                  new Decimal(previousVault.valueLocked).minus(vault.valueLocked).toNumber(),
                ]);
              } else {
                setDispatchTuple([
                  vault.uuid,
                  VaultAction.DEPOSIT_SUCCESS,
                  new Decimal(vault.valueLocked).minus(previousVault.valueLocked).toNumber(),
                ]);
              }
              break;
            case VaultState.PENDING:
              if (vault.valueLocked !== vault.valueMinted) {
                setDispatchTuple([vault.uuid, VaultAction.WITHDRAW_PENDING]);
              } else {
                setDispatchTuple([vault.uuid, VaultAction.DEPOSIT_PENDING]);
              }
              break;
          }
          return;
        }

        if (previousVault.valueMinted !== vault.valueMinted) {
          setDispatchTuple([vault.uuid, VaultAction.WITHDRAW]);
          return;
        }
      });
    }

    setIsLoading(false);
    return xrplVaults;
  }

  const { data: vaults } = useQuery({
    queryKey: ['xrpl-vaults'],
    initialData: [],
    queryFn: fetchXRPLVaults,
    refetchInterval: 10000,
    enabled: networkType === 'xrpl',
  });

  function dispatchVaultAction() {
    if (!isEmpty(dispatchTuple[0])) {
      const updatedVault = vaults.find(vault => vault.uuid === dispatchTuple[0]);
      if (!updatedVault) {
        throw new Error('Vault not found');
      }
      switch (dispatchTuple[1]) {
        case 'deposit':
          dispatch(mintUnmintActions.setMintStep([1, dispatchTuple[0], updatedVault]));
          break;
        case 'depositSuccess':
          dispatch(
            modalActions.toggleSuccessfulFlowModalVisibility({
              vaultUUID: updatedVault.uuid,
              vault: updatedVault,
              flow: 'mint',
              assetAmount: dispatchTuple[2]!,
            })
          );
          dispatch(mintUnmintActions.setMintStep([0, '']));
          break;
        case 'withdrawSuccess':
          dispatch(
            modalActions.toggleSuccessfulFlowModalVisibility({
              vaultUUID: updatedVault.uuid,
              vault: updatedVault,
              flow: 'burn',
              assetAmount: dispatchTuple[2]!,
            })
          );
          dispatch(mintUnmintActions.setMintStep([0, '']));
          break;
        case 'depositPending':
          dispatch(mintUnmintActions.setMintStep([2, updatedVault.uuid, updatedVault]));
          break;
        case 'withdrawPending':
          dispatch(mintUnmintActions.setUnmintStep([2, updatedVault.uuid, updatedVault]));
          break;
        case 'withdraw':
          dispatch(mintUnmintActions.setUnmintStep([1, updatedVault.uuid, updatedVault]));
          break;
      }
    }
  }
  useQuery({
    queryKey: ['newVault', dispatchTuple],
    queryFn: dispatchVaultAction,
  });

  const allVaults = useMemo(() => {
    const networkVaults = vaults || [];
    return [...networkVaults].sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults]);

  const readyVaults = useMemo(() => {
    const networkVaults = vaults || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.READY)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults]);

  const fundedVaults = useMemo(() => {
    const networkVaults = vaults || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.FUNDED)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults]);

  const pendingVaults = useMemo(() => {
    const networkVaults = vaults || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.PENDING)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults]);

  const closingVaults = useMemo(() => {
    const networkVaults = vaults || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.CLOSING)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults]);

  const closedVaults = useMemo(() => {
    const networkVaults = vaults || [];
    return networkVaults
      .filter(vault => vault.state === VaultState.CLOSED)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [vaults]);

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
