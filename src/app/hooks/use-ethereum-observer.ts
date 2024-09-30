/* eslint-disable no-console */
import { useContext, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { getAndFormatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { EthereumNetworkConfigurationContext } from '@providers/ethereum-network-configuration.provider';
import { VaultContext } from '@providers/vault-context-provider';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import Decimal from 'decimal.js';
import { EthereumNetworkID } from 'dlc-btc-lib/models';
import { equals } from 'ramda';
import { useAccount } from 'wagmi';

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const vaultContext = useContext(VaultContext);
  const allVaults = useRef(vaultContext.allVaults);

  useEffect(() => {
    allVaults.current = vaultContext.allVaults;
  }, [vaultContext.allVaults]);

  const { address: ethereumUserAddress, chain } = useAccount();

  const { ethereumNetworkConfiguration } = useContext(EthereumNetworkConfigurationContext);

  function getCurrentVault(vaultUUID: string): Vault {
    const currentVault = allVaults.current.find(vault => vault.uuid === vaultUUID);
    if (!currentVault) throw new Error(`Vault ${vaultUUID} not found`);
    return currentVault;
  }

  useEffect(() => {
    if (!ethereumUserAddress) return;

    const dlcManagerContract = ethereumNetworkConfiguration.dlcManagerContract;

    console.log(`Listening to [${chain?.name}]`);
    console.log(`Listening to [${dlcManagerContract.address}]`);

    const handleCreateDLC = async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (!equals(vaultOwner, ethereumUserAddress)) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      const updatedVault = await getAndFormatVault(vaultUUID, dlcManagerContract);

      dispatch(
        vaultActions.swapVault({
          vaultUUID,
          updatedVault: updatedVault,
          networkID: chain?.id.toString() as EthereumNetworkID,
        })
      );

      dispatch(mintUnmintActions.setMintStep([1, vaultUUID]));
    };

    const handleSetStatusFunded = async (...args: any[]) => {
      const vaultOwner = args[2];

      if (!equals(vaultOwner, ethereumUserAddress)) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is funded`);

      const currentVault = getCurrentVault(vaultUUID);
      const updatedVault = await getAndFormatVault(vaultUUID, dlcManagerContract);

      dispatch(
        vaultActions.swapVault({
          vaultUUID,
          updatedVault: updatedVault,
          networkID: chain?.id.toString() as EthereumNetworkID,
        })
      );

      if (currentVault.valueMinted < currentVault.valueLocked) {
        dispatch(
          modalActions.toggleSuccessfulFlowModalVisibility({
            vaultUUID,
            flow: 'burn',
            assetAmount: new Decimal(currentVault.valueLocked)
              .minus(updatedVault.valueLocked)
              .toNumber(),
          })
        );
        dispatch(mintUnmintActions.setMintStep([0, '']));
      } else {
        dispatch(
          modalActions.toggleSuccessfulFlowModalVisibility({
            vaultUUID,
            flow: 'mint',
            assetAmount: new Decimal(updatedVault.valueLocked)
              .minus(currentVault.valueLocked)
              .toNumber(),
          })
        );
        dispatch(mintUnmintActions.setMintStep([0, '']));
      }
    };

    const handleSetStatusPending = async (...args: any[]) => {
      const vaultOwner = args[2];

      if (!equals(vaultOwner, ethereumUserAddress)) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is pending`);

      const updatedVault = await getAndFormatVault(vaultUUID, dlcManagerContract);

      dispatch(
        vaultActions.swapVault({
          vaultUUID,
          updatedVault: updatedVault,
          networkID: chain?.id.toString() as EthereumNetworkID,
        })
      );

      if (updatedVault.valueLocked !== updatedVault.valueMinted) {
        dispatch(mintUnmintActions.setUnmintStep([2, vaultUUID]));
      } else {
        dispatch(mintUnmintActions.setMintStep([2, vaultUUID]));
      }
    };

    dlcManagerContract.on('CreateDLC', handleCreateDLC);
    dlcManagerContract.on('SetStatusFunded', handleSetStatusFunded);
    dlcManagerContract.on('SetStatusPending', handleSetStatusPending);

    return () => {
      dlcManagerContract.off('CreateDLC', handleCreateDLC);
      dlcManagerContract.off('SetStatusFunded', handleSetStatusFunded);
      dlcManagerContract.off('SetStatusPending', handleSetStatusPending);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ethereumNetworkConfiguration, ethereumUserAddress, chain?.id]);
}
