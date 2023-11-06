import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { accountSlice } from "@store/slices/account/account.slice";
import { modalSlice } from "@store/slices/modal/modal.slice";
import { vaultSlice } from "@store/slices/vault/vault.slice";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  PersistConfig,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

export interface RootState {
  account: ReturnType<typeof accountSlice.reducer>;
  vault: ReturnType<typeof vaultSlice.reducer>;
  modal: ReturnType<typeof modalSlice.reducer>;
}

const rootReducer = combineReducers({
  account: accountSlice.reducer,
  vault: vaultSlice.reducer,
  modal: modalSlice.reducer,
});

const persistConfig: PersistConfig<RootState> = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["account", "vault"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
