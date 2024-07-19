/* eslint-disable no-console */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getEthereumNetworkDeploymentPlans } from '@functions/configuration.functions';
import { getAndFormatVault } from '@functions/vault.functions';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { getEthereumContract } from 'dlc-btc-lib/ethereum-functions';
import { delay } from 'dlc-btc-lib/utilities';
import { ethers } from 'ethers';

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const { address: ethereumUserAddress, network: ethereumNetwork } = useSelector(
    (state: RootState) => state.account
  );

  useEffect(() => {
    if (!ethereumUserAddress) return;

    const deploymentPlans = getEthereumNetworkDeploymentPlans(ethereumNetwork);
    const provider = new ethers.providers.WebSocketProvider(
      appConfiguration.ethereumInfuraWebsocketURL
    );
    const dlcManagerContract = getEthereumContract(deploymentPlans, 'DLCManager', provider);

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
