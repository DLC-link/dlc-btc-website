import { createSlice } from '@reduxjs/toolkit';

interface MintUnmintState {
  mintStep: [number, string];
  unmintStep: [number, string];
  activeTab: 0 | 1;
}

const initialMintUnmintState: MintUnmintState = {
  mintStep: [0, ''],
  unmintStep: [0, ''],
  activeTab: 0,
};

export const mintUnmintSlice = createSlice({
  name: 'mintunmint',
  initialState: initialMintUnmintState,
  reducers: {
    setMintStep: (state, action) => {
      state.mintStep = action.payload;
      state.activeTab = 0;
    },
    setUnmintStep: (state, action) => {
      state.unmintStep = action.payload;
      state.activeTab = 1;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    resetMintUnmintState: state => {
      state.mintStep = [0, ''];
      state.unmintStep = [0, ''];
      state.activeTab = 0;
    },
  },
});
