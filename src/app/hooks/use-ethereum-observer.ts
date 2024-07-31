/* eslint-disable no-console */
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getAndFormatVault } from '@functions/vault.functions';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { delay } from 'dlc-btc-lib/utilities';

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const { address: ethereumUserAddress, network: ethereumNetwork } = useSelector(
    (state: RootState) => state.account
  );

  const { getReadOnlyDLCManagerContract } = useContext(EthereumNetworkConfigurationContext);

  useEffect(() => {
    if (!ethereumUserAddress) return;

    const dlcManagerContract = getReadOnlyDLCManagerContract(
      appConfiguration.ethereumInfuraWebsocketURL
    );

    console.log(`Listening to [${ethereumNetwork.name}]`);
    console.log(`Listening to [${dlcManagerContract.address}]`);

    dlcManagerContract.on('CreateDLC', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getAndFormatVault(vaultUUID, dlcManagerContract)
        .then(vault => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: ethereumNetwork.id,
            })
          );
        })
        .then(() => {
          dispatch(mintUnmintActions.setMintStep([1, vaultUUID]));
        });
    });

    dlcManagerContract.on('SetStatusFunded', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log('vaultUUID', vaultUUID);

      console.log(`Vault ${vaultUUID} is funded`);

      await getAndFormatVault(vaultUUID, dlcManagerContract)
        .then(vault => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: ethereumNetwork.id,
            })
          );
        })
        .then(() => {
          dispatch(
            modalActions.toggleSuccessfulFlowModalVisibility({
              vaultUUID,
            })
          );
          void delay(2000).then(() => {
            dispatch(mintUnmintActions.setMintStep([0, '']));
          });
        });
    });

    dlcManagerContract.on('SetStatusPending', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is pending`);

      await getAndFormatVault(vaultUUID, dlcManagerContract)
        .then(vault => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: ethereumNetwork.id,
            })
          );
          return vault;
        })
        .then(vault => {
          if (vault.valueLocked !== vault.valueMinted) {
            dispatch(mintUnmintActions.setUnmintStep([2, vaultUUID]));
          } else {
            dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
          }
        });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumNetwork]);
}
