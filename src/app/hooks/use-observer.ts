import { Dispatch, useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@store/index";
import { mintUnmintActions } from "@store/slices/mintunmint/mintunmint.actions";
import { AnyAction } from "redux";

import { UseEthereumReturn } from "./use-ethereum";

export function useObserver(
  ethereum: UseEthereumReturn,
  dispatch: Dispatch<AnyAction>,
) {
  const { address, network } = useSelector((state: RootState) => state.account);
  const { protocolContract, dlcBTCContract, getVault } = ethereum;

  useEffect(() => {
    if (!protocolContract || !dlcBTCContract) return;

    console.log(`Listening to [${network?.name}]`);
    console.log(`Listening to [${protocolContract.address}]`);
    console.log(`Listening to [${dlcBTCContract.address}]`);

    protocolContract.on("SetupVault", async (...args) => {
      console.log("SetupVault", args);
      const vaultOwner: string = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is ready`);

      await getVault(vaultUUID).then(() => {
        dispatch(mintUnmintActions.setMintStep(1));
      });
    });

    protocolContract.on("CloseVault", async (...args) => {
      const vaultOwner: string = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is closing`);
      await getVault(vaultUUID);
      dispatch(mintUnmintActions.setUnmintStep(1));
    });

    protocolContract.on("SetStatusFunded", async (...args) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is minted`);

      await getVault(vaultUUID).then(() => {
        dispatch(mintUnmintActions.setMintStep(3));
      });
    });

    protocolContract.on("PostCloseDLCHandler", async (...args) => {
      const vaultOwner = args[2];

      if (vaultOwner.toLowerCase() !== address) return;

      const vaultUUID = args[0];

      console.log(`Vault ${vaultUUID} is minted`);

      await getVault(vaultUUID).then(() => {
        dispatch(mintUnmintActions.setUnmintStep(2));
      });
    });
  }, [protocolContract, dlcBTCContract, network]);
}
