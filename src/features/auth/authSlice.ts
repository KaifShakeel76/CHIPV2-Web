// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApiSlice } from './authApiSlice';
import SecureStorage from '@/components/auth/utils/secureStorage';

interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  tokenExpiry: number | null;
}

// Initialize state securely from SecureStorage only
const initializeAuthState = (): AuthState => {
  const tokenData = SecureStorage.getTokens();
  const isAuthenticated = SecureStorage.isAuthenticated();
  const userData = SecureStorage.getUser();
  
  return {
    user: userData,
    token: tokenData?.token || null,
    refreshToken: tokenData?.refreshToken || null,
    isAuthenticated,
    tokenExpiry: tokenData?.expiresAt || null,
  };
};

const initialState: AuthState = initializeAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      SecureStorage.setUser(action.payload);
    },
    setTokens(state, action: PayloadAction<{ token: string; refreshToken: string; expiresAt?: number }>) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.tokenExpiry = action.payload.expiresAt || null;
      SecureStorage.setTokens(action.payload.token, action.payload.refreshToken, action.payload.expiresAt);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.tokenExpiry = null;
      SecureStorage.clearAuth();
    },
    refreshAuthState(state) {
      const tokenData = SecureStorage.getTokens();
      const isAuthenticated = SecureStorage.isAuthenticated();
      const userData = SecureStorage.getUser();
      
      state.user = userData;
      state.token = tokenData?.token || null;
      state.refreshToken = tokenData?.refreshToken || null;
      state.isAuthenticated = isAuthenticated;
      state.tokenExpiry = tokenData?.expiresAt || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.loginWithEmail.matchFulfilled,
        (state, action) => {
          const { user, token, refreshToken } = action.payload;
          state.user = user;
          state.token = token;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          
          // Store securely
          SecureStorage.setUser(user);
          SecureStorage.setTokens(token, refreshToken);
        }
      )
      .addMatcher(
        authApiSlice.endpoints.logout.matchFulfilled,
        (state) => {
          state.user = null;
          state.token = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.tokenExpiry = null;
          SecureStorage.clearAuth();
        }
      );
  },
});

export const { setUser, setTokens, logout, refreshAuthState } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

