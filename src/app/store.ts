// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import loginTabReducer from "@/features/auth/loginTabSlice";
import authReducer from "@/features/auth/authSlice";
import registerFormReducer from "@/features/registerForm/registerFormSlice";
import otpReducer from "@/features/auth/otpSlice";
import geoDataReducer from "@/features/geoData/geoDataSlice";
import stateReducer from "@/features/state/stateSlice";
import { authApiSlice } from "@/features/auth/authApiSlice";
import { geoApiSlice } from "@/features/geoData/geoApiSlice";
import { registrationApiSlice } from "@/features/auth/registrationApiSlice";

export const store = configureStore({
  reducer: {
    loginTab: loginTabReducer,
    auth: authReducer,
    registerForm: registerFormReducer,
    otp: otpReducer,
    geoData: geoDataReducer,
    state: stateReducer,
    [authApiSlice.reducerPath]: authApiSlice.reducer,
    [geoApiSlice.reducerPath]: geoApiSlice.reducer,
    [registrationApiSlice.reducerPath]: registrationApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(authApiSlice.middleware, geoApiSlice.middleware, registrationApiSlice.middleware),
});

//Types for useDispatch and useSelector
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
