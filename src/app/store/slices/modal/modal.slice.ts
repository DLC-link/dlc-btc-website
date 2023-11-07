import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isSelectWalletModalOpen: boolean;
}

const initialModalState: ModalState = {
  isSelectWalletModalOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    toggleSelectWalletModalVisibility: (state) => {
      state.isSelectWalletModalOpen = !state.isSelectWalletModalOpen;
    },
  },
});
