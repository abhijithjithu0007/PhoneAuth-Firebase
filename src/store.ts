// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/authSlice";
import registerReducer from "./feature/registerSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: registerReducer,
  },
});

export default store;
