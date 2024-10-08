import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
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
}

export function useNFTs(): useNFTsReturnType {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const xrplHandler = RippleHandler.fromSeed('sEdSKUhR1Hhwomo7CsUzAe2pv7nqUXT');

  const [dispatchTuple, setDispatchTuple] = useState<
    [
      string,
      (
        | 'deposit'
        | 'withdraw'
        | 'depositPending'
        | 'withdrawPending'
        | 'depositSuccess'
        | 'withdrawSuccess'
      ),
      number?,
    ]
  >(['', 'deposit']);

  async function fetchXRPLVaults(): Promise<Vault[]> {
    console.log('Fetching XRPL Vaults');
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

    // await delay(5000);

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
          if (vault.uuid === '0x0000000000000000000000000000000000000000000000000000000000000000')
            return;
          setDispatchTuple([vault.uuid, 'deposit']);
          return;
        }

        if (previousVault.state !== vault.state) {
          switch (vault.state) {
            case VaultState.FUNDED:
              if (previousVault.valueMinted < previousVault.valueLocked) {
                console.log('XRPL Vault Withdraw Success');
                setDispatchTuple([
                  vault.uuid,
                  'withdrawSuccess',
                  new Decimal(previousVault.valueLocked).minus(vault.valueLocked).toNumber(),
                ]);
              } else {
                console.log('XRPL Vault Deposit Success');
                setDispatchTuple([
                  vault.uuid,
                  'depositSuccess',
                  new Decimal(vault.valueLocked).minus(previousVault.valueLocked).toNumber(),
                ]);
              }
              break;
            case VaultState.PENDING:
              if (vault.valueLocked !== vault.valueMinted) {
                console.log('XRPL Vault Withdraw Pending');
                setDispatchTuple([vault.uuid, 'withdrawPending']);
              } else {
                console.log('XRPL Vault Deposit Pending');
                setDispatchTuple([vault.uuid, 'depositPending']);
              }
              break;
          }
          return;
        }

        if (previousVault.valueMinted !== vault.valueMinted) {
          console.log('XRPL Vault Withdraw');
          setDispatchTuple([vault.uuid, 'withdraw']);
          return;
        }
      });
    }

    return xrplVaults;
  }

  const { data: vaults } = useQuery({
    queryKey: ['xrpl-vaults'],
    initialData: [],
    queryFn: fetchXRPLVaults,
    refetchInterval: 10000,
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
  };
}
