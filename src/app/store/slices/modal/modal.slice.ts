import { createSlice } from '@reduxjs/toolkit';

interface ModalState {
  isSelectWalletModalOpen: boolean;
  isSuccesfulFlowModalOpen: [boolean, string, string, number];
  isSelectBitcoinWalletModalOpen: boolean;
  isLedgerModalOpen: boolean;
}

const initialModalState: ModalState = {
  isSelectWalletModalOpen: false,
  isSuccesfulFlowModalOpen: [false, '', 'mint', 0],
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
      const { vaultUUID, flow, assetAmount } = action.payload;
      state.isSuccesfulFlowModalOpen = [
        !state.isSuccesfulFlowModalOpen[0],
        vaultUUID,
        flow,
        assetAmount,
      ];
    },
    toggleSelectBitcoinWalletModalVisibility: state => {
      state.isSelectBitcoinWalletModalOpen = !state.isSelectBitcoinWalletModalOpen;
    },
    toggleLedgerModalVisibility: state => {
      state.isLedgerModalOpen = !state.isLedgerModalOpen;
    },
  },
});
