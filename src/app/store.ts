// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginTabReducer from "@/features/auth/loginTabSlice";

export const store = configureStore({
  reducer: {
    loginTab: loginTabReducer,
  },
});

//Types for useDispatch and useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
