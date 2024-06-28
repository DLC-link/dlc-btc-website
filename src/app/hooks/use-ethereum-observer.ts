/* eslint-disable no-console */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { VaultState } from 'dlc-btc-lib/models';
import { delay } from 'dlc-btc-lib/utilities';

import { useEthereum } from './use-ethereum';
import { useEthereumContext } from './use-ethereum-context';

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const { observerDLCManagerContract } = useEthereumContext();
  const { getVault } = useEthereum();

  const { address, network } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (!observerDLCManagerContract) return;

    console.log(`Listening to [${network?.name}]`);
    console.log(`Listening to [${observerDLCManagerContract.address}]`);

    observerDLCManagerContract.on('CreateDLC', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getVault(vaultUUID, VaultState.READY).then(() => {
        dispatch(mintUnmintActions.setMintStep([1, vaultUUID]));
      });
    });

    observerDLCManagerContract.on('CloseDLC', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closing`);

      await getVault(vaultUUID, VaultState.CLOSING).then(() => {
        dispatch(mintUnmintActions.setUnmintStep([1, vaultUUID]));
      });
    });

    observerDLCManagerContract.on('SetStatusFunded', async (...args: any[]) => {
      const vaultOwner = args[2];

      console.log('vaultOwner', vaultOwner.toLowerCase());

      // if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log('vaultUUID', vaultUUID);

      console.log(`Vault ${vaultUUID} is minted`);

      await getVault(vaultUUID, VaultState.FUNDED).then(() => {
        dispatch(
          modalActions.toggleSuccessfulFlowModalVisibility({
            vaultUUID,
          })
        );
        void delay(2000).then(() => {
          dispatch(mintUnmintActions.setMintStep([0, '']));
          dispatch(mintUnmintActions.setUnmintStep([0, '']));
        });
      });
    });

    observerDLCManagerContract.on('SetStatusPending', async (...args: any[]) => {
      // const vaultOwner = args[2];

      // if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is pending`);

      await getVault(vaultUUID, VaultState.PENDING).then(vault => {
        if (vault.valueLocked !== vault.valueMinted) {
          dispatch(mintUnmintActions.setUnmintStep([2, vaultUUID]));
        } else {
          dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
        }
      });
    });

    observerDLCManagerContract.on('PostCloseDLC', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closed`);

      await getVault(vaultUUID, VaultState.CLOSED).then(() => {
        dispatch(mintUnmintActions.setUnmintStep([0, vaultUUID]));
        dispatch(
          modalActions.toggleSuccessfulFlowModalVisibility({
            vaultUUID,
          })
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerDLCManagerContract, network]);
}
