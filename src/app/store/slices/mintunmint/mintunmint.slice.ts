import { createSlice } from "@reduxjs/toolkit";

interface MintUnmintState {
  mintStep: [number, string]
  unmintStep: [number, string]
}

const initialMintUnmintState: MintUnmintState = {
  mintStep: [0, ''],
  unmintStep: [0, ''],
};

export const mintUnmintSlice = createSlice({
  name: "mintunmint",
  initialState: initialMintUnmintState,
  reducers: {
    setMintStep: (state, action) => {
      state.mintStep = action.payload;
    },
    setUnmintStep: (state, action) => {
      state.unmintStep = action.payload;
    },
    resetMintUnmintState: (state) => {
      state.mintStep = [0, ''];
      state.unmintStep = [0, ''];
    },
  },
});
