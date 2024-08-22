/* eslint-disable no-console */
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { isEnabledEthereumNetwork } from '@functions/configuration.functions';
import { getAndFormatVault } from '@functions/vault.functions';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { delay } from 'dlc-btc-lib/utilities';
import { equals } from 'ramda';
import { useAccount } from 'wagmi';

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const { address: ethereumUserAddress, chainId, chain } = useAccount();

  const { getReadOnlyDLCManagerContract } = useContext(EthereumNetworkConfigurationContext);

  useEffect(() => {
    if (!ethereumUserAddress || !chain) return;
    if (!isEnabledEthereumNetwork(chain)) return;

    let websocketURL;
    if ([421614, 11155111].includes(chain.id)) {
      websocketURL = appConfiguration.ethereumInfuraWebsocketURL;
    } else {
      websocketURL = appConfiguration.ethereumAlchemyWebsocketURL;
    }

    const dlcManagerContract = getReadOnlyDLCManagerContract(websocketURL);

    console.log(`Listening to [${chain?.name}]`);
    console.log(`Listening to [${dlcManagerContract.address}]`);

    dlcManagerContract.on('CreateDLC', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (!equals(vaultOwner, ethereumUserAddress)) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getAndFormatVault(vaultUUID, dlcManagerContract)
        .then(vault => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: chain?.id.toString() as EthereumNetworkID,
            })
          );
        })
        .then(() => {
          dispatch(mintUnmintActions.setMintStep([1, vaultUUID]));
        });
    });

    dlcManagerContract.on('SetStatusFunded', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (!equals(vaultOwner, ethereumUserAddress)) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is funded`);

      await getAndFormatVault(vaultUUID, dlcManagerContract)
        .then(vault => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: chain?.id.toString() as EthereumNetworkID,
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

      if (!equals(vaultOwner, ethereumUserAddress)) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is pending`);

      await getAndFormatVault(vaultUUID, dlcManagerContract)
        .then(vault => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: chain?.id.toString() as EthereumNetworkID,
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
  }, [chainId]);
}
