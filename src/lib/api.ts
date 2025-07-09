// Re-export all API utilities from a single entry point
export { default as axiosInstance } from './axiosInstance';
export { getCsrfToken, clearCsrfToken, isCsrfTokenCached, getCachedCsrfToken } from './csrfToken';
export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser, 
  updateUser, 
  changePassword 
} from './authApi';

// Export types for convenience
export type { AxiosResponse, AxiosError } from 'axios';

// Common API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Generic error handler for API calls
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.errors) {
    const firstError = Object.values(error.response.data.errors)[0];
    return Array.isArray(firstError) ? firstError[0] : String(firstError);
  }
  
  return error.message || 'An unexpected error occurred';
};

// Utility to check if user is authenticated
export const isAuthenticated = (): boolean => {
  // This would typically check for session cookie or token
  // For now, we'll assume cookies are being managed by the browser
  return document.cookie.includes('session') || document.cookie.includes('auth');
};