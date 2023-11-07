import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  accountSlice,
  initialAccountState,
} from "@store/slices/account/account.slice";
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
  persistStore,
} from "redux-persist";
import expireReducer from "redux-persist-expire";
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
  storage: storage,
  whitelist: ["account", "vault"],
  transforms: [
    expireReducer("account", {
      persistedAtKey: "loadedAt",
      expireSeconds: 3600,
      expiredState: initialAccountState,
    }),
  ],
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

export const persistor = persistStore(store);
