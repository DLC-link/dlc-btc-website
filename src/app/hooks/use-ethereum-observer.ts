/* eslint-disable no-console */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { VaultState } from '@models/vault';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';

import { useEthereum } from './use-ethereum';
import { useEthereumContext } from './use-ethereum-context';

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const { observerProtocolContract } = useEthereumContext();
  const { getVault } = useEthereum();

  const { address, network } = useSelector((state: RootState) => state.account);

  useEffect(() => {
    if (!observerProtocolContract) return;

    console.log(`Listening to [${network?.name}]`);
    console.log(`Listening to [${observerProtocolContract.address}]`);

    observerProtocolContract.on('SetupVault', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getVault(vaultUUID, VaultState.READY).then(() => {
        dispatch(mintUnmintActions.setMintStep([1, vaultUUID]));
      });
    });

    observerProtocolContract.on('CloseVault', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closing`);

      await getVault(vaultUUID, VaultState.CLOSING).then(() => {
        dispatch(mintUnmintActions.setUnmintStep([1, vaultUUID]));
      });
    });

    observerProtocolContract.on('SetStatusFunded', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is minted`);

      await getVault(vaultUUID, VaultState.FUNDED).then(() => {
        dispatch(mintUnmintActions.setMintStep([0, vaultUUID]));
        dispatch(
          modalActions.toggleSuccessfulFlowModalVisibility({
            flow: 'mint',
            vaultUUID,
          })
        );
      });
    });

    observerProtocolContract.on('PostCloseDLCHandler', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closed`);

      await getVault(vaultUUID, VaultState.CLOSED).then(() => {
        dispatch(mintUnmintActions.setUnmintStep([0, vaultUUID]));
        dispatch(
          modalActions.toggleSuccessfulFlowModalVisibility({
            flow: 'unmint',
            vaultUUID,
          })
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerProtocolContract, network]);
}
