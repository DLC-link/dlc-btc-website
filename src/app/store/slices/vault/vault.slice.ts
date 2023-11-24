import { Vault, VaultState } from "@models/vault";
import { createSlice } from "@reduxjs/toolkit";

interface VaultSliceState {
  vaults: any[];
  status: string;
  error: string | null;
}

const initialVaultState: VaultSliceState = {
  vaults: [],
  status: "idle",
  error: null,
};

export const vaultSlice = createSlice({
  name: "vault",
  initialState: initialVaultState,
  reducers: {
    setVaults: (state, action) => {
      const { payload: newVaults } = action;
      console.log("newVaults", newVaults);
      newVaults.forEach((newVault: Vault) => {
        const existingVault = state.vaults.find(
          (vault) => vault.uuid === newVault.uuid,
        );

        if (!existingVault) {
          state.vaults.push(newVault);
        } else {
          const shouldUpdate =
            existingVault.state !== VaultState.FUNDING ||
            newVault.state === VaultState.FUNDED;
          if (shouldUpdate) {
            Object.assign(existingVault, newVault);
          }
        }
      });
    },
    swapVault: (state, action) => {
      const { vaultUUID, updatedVault } = action.payload;

      const vaultIndex = state.vaults.findIndex(
        (vault) => vault.uuid === vaultUUID,
      );

      if (vaultIndex === -1) {
        state.vaults.push(updatedVault);
      } else {
        state.vaults[vaultIndex] = updatedVault;
      }
    },
    setVaultToFunding: (state, action) => {
      const { vaultUUID, fundingTX } = action.payload;

      const vaultIndex = state.vaults.findIndex(
        (vault) => vault.uuid === vaultUUID,
      );

      if (vaultIndex === -1) return;

      state.vaults[vaultIndex].state = VaultState.FUNDING;
      state.vaults[vaultIndex].fundingTX = fundingTX;
    },
  },
});
