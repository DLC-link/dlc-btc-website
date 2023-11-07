import { Network } from "@models/network";
import { WalletType } from "@models/wallet";
import { createSlice } from "@reduxjs/toolkit";

export interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: Network | undefined;
  loadedAt: string | undefined;
}

export const initialAccountState: AccountState = {
  address: undefined,
  walletType: undefined,
  network: undefined,
  loadedAt: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState: initialAccountState,
  reducers: {
    login: (state, action) => {
      state.address = action.payload.address;
      state.walletType = action.payload.walletType;
      state.network = action.payload.network;
      state.loadedAt = new Date().toJSON();
    },
    logout: (state) => {
      state.address = undefined;
      state.walletType = undefined;
      state.network = undefined;
    },
  },
});
