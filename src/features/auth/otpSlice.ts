// src/features/auth/otpSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OtpState {
  otp: string[];
  otpSent: boolean;
  showOtpInput: boolean;
  verified: boolean;
}

const initialState: OtpState = {
  otp: Array(6).fill(""),
  otpSent: false,
  showOtpInput: false,
  verified: false,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setOtp: (state, action: PayloadAction<string[]>) => {
      state.otp = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<boolean>) => {
      state.otpSent = action.payload;
    },
    setShowOtpInput: (state, action: PayloadAction<boolean>) => {
      state.showOtpInput = action.payload;
    },
    setVerified: (state, action: PayloadAction<boolean>) => {
      state.verified = action.payload;
    },
    resetOtpState: (state) => {
      state.otp = Array(6).fill("");
      state.otpSent = false;
      state.showOtpInput = false;
      state.verified = false;
    },
  },
});

export const {
  setOtp,
  setOtpSent,
  setShowOtpInput,
  setVerified,
  resetOtpState,
} = otpSlice.actions;

export default otpSlice.reducer;
