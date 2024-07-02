import { EthereumNetwork, ethereumArbSepolia, ethereumArbitrum } from '@models/ethereum-network';
import { WalletType } from '@models/wallet';
import { createSlice } from '@reduxjs/toolkit';

interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: EthereumNetwork;
  dlcBTCBalance: number | undefined;
  lockedBTCBalance: number | undefined;
  loadedAt: string | undefined;
}

const bitcoinNetworkName = appConfiguration.bitcoinNetwork;
let ethereumNetwork: EthereumNetwork;
switch (bitcoinNetworkName) {
  case 'mainnet':
    ethereumNetwork = ethereumArbitrum;
    break;
  case 'regtest':
    ethereumNetwork = ethereumArbSepolia;
    break;
  default:
    ethereumNetwork = ethereumArbSepolia;
}

export const initialAccountState: AccountState = {
  address: undefined,
  walletType: WalletType.Metamask,
  network: ethereumNetwork,
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
      state.network = ethereumNetwork;
    },
  },
});
