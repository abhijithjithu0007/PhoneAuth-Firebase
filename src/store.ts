// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import registerReducer from "./feature/registerSlice";

// Configure the store with your reducers
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: registerReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
