import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { accountSlice } from './slices/account/account.slice';
import { componentSlice } from './slices/component/component.slice';
import { vaultSlice } from './slices/vault/vault.slice';

export interface RootState {
  account: ReturnType<typeof accountSlice.reducer>;
  vault: ReturnType<typeof vaultSlice.reducer>;
  component: ReturnType<typeof componentSlice.reducer>;
}

export const rootReducer = combineReducers({
  account: accountSlice.reducer,
  vault: vaultSlice.reducer,
  component: componentSlice.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  version: 1,
  storage,
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
