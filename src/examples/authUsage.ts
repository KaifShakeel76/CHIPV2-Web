// Example usage of the secure API utilities
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getCurrentUser,
  handleApiError,
  getCsrfToken,
  clearCsrfToken
} from '../lib/api';

// Example: User Registration
export const handleUserRegistration = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  try {
    const response = await registerUser(userData);
    console.log('Registration successful:', response);
    return response;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('Registration failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Example: User Login
export const handleUserLogin = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await loginUser(credentials);
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('Login failed:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Example: User Logout
export const handleUserLogout = async () => {
  try {
    await logoutUser();
    console.log('Logout successful');
    // Redirect to login page or update app state
    window.location.href = '/login';
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('Logout failed:', errorMessage);
    // Still clear token cache and redirect even if logout fails
    clearCsrfToken();
    window.location.href = '/login';
  }
};

// Example: Get Current User
export const handleGetCurrentUser = async () => {
  try {
    const response = await getCurrentUser();
    console.log('Current user:', response);
    return response;
  } catch (error) {
    const errorMessage = handleApiError(error);
    console.error('Failed to get current user:', errorMessage);
    throw new Error(errorMessage);
  }
};

// Example: Manual CSRF token management
export const handleManualCsrfOperations = async () => {
  try {
    // Get CSRF token manually
    const token = await getCsrfToken();
    console.log('CSRF token:', token);
    
    // Clear token cache (e.g., on logout)
    clearCsrfToken();
    console.log('CSRF token cleared');
  } catch (error) {
    console.error('CSRF token operation failed:', error);
  }
};

// Example: React Component Integration
export const useAuthOperations = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await handleUserLogin({ email, password });
      // Update app state, redirect, etc.
      return result;
    } catch (error) {
      // Handle error in UI (show toast, etc.)
      console.error('Login error:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await handleUserLogout();
      // Update app state, redirect, etc.
    } catch (error) {
      // Handle error in UI
      console.error('Logout error:', error);
    }
  };

  return {
    handleLogin,
    handleLogout,
  };
};