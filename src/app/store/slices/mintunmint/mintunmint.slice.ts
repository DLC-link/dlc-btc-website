import { createSlice } from '@reduxjs/toolkit';

export interface MintUnmintState {
  mintStep: number;
  unmintStep: number;
}

export const initialMintUnmintState: MintUnmintState = {
  mintStep: 0,
  unmintStep: 0,
};

export const mintUnmintSlice = createSlice({
  name: 'mintunmint',
  initialState: initialMintUnmintState,
  reducers: {
    setMintStep: (state, action) => {
      state.mintStep = action.payload;
    },
    setUnmintStep: (state, action) => {
      state.unmintStep = action.payload;
    },
  },
});
