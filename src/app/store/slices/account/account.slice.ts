import { createSlice } from "@reduxjs/toolkit";

import { Network } from "@models/network";
import { WalletType } from "@models/wallet";

export interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: Network | undefined;
}

const initialState: AccountState = {
  address: undefined,
  walletType: undefined,
  network: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.address = action.payload.address;
      state.walletType = action.payload.walletType;
      state.network = action.payload.network;
    },
    logout: (state) => {
      state.address = undefined;
      state.walletType = undefined;
      state.network = undefined;
    },
  },
});
