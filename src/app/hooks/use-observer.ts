import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { VaultState } from "@models/vault";
import { RootState } from "@store/index";
import { mintUnmintActions } from "@store/slices/mintunmint/mintunmint.actions";
import { modalActions } from "@store/slices/modal/modal.actions";
import { UseEthereumReturnType } from "./use-ethereum";

export function useObserver(ethereum: UseEthereumReturnType): void {
  const dispatch = useDispatch();
  const { address, network } = useSelector((state: RootState) => state.account);
  const { protocolContract, dlcBTCContract, getVault } = ethereum;

  useEffect(() => {
    if (!protocolContract || !dlcBTCContract) return;

    console.log(`Listening to [${network?.name}]`);
    console.log(`Listening to [${protocolContract.address}]`);
    console.log(`Listening to [${dlcBTCContract.address}]`);

    protocolContract.on("SetupVault", async (...args) => {
      const vaultOwner: string = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getVault(vaultUUID, VaultState.READY).then(() => {
        dispatch(mintUnmintActions.setMintStep(1));
      });
    });

    protocolContract.on("CloseVault", async (...args) => {
      const vaultOwner: string = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closing`);

      await getVault(vaultUUID, VaultState.CLOSING).then(() => {
        dispatch(mintUnmintActions.setUnmintStep(1));
      });
    });

    protocolContract.on("SetStatusFunded", async (...args) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is minted`);

      await getVault(vaultUUID, VaultState.FUNDED).then(() => {
        dispatch(mintUnmintActions.setMintStep(0));
        dispatch(modalActions.toggleSuccessfulFlowModalVisibility("mint"));
      });
    });

    protocolContract.on("PostCloseDLCHandler", async (...args) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closed`);

      await getVault(vaultUUID, VaultState.CLOSED).then(() => {
        dispatch(mintUnmintActions.setUnmintStep(0));
        dispatch(modalActions.toggleSuccessfulFlowModalVisibility("unmint"));
      });
    });
  }, [protocolContract, dlcBTCContract, network]);
}
