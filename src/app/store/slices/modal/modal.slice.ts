import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isSelectWalletModalOpen: boolean;
  isSuccesfulFlowModalOpen: [boolean, string];
  isSelectBitcoinWalletModalOpen: boolean;
  isLedgerModalOpen: boolean;
}

const initialModalState: ModalState = {
  isSelectWalletModalOpen: false,
  isSuccesfulFlowModalOpen: [false, ''],
  isSelectBitcoinWalletModalOpen: false,
  isLedgerModalOpen: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    toggleSelectWalletModalVisibility: state => {
      state.isSelectWalletModalOpen = !state.isSelectWalletModalOpen;
    },
    toggleSuccessfulFlowModalVisibility: (state, action) => {
      const { vaultUUID } = action.payload;
      state.isSuccesfulFlowModalOpen = [!state.isSuccesfulFlowModalOpen[0], vaultUUID];
    },
    toggleSelectBitcoinWalletModalVisibility: state => {
      state.isSelectBitcoinWalletModalOpen = !state.isSelectBitcoinWalletModalOpen;
    },
    toggleLedgerModalVisibility: state => {
      state.isLedgerModalOpen = !state.isLedgerModalOpen;
    },
  },
});
