import { createSlice, PayloadAction } from "@reduxjs/toolkit";

//slice for controlling the phone auth state
interface AuthState {
  phone: string;
  otp: string;
  confirmationResult: any;
  loading: boolean;
}

const initialState: AuthState = {
  phone: "",
  otp: "",
  confirmationResult: null,
  loading: false,
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
    resetAuthState: (state) => {
      state.phone = "";
      state.otp = "";
      state.confirmationResult = null;
      state.loading = false;
    },
  },
});

export const {
  setPhone,
  setOtp,
  setConfirmationResult,
  setLoading,
  resetAuthState,
} = authSlice.actions;

export default authSlice.reducer;
