import { EthereumNetwork, ethereumArbitrum } from '@models/ethereum-network';
import { WalletType } from '@models/wallet';
import { createSlice } from '@reduxjs/toolkit';

interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: EthereumNetwork | undefined;
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
  loadedAt: string | undefined;
}

export const initialAccountState: AccountState = {
  address: undefined,
  walletType: WalletType.Metamask,
  network: ethereumArbSepolia,
  dlcBTCBalance: 0,
  lockedBTCBalance: 0,
  loadedAt: undefined,
};

export const accountSlice = createSlice({
  name: 'account',
  initialState: initialAccountState,
  reducers: {
    login: (state, action) => {
      state.address = action.payload.address;
      state.walletType = action.payload.walletType;
      state.network = action.payload.network;
      state.loadedAt = new Date().toJSON();
    },
    logout: state => {
      state.address = undefined;
      state.walletType = undefined;
      state.dlcBTCBalance = 0;
      state.lockedBTCBalance = 0;
      state.network = undefined;
    },
  },
});
