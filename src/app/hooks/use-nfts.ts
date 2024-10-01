import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
  const [dispatchTuple, setDispatchTuple] = useState<
    [string, 'deposit' | 'burn' | 'depositPending' | 'withdrawPending']
  >(['', 'deposit']);

  async function fetchXRPLVaults(): Promise<Vault[]> {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const xrplHandler = RippleHandler.fromWhatever();
    const xrplNFTs = await xrplHandler.getContractVaults();
    const previousVaults: Vault[] | undefined = queryClient.getQueryData(['xrpl-vaults']);

    const xrplVaults = xrplNFTs.map(vault => {
      return formatVault(vault);
    });

    // Update the xrplVaults state first
    queryClient.setQueryData(['xrpl-vaults'], xrplVaults);

    if (previousVaults && previousVaults.length > 0) {
      console.log('Previous vaults', previousVaults);
      const newVaults = xrplVaults.filter((vault: Vault) => {
        const previousVault = previousVaults.find(
          (previousVault: Vault) => previousVault.uuid === vault.uuid
        );
        return !previousVault || previousVault.state !== vault.state;
      });

      console.log('New vaults', newVaults);

      newVaults.forEach((vault: Vault) => {
        console.log('checking new vault');
        const previousVault = previousVaults.find(
          (previousVault: Vault) => previousVault.uuid === vault.uuid
        );
        console.log('previous vault', previousVault);
        if (!previousVault) {
          console.log('New vault', vault);
          // Dispatch action for new vault
          setDispatchTuple([vault.uuid, 'deposit']);
        } else if (previousVault.state !== vault.state) {
          if (vault.state === VaultState.PENDING) {
            if (previousVault.valueLocked !== vault.valueMinted) {
              setDispatchTuple([vault.uuid, 'withdrawPending']);
            } else {
              setDispatchTuple([vault.uuid, 'depositPending']);
            }
          } else if (
            previousVault.state === VaultState.PENDING &&
            vault.state === VaultState.FUNDED
          ) {
            console.log('SUCCESSFUL FUNDING');
          } else {
            console.log('Vault state change', vault);
            setDispatchTuple([vault.uuid, 'deposit']);
          }
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
      switch (dispatchTuple[1]) {
        case 'deposit':
          dispatch(mintUnmintActions.setMintStep([1, dispatchTuple[0]]));
          break;
        case 'burn':
          dispatch(mintUnmintActions.setUnmintStep([1, dispatchTuple[0]]));
          break;
        case 'pending':
          if (!updatedVault) return;
          if (updatedVault.valueLocked !== updatedVault.valueMinted) {
            dispatch(mintUnmintActions.setUnmintStep([2, dispatchTuple[0]]));
          } else {
            dispatch(mintUnmintActions.setMintStep([2, dispatchTuple[0]]));
          }
          break;
      }
    }
  }
  const { data } = useQuery({
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
