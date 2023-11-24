import { createSlice } from "@reduxjs/toolkit";

import { exampleVaults } from "@shared/examples/example-vaults";

interface VaultState {
  vaults: any[];
  status: string;
  error: string | null;
}

const initialVaultState: VaultState = {
  vaults: exampleVaults,
  status: "idle",
  error: null,
};

export const vaultSlice = createSlice({
  name: "vault",
  initialState: initialVaultState,
  reducers: {
    setVaults: (state, action) => {
      state.vaults = action.payload;
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
  },
});
