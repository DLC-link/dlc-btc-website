import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isSelectWalletModalOpen: boolean;
  isSuccesfulFlowModalOpen: [boolean, 'mint' | 'unmint', string?];
  isSelectBitcoinWalletModalOpen: boolean;
  isLedgerModalOpen: boolean;
  isJasperModalOpen: boolean;
}

const initialModalState: ModalState = {
  isSelectWalletModalOpen: false,
  isSuccesfulFlowModalOpen: [false, 'mint'],
  isSelectBitcoinWalletModalOpen: false,
  isLedgerModalOpen: true,
  isJasperModalOpen: false,
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState: initialModalState,
  reducers: {
    toggleSelectWalletModalVisibility: state => {
      state.isSelectWalletModalOpen = !state.isSelectWalletModalOpen;
    },
    toggleSuccessfulFlowModalVisibility: (state, action) => {
      const { flow, vaultUUID } = action.payload;
      state.isSuccesfulFlowModalOpen = [!state.isSuccesfulFlowModalOpen[0], flow, vaultUUID];
    },
    toggleSelectBitcoinWalletModalVisibility: state => {
      state.isSelectBitcoinWalletModalOpen = !state.isSelectBitcoinWalletModalOpen;
    },
    toggleLedgerModalVisibility: state => {
      state.isLedgerModalOpen = !state.isLedgerModalOpen;
    },
    toggleJasperModalVisibility: state => {
      state.isJasperModalOpen = !state.isJasperModalOpen;
    },
  },
});
