import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { rootApi } from "@services/rootApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [rootApi.reducerPath]: rootApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(rootApi.middleware),
});
