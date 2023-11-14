import { Network } from "@models/network";
import { WalletType } from "@models/wallet";
import { createSlice } from "@reduxjs/toolkit";

export interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: Network | undefined;
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
  loadedAt: string | undefined;
}

export const initialAccountState: AccountState = {
  address: undefined,
  walletType: undefined,
  network: undefined,
  dlcBTCBalance: undefined,
  lockedBTCBalance: undefined,
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
      state.dlcBTCBalance = action.payload.dlcBTCBalance;
      state.lockedBTCBalance = action.payload.lockedBTCBalance;
      state.loadedAt = new Date().toJSON();
    },
    logout: (state) => {
      state.address = undefined;
      state.walletType = undefined;
      state.dlcBTCBalance = undefined;
      state.lockedBTCBalance = undefined;
      state.network = undefined;
    },
  },
});
