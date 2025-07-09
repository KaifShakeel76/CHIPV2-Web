import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

import PasswordSecurity from '@/components/auth/utils/passwordSecurity';
import { getCsrfToken } from '@/lib/csrfToken';
import axiosInstance from '@/lib/axiosInstance';

// Types for API responses
interface LoginRequest {
  email?: string;
  mobile?: string;
  password: string;
}

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    full_name: string;
    mobile: string;
    created_at: string;
  };
  session: {
    session_id: string;
    login_time: string;
    logout_time: string | null;
    status: number;
    active: boolean;
    created_at: string;
  };
}

interface OtpRequest {
  mobile?: string;
  email?: string;
  whatsapp?: string;
  type: 'mobile' | 'email' | 'whatsapp';
  context: 'registration' | 'login' | 'forgot-password';
}

interface OtpResponse {
  success: boolean;
  message: string;
  otpId: string;
  expiryTime: number;      // OTP expiry time in seconds
  resendCooldown: number;  // Time before user can request new OTP
  timestamp: string;       // Response timestamp
}

// Error Response Interface for SendOTP
interface SendOtpErrorResponse {
  success: false;
  message: string;
  error: string;
  code?: string;           // For MOBILE_NOT_REGISTERED, etc.
  retryAfter?: number;     // For rate limiting (seconds)
  maxAttempts?: number;    // Maximum attempts allowed
  waitTimeSeconds?: number; // How long to wait
  timestamp: string;       // Error timestamp
}

interface VerifyOtpRequest {
  otpId: string;
  otp: string;
  type: 'mobile' | 'email' | 'whatsapp';
}

interface VerifyOtpResponse {
  success: boolean;
  verified: boolean;
  message: string;
  contactMethod: 'email' | 'mobile' | 'whatsapp';
  // Login context fields (only present when context = 'login')
  user?: {
    id: string;
    mobile: string;
    email?: string;
    name: string;
    role: string;
  };
  token?: string;
  refreshToken?: string;
  // Rate limiting fields
  attemptsRemaining?: number;
  maxAttempts?: number;
  error?: string;
  retryAfter?: number;
  lockExpiresAt?: string;
  waitTimeSeconds?: number;
  // 410 OTP Expired fields
  expiryTime?: number;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

// Enhanced base query with error handling and retry logic
const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://a13797edace6744e9aaac6eb088b75ca-270168266.ap-south-1.elb.amazonaws.com:3000/v1',
    credentials: 'include',  // Include session cookies
    prepareHeaders: (headers, { getState }) => {
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      // Add API key if available
      const apiKey = import.meta.env.VITE_API_KEY;
      const apiKeyHeader = import.meta.env.VITE_API_KEY_HEADER_NAME || 'X-API-KEY';
      if (apiKey) {
        headers.set(apiKeyHeader, apiKey);
      }
      
      headers.set('User-Agent', 'CHIPV2-Frontend/1.0');
      headers.set('Accept-Language', 'en-US,en;q=0.9');
      
      // Ad
      // d auth token if available (for authenticated requests)
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Retry logic for network errors
  if (result.error && result.error.status === 'FETCH_ERROR') {
    console.warn('Network error, retrying...', result.error);
    
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQuery(args, api, extraOptions);

  }

  // Handle token refresh on 401, but not for login/signup endpoints
  if (result.error && result.error.status === 401) {
    const url = typeof args === 'string' ? args : args.url;
    const isAuthEndpoint = url?.includes('/auth/sign_in') || url?.includes('/auth/login') || url?.includes('/auth/signup') || url?.includes('/auth/register');
    
    if (!isAuthEndpoint) {
      console.warn('Token expired, attempting refresh...');
      
      // Attempt token refresh
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: {
            refreshToken: (api.getState() as any).auth?.refreshToken,
          },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Retry original request with new token
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    }
  }

  return result;
};

// RTK Query API slice for authentication
export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithRetry,
  tagTypes: ['User', 'Session'],
  keepUnusedDataFor: 60, // Keep cache for 1 minute
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
  endpoints: (builder) => ({
    loginWithEmail: builder.mutation<LoginResponse, LoginRequest>({
      queryFn: async (credentials) => {
        try {
          const csrfToken = await getCsrfToken();
          
          const requestBody = {
            email: credentials.email?.trim().toLowerCase(),
            encrypted_password: credentials.password
          };
          
          const response = await axiosInstance.post('/auth/login', requestBody, {
            headers: {
              'X-CSRF-Token': csrfToken,
            }
          });
          
          return { data: response.data };
        } catch (error: any) {
          // Handle axios error structure
          if (error.response) {
            return { error: { status: error.response.status, data: error.response.data } };
          } else if (error.request) {
            return { error: { status: 'FETCH_ERROR', error: 'Network error' } };
          } else {
            return { error: { status: 'FETCH_ERROR', error: String(error) } };
          }
        }
      },
      transformErrorResponse: (response: FetchBaseQueryError) => {
        const data = response.data as any;
        
        console.error('❌ Login API Error - Detailed Info:', {
          status: response.status,
          statusText: response.statusText,
          data: data,
          baseUrl: import.meta.env.VITE_API_BASE_URL,
          fullResponse: response
        });
        
        // Log the raw error data for debugging
        if (data) {
          console.error('❌ Raw error data:', JSON.stringify(data, null, 2));
        }
        
        // Use backend error message first, then fallback based on status
        let message = data?.error || data?.message || data?.errors;
        
        if (!message) {
          if (response.status === 400) {
            message = 'Invalid request format. Please check your credentials.';
          } else if (response.status === 404) {
            message = 'Email not registered. Please sign up first.';
          } else if (response.status === 401) {
            message = 'Invalid credentials or missing API key.';
          } else if (response.status === 403) {
            message = 'CSRF token invalid. Please try again.';
          } else if (response.status === 500) {
            message = 'Server error. This might be a password format issue. Check server logs.';
          } else if (response.status === 'CSRF_FETCH_FAILED') {
            message = 'Failed to get security token. Please try again.';
          } else {
            message = 'Login failed. Please try again.';
          }
        }
        
        return {
          status: response.status,
          message,
          originalError: response
        };
      },

      invalidatesTags: ['User', 'Session'],
    }),


    // Send OTP - Enhanced with comprehensive error handling
    sendOtp: builder.mutation<OtpResponse, OtpRequest>({
      query: ({ type, ...data }) => ({
        url: `/auth/send-otp/${type}`,
        method: 'POST',
        body: data,
      }),
      
      // ENHANCED: Transform server errors with proper handling
      transformErrorResponse: (response: FetchBaseQueryError) => {
        const serverData = (response.data as any) || {};
        const status = response.status;
        
        console.error('SendOTP API Error:', { status, serverData });
        
        return {
          status,
          data: {
            success: false,
            message: serverData.message || getDefaultSendOtpErrorMessage(status),
            error: serverData.error || getDefaultSendOtpErrorCode(status),
            
            // Pass through specific error fields
            ...(serverData.code && { code: serverData.code }),
            ...(serverData.retryAfter && { retryAfter: serverData.retryAfter }),
            ...(serverData.maxAttempts && { maxAttempts: serverData.maxAttempts }),
            ...(serverData.waitTimeSeconds && { waitTimeSeconds: serverData.waitTimeSeconds }),
            
            timestamp: new Date().toISOString(),
          }
        };
      },
      
      // Enhanced logging
      onQueryStarted: async (arg, { queryFulfilled }) => {
        console.log(`🚀 Sending OTP to ${arg.type}:`, arg[arg.type]);
        
        try {
          const { data } = await queryFulfilled;
          console.log(`✅ OTP sent successfully:`, data);
        } catch (error: any) {
          console.error(`❌ SendOTP failed:`, error.data);
        }
      },
    }),

    // Verify OTP
    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
      // TODO: Uncomment this when API is ready
      // query: (data) => ({
      //   url: `/auth/verify-otp`,
      //   method: 'POST',
      //   body: data,
      // }),
      // transformResponse: (response: any) => ({
      //   success: response.success || false,
      //   verified: response.verified || false,
      //   message: response.message || 'Verification completed',
      //   // Include authentication data only for login context
      //   ...(response.user && { user: response.user }),
      //   ...(response.token && { token: response.token }),
      //   ...(response.refreshToken && { refreshToken: response.refreshToken }),
      //   // Rate limiting fields
      //   ...(response.attemptsRemaining !== undefined && { attemptsRemaining: response.attemptsRemaining }),
      //   ...(response.maxAttempts && { maxAttempts: response.maxAttempts }),
      //   ...(response.error && { error: response.error }),
      //   ...(response.retryAfter && { retryAfter: response.retryAfter }),
      //   ...(response.lockExpiresAt && { lockExpiresAt: response.lockExpiresAt }),
      //   ...(response.waitTimeSeconds && { waitTimeSeconds: response.waitTimeSeconds }),
      //   // 410 OTP Expired fields
      //   ...(response.expiryTime && { expiryTime: response.expiryTime }),
      // }),

      // MOCK IMPLEMENTATION with Rate Limiting - Remove when API is ready
      queryFn: async (data) => {
        console.log('🔐 Mock OTP Verification - Request:', data);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock OTP attempt tracking (in real app, this would be server-side)
        const otpSessionKey = `otp_attempts_${data.otpId}`;
        const storedAttempts = JSON.parse(localStorage.getItem(otpSessionKey) || '{"attempts": 0, "lockedUntil": null}');
        
        // Check if session is locked
        if (storedAttempts.lockedUntil && new Date() < new Date(storedAttempts.lockedUntil)) {
          const waitTimeSeconds = Math.ceil((new Date(storedAttempts.lockedUntil).getTime() - new Date().getTime()) / 1000);
          console.log('🚫 Mock OTP - Session Locked:', { waitTimeSeconds });
          
          return {
            error: {
              status: 423,
              data: {
                success: false,
                verified: false,
                message: `Too many failed attempts. You are blocked for ${Math.ceil(waitTimeSeconds / 60)} minutes.`,
                error: 'OTP_SESSION_LOCKED',
                lockExpiresAt: storedAttempts.lockedUntil,
                waitTimeSeconds,
                attemptsRemaining: 0,
                maxAttempts: 3
              }
            }
          };
        }

        // Mock OTP validation (accept "123456" as valid)
        const isValidOtp = data.otp === '123456';
        
        if (!isValidOtp) {
          const newAttempts = storedAttempts.attempts + 1;
          const maxAttempts = 3;
          const attemptsRemaining = maxAttempts - newAttempts;
          
          console.log('❌ Mock OTP - Invalid OTP:', { attempts: newAttempts, remaining: attemptsRemaining });
          
          if (newAttempts >= maxAttempts) {
            // Lock the session for 5 minutes
            const lockExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
            localStorage.setItem(otpSessionKey, JSON.stringify({
              attempts: newAttempts,
              lockedUntil: lockExpiresAt
            }));
            
            return {
              error: {
                status: 429,
                data: {
                  success: false,
                  verified: false,
                  message: 'Too many failed attempts. OTP session expired. Please request a new OTP.',
                  error: 'OTP_ATTEMPTS_EXCEEDED',
                  attemptsRemaining: 0,
                  maxAttempts,
                  retryAfter: 300,
                  lockExpiresAt
                }
              }
            };
          } else {
            // Update attempt count
            localStorage.setItem(otpSessionKey, JSON.stringify({
              attempts: newAttempts,
              lockedUntil: null
            }));
            
            const message = attemptsRemaining === 1 
              ? `Invalid OTP. ${attemptsRemaining} attempt remaining.`
              : `Invalid OTP. ${attemptsRemaining} attempts remaining.`;
            
            return {
              error: {
                status: 401,
                data: {
                  success: false,
                  verified: false,
                  message,
                  attemptsRemaining,
                  maxAttempts
                }
              }
            };
          }
        }
        
        // Clear attempts on successful verification
        localStorage.removeItem(otpSessionKey);
        
        // Mock successful verification response
        let mockResponse: VerifyOtpResponse = {
          success: true,
          verified: true,
          message: `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} verification successful`
        };
        
        // Add login context data if context is 'login'
        if (data.context === 'login') {
          const mockUser = {
            id: "mock_user_" + Date.now(),
            mobile: data.type === 'mobile' ? "9876543210" : "",
            email: data.type === 'email' ? "user@example.com" : undefined,
            name: "Mock User",
            role: "User"
          };
          
          mockResponse = {
            ...mockResponse,
            user: mockUser,
            token: "mock_jwt_token_" + btoa(JSON.stringify(mockUser)),
            refreshToken: "mock_refresh_token_" + Date.now()
          };
        }
        
        console.log('✅ Mock OTP Verification Success:', mockResponse);
        return { data: mockResponse };
      },
      
      invalidatesTags: (_result, error, arg) => 
        arg.context === 'login' && !error ? ['User', 'Session'] : [],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // Logout
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User', 'Session'],
      // Always succeed locally even if server fails
      transformResponse: () => ({ success: true }),
      transformErrorResponse: () => ({ success: true }),
    }),

    // Get Current User (for session validation)
    getCurrentUser: builder.query<LoginResponse['user'], void>({
      query: () => '/auth/me',
      providesTags: ['User'],
      // Stale time for user data
      keepUnusedDataFor: 300, // 5 minutes
    }),

    // Refresh Token
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useLoginWithEmailMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useRefreshTokenMutation,
} = authApiSlice;

// Export API slice reducer
export default authApiSlice.reducer;

// Selectors for optimized data access
export const selectAuthApiState = (state: any) => state.authApi;
export const selectIsLoading = (state: any) => {
  const apiState = selectAuthApiState(state);
  return Object.values(apiState.mutations || {}).some((mutation: any) => mutation?.status === 'pending');
};

// Utility functions for common operations
export const createOtpRequest = (
  type: 'mobile' | 'email' | 'whatsapp',
  value: string,
  context: 'registration' | 'login' | 'forgot-password' = 'registration'
): OtpRequest => ({
  type,
  [type]: value,
  context,
});

export const createVerifyOtpRequest = (
  otpId: string,
  otp: string,
  type: 'mobile' | 'email' | 'whatsapp',
  context: 'registration' | 'login' | 'forgot-password' = 'registration'
): VerifyOtpRequest => ({
  otpId,
  otp,
  type,
  context,
});

// Helper functions for SendOTP error handling
const getDefaultSendOtpErrorMessage = (status: number | string): string => {
  switch (status) {
    case 400:
      return 'Invalid request. Please check your mobile number.';
    case 429:
      return 'Too many OTP requests. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    case 'FETCH_ERROR':
      return 'Network error. Please check your internet connection.';
    case 'PARSING_ERROR':
      return 'Invalid server response. Please try again.';
    case 'TIMEOUT_ERROR':
      return 'Request timeout. Please try again.';
    default:
      return 'Failed to send OTP. Please try again.';
  }
};

const getDefaultSendOtpErrorCode = (status: number | string): string => {
  switch (status) {
    case 400:
      return 'INVALID_REQUEST';
    case 429:
      return 'RATE_LIMITED';
    case 500:
      return 'SERVER_ERROR';
    case 'FETCH_ERROR':
      return 'NETWORK_ERROR';
    case 'PARSING_ERROR':
      return 'PARSING_ERROR';
    case 'TIMEOUT_ERROR':
      return 'TIMEOUT_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
};
