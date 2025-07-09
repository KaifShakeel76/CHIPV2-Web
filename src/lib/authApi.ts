import axiosInstance from './axiosInstance';
import { getCsrfToken, clearCsrfToken } from './csrfToken';
import { AxiosResponse } from 'axios';

// Auth API Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Helper function to make secure API calls with CSRF token
 */
const makeSecureRequest = async <T>(
  method: 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any
): Promise<AxiosResponse<T>> => {
  try {
    // Get CSRF token before making the request
    const csrfToken = await getCsrfToken();
    
    // Make the request with CSRF token in headers
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      headers: {
        [import.meta.env.VITE_CSRF_HEADER_NAME || 'X-CSRF-Token']: csrfToken,
      },
    });
    
    return response;
  } catch (error: any) {
    // If we get a 403 (likely invalid CSRF token), clear the cache and retry once
    if (error.response?.status === 403) {
      console.log('🔐 CSRF token may be invalid, clearing cache and retrying...');
      clearCsrfToken();
      
      try {
        const newCsrfToken = await getCsrfToken();
        const retryResponse = await axiosInstance.request<T>({
          method,
          url,
          data,
          headers: {
            [import.meta.env.VITE_CSRF_HEADER_NAME || 'X-CSRF-Token']: newCsrfToken,
          },
        });
        return retryResponse;
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
        throw retryError;
      }
    }
    
    throw error;
  }
};

/**
 * Register a new user
 */
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    console.log('📝 Registering user...', { email: userData.email });
    
    const response = await makeSecureRequest<AuthResponse>('POST', import.meta.env.VITE_AUTH_REGISTER_ENDPOINT || '/auth/register', userData);
    
    console.log('✅ User registration successful');
    return response.data;
  } catch (error: any) {
    console.error('❌ User registration failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('🔐 Logging in user...', { email: credentials.email });
    
    const response = await makeSecureRequest<AuthResponse>('POST', import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/auth/login', credentials);
    
    console.log('✅ User login successful');
    return response.data;
  } catch (error: any) {
    console.error('❌ User login failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

/**
 * Logout current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    console.log('🚪 Logging out user...');
    
    await makeSecureRequest('POST', import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT || '/auth/logout');
    
    // Clear CSRF token cache after successful logout
    clearCsrfToken();
    
    console.log('✅ User logout successful');
  } catch (error: any) {
    console.error('❌ User logout failed:', error.response?.data || error.message);
    
    // Clear CSRF token cache even if logout fails
    clearCsrfToken();
    
    throw new Error(error.response?.data?.message || 'Logout failed');
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    console.log('👤 Fetching current user...');
    
    const response = await axiosInstance.get<AuthResponse>(import.meta.env.VITE_AUTH_ME_ENDPOINT || '/auth/me');
    
    console.log('✅ Current user fetched successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch current user:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch user');
  }
};

/**
 * Update user profile
 */
export const updateUser = async (userData: Partial<RegisterData>): Promise<AuthResponse> => {
  try {
    console.log('📝 Updating user profile...');
    
    const response = await makeSecureRequest<AuthResponse>('PUT', import.meta.env.VITE_AUTH_PROFILE_ENDPOINT || '/auth/profile', userData);
    
    console.log('✅ User profile updated successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ User profile update failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Profile update failed');
  }
};

/**
 * Change user password
 */
export const changePassword = async (currentPassword: string, newPassword: string): Promise<AuthResponse> => {
  try {
    console.log('🔑 Changing user password...');
    
    const response = await makeSecureRequest<AuthResponse>('PUT', import.meta.env.VITE_AUTH_PASSWORD_ENDPOINT || '/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    
    console.log('✅ Password changed successfully');
    return response.data;
  } catch (error: any) {
    console.error('❌ Password change failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Password change failed');
  }
};