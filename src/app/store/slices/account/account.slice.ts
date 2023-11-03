import { createSlice } from '@reduxjs/toolkit';

import { AllNetwork } from '../../../../shared/models/network';
import { WalletType } from '../../../../shared/models/wallet';

interface AccountState {
  address: string | undefined;
  walletType: WalletType | undefined;
  network: AllNetwork | undefined;
}

const initialState: AccountState = {
  address: undefined,
  walletType: undefined,
  network: undefined,
};
  
export const accountSlice = createSlice({
  name: 'account',
  initialState: initialState,
  reducers: {
    setNetwork: (state, action) => {
      state.network = action.payload;
    }
  },
});
