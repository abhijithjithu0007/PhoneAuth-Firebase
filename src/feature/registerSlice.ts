import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// slice for registration
interface UserState {
  firstName: string;
  lastName: string;
  email: string;
  error: string;
}

const initialState: UserState = {
  firstName: "",
  lastName: "",
  email: "",
  error: "",
};

const registerSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (
      state,
      action: PayloadAction<{
        firstName: string;
        lastName: string;
        email: string;
      }>
    ) => {
      const { firstName, lastName, email } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.email = email;
    },

    clearUserDetails: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.email = "";
      state.error = "";
    },
  },
});

export const { setUserDetails, clearUserDetails } = registerSlice.actions;
export default registerSlice.reducer;
