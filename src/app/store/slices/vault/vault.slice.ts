import { createSlice } from "@reduxjs/toolkit";

interface VaultState {
  vaults: any[];
  status: string;
  error: string | null;
}

const initialState: VaultState = {
  vaults: [],
  status: "idle",
  error: null,
};

export const vaultSlice = createSlice({
  name: "vault",
  initialState: initialState,
  reducers: {},
});
