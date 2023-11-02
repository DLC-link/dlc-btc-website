import { createSlice } from '@reduxjs/toolkit';

import { EthereumNetwork } from '../../../shared/models/ethereum-network';
import { WalletType } from '../../../shared/models/wallet-type';

interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: EthereumNetwork | undefined;
}

const initialState: AccountState = {
  address: undefined,
  walletType: undefined,
  network: undefined,
};
  
export const accountSlice = createSlice({
  name: 'account',
  initialState: initialState,
  reducers: {},
});
