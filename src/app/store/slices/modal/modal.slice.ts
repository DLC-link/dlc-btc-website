import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isSelectWalletModalOpen: boolean;
  isSuccesfulFlowModalOpen: [boolean, "mint" | "unmint"];
}

const initialModalState: ModalState = {
  isSelectWalletModalOpen: false,
  isSuccesfulFlowModalOpen: [false, "mint"],
};

export const modalSlice = createSlice({
  name: "modal",
  initialState: initialModalState,
  reducers: {
    toggleSelectWalletModalVisibility: (state) => {
      state.isSelectWalletModalOpen = !state.isSelectWalletModalOpen;
    },
    toggleSuccessfulFlowModalVisibility: (state, action) => {
      state.isSuccesfulFlowModalOpen = [
        !state.isSuccesfulFlowModalOpen[0],
        action.payload,
      ];
    },
  },
});
