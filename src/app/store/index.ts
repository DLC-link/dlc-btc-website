import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { modalSlice } from '@store/slices/modal/modal.slice';
import { vaultSlice } from '@store/slices/vault/vault.slice';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import { mintUnmintSlice } from './slices/mintunmint/mintunmint.slice';

export interface RootState {
  vault: ReturnType<typeof vaultSlice.reducer>;
  modal: ReturnType<typeof modalSlice.reducer>;
  mintunmint: ReturnType<typeof mintUnmintSlice.reducer>;
}

const rootReducer = combineReducers({
  vault: vaultSlice.reducer,
  modal: modalSlice.reducer,
  mintunmint: mintUnmintSlice.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ['account', 'vault'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
