import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import registerReducer from "./feature/registerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: registerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
