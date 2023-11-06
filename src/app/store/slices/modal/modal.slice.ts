import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isSelectWalletModalOpen: boolean;
}

const initialState: ModalState = {
  isSelectWalletModalOpen: false,
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialState,
  reducers: {
    toggleSelectWalletModalVisibility: (state) => {
      state.isSelectWalletModalOpen = !state.isSelectWalletModalOpen;
    },
  },
});
