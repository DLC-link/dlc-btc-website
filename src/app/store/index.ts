// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { EthereumNetworkID } from '@models/ethereum-network';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { accountSlice, initialAccountState } from '@store/slices/account/account.slice';
import { modalSlice } from '@store/slices/modal/modal.slice';
import { vaultSlice } from '@store/slices/vault/vault.slice';
import {
  FLUSH,
  MigrationManifest,
  PAUSE,
  PERSIST,
  PURGE,
  PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import expireReducer from 'redux-persist-expire';
import createMigrate from 'redux-persist/es/createMigrate';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import { mintUnmintSlice } from './slices/mintunmint/mintunmint.slice';

export interface RootState {
  account: ReturnType<typeof accountSlice.reducer>;
  vault: ReturnType<typeof vaultSlice.reducer>;
  modal: ReturnType<typeof modalSlice.reducer>;
  mintunmint: ReturnType<typeof mintUnmintSlice.reducer>;
}

const rootReducer = combineReducers({
  account: accountSlice.reducer,
  vault: vaultSlice.reducer,
  modal: modalSlice.reducer,
  mintunmint: mintUnmintSlice.reducer,
});

const migrations: MigrationManifest = {
  1: state => {
    return {
      ...state,
      vault: {
        ...state.vault,
        vaults: {
          ...state.vault.vaults,
          [EthereumNetworkID.ArbSepolia]: [],
        },
      },
    };
  },
};

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage: storage,
  migrate: createMigrate(migrations),
  stateReconciler: autoMergeLevel2,
  whitelist: ['account', 'vault'],
  transforms: [
    expireReducer('account', {
      persistedAtKey: 'loadedAt',
      expireSeconds: 3600,
      expiredState: initialAccountState,
    }),
  ],
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
