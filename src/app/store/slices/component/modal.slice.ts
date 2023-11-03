import { createSlice } from '@reduxjs/toolkit';

export interface ModalState {
  isSelectWalletModalOpen: boolean;
}

const initialState: ModalState = {
  isSelectWalletModalOpen: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    toggleSelectWalletModalVisibility: (state, action) => {
      state.isSelectWalletModalOpen = action.payload;
    },
  },
});
