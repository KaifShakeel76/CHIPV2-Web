import { createSlice } from "@reduxjs/toolkit";

interface LoginTabState {
  method: "email" | "mobile";
  otpSent: boolean;
}

const initialState: LoginTabState = {
  method: "email",
  otpSent: false,
};

const loginTabSlice = createSlice({
  name: "loginTab",
  initialState,
  reducers: {
    switchToEmail: (state) => {
      state.method = "email";
      state.otpSent = false;
    },
    switchToMobile: (state) => {
      state.method = "mobile";
      state.otpSent = false;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
  },
});

export const { switchToEmail, switchToMobile, setOtpSent } = loginTabSlice.actions;
export default loginTabSlice.reducer;
