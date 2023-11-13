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
  reducers: {},
});
