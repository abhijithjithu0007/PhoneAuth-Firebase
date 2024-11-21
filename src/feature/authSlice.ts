import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecaptchaVerifier } from "firebase/auth";

interface AuthState {
  phone: string;
  otp: string;
  confirmationResult: any;
  loading: boolean;
  isAuthenticated: boolean;
  recaptchaVerifier: RecaptchaVerifier | null;
}

const initialState: AuthState = {
  phone: "",
  otp: "",
  confirmationResult: null,
  loading: false,
  isAuthenticated: false,
  recaptchaVerifier: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setOtp: (state, action: PayloadAction<string>) => {
      state.otp = action.payload;
    },
    setConfirmationResult: (state, action: PayloadAction<any>) => {
      state.confirmationResult = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setRecaptchaVerifier: (
      state,
      action: PayloadAction<RecaptchaVerifier | null>
    ) => {
      state.recaptchaVerifier = action.payload;
    },
    resetAuthState: (state) => {
      state.phone = "";
      state.otp = "";
      state.confirmationResult = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.recaptchaVerifier = null;
    },
  },
});

export const {
  setPhone,
  setOtp,
  setConfirmationResult,
  setLoading,
  setAuthenticated,
  setRecaptchaVerifier,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
