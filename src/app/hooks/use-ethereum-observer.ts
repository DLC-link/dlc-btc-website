import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { formatVault } from '@functions/vault.functions';
import { Vault } from '@models/vault';
import { EthereumHandlerContext } from '@providers/ethereum-handler-context-provider';
import { RootState } from '@store/index';
import { mintUnmintActions } from '@store/slices/mintunmint/mintunmint.actions';
import { modalActions } from '@store/slices/modal/modal.actions';
import { vaultActions } from '@store/slices/vault/vault.actions';
import { RawVault } from 'dlc-btc-lib/models';

function getAndFormatVault(vaultUUID: string, ethereumHandler: any): Promise<Vault> {
  return ethereumHandler.getRawVault(vaultUUID).then((vault: RawVault) => formatVault(vault));
}

export function useEthereumObserver(): void {
  const dispatch = useDispatch();

  const { readOnlyEthereumHandler, isReadOnlyEthereumHandlerSet } =
    useContext(EthereumHandlerContext);

  const { address: ethereumUserAddress, network: ethereumNetwork } = useSelector(
    (state: RootState) => state.account
  );

  useEffect(() => {
    if (!isReadOnlyEthereumHandlerSet) return;

    const ethereumContracts = readOnlyEthereumHandler?.getContracts();

    console.log(`Listening to [${ethereumNetwork?.name}]`);
    console.log(`Listening to [${ethereumContracts?.protocolContract.address}]`);

    ethereumContracts?.protocolContract.on('SetupVault', async (...args: any[]) => {
      const vaultOwner: string = args[2];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getAndFormatVault(vaultUUID, readOnlyEthereumHandler)
        .then((vault: Vault) => {
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

    ethereumContracts?.protocolContract.on('CloseVault', async (...args: any[]) => {
      const vaultOwner: string = args[1];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closing`);

      await getAndFormatVault(vaultUUID, readOnlyEthereumHandler)
        .then((vault: Vault) => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: ethereumNetwork.id,
            })
          );
        })
        .then(() => {
          dispatch(mintUnmintActions.setUnmintStep([1, vaultUUID]));
        });
    });

    ethereumContracts?.protocolContract.on('SetStatusFunded', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is minted`);

      await getAndFormatVault(vaultUUID, readOnlyEthereumHandler)
        .then((vault: Vault) => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: ethereumNetwork.id,
            })
          );
        })
        .then(() => {
          dispatch(mintUnmintActions.setMintStep([0, vaultUUID]));
          dispatch(
            modalActions.toggleSuccessfulFlowModalVisibility({
              flow: 'mint',
              vaultUUID,
            })
          );
        });
    });

    ethereumContracts?.protocolContract.on('PostCloseDLCHandler', async (...args: any[]) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== ethereumUserAddress) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closed`);

      await getAndFormatVault(vaultUUID, readOnlyEthereumHandler)
        .then((vault: Vault) => {
          dispatch(
            vaultActions.swapVault({
              vaultUUID,
              updatedVault: vault,
              networkID: ethereumNetwork.id,
            })
          );
        })
        .then(() => {
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
  }, [readOnlyEthereumHandler, ethereumNetwork]);
}
