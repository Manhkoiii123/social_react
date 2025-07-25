import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "@redux/slices/authSlice";
import snackbarReducer from "@redux/slices/snackbarSlice";
import { rootApi } from "@services/rootApi";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  persistStore,
} from "redux-persist";
import { logOutMiddleware } from "./middlewares";
import settingsReducer from "@redux/slices/settingsSlice";
import dialogReducer from "@redux/slices/dialogSlice";
import { setupListeners } from "@reduxjs/toolkit/query";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: [rootApi.reducerPath, "dialog", "settings"],
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    auth: authReducer,
    snackbar: snackbarReducer,
    settings: settingsReducer,
    dialog: dialogReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  }),
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logOutMiddleware, rootApi.middleware);
  },
});
setupListeners(store.dispatch); // thêm thì mới dùng dudwoj refetchOnFocus
export const persistor = persistStore(store);
