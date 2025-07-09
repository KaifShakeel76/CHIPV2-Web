import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getCsrfToken, clearCsrfToken } from './csrfToken';

// Environment variables - no fallbacks for security
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Validate required environment variables
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}

if (!API_KEY) {
  throw new Error('VITE_API_KEY environment variable is required');
}

// Create centralized Axios instance

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Always include cookies for CSRF token validation
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    [import.meta.env.VITE_API_KEY_HEADER_NAME || 'X-API-KEY']: API_KEY,
  },
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000, // Configurable timeout
});

// Request interceptor to add CSRF token
axiosInstance.interceptors.request.use(
  async (config) => {
    // Skip CSRF token for GET requests and the CSRF token endpoint itself
    if (config.method?.toUpperCase() === 'GET' || config.url?.includes('/auth/csrf_token')) {
      return config;
    }

    try {
      const csrfToken = await getCsrfToken(true); // Force fresh token for each request
      const csrfHeaderName = import.meta.env.VITE_CSRF_HEADER_NAME || 'X-CSRF-Token';
      config.headers[csrfHeaderName] = csrfToken;
      console.log('🔐 Added FRESH CSRF token to request:', csrfHeaderName, csrfToken);
    } catch (error) {
      console.error('Failed to get CSRF token for request:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Successfully resolved response
    return response;
  },
  (error: AxiosError) => {
    // Handle different error cases
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login
          console.error('🔒 Unauthorized access - redirecting to login');
          window.location.href = import.meta.env.VITE_DEFAULT_LOGOUT_REDIRECT || '/login';
          break;
        case 429:
          // Too Many Requests - show alert
          alert('⚠️ Too many requests. Please try again later.');
          break;
        case 403:
          // Forbidden - CSRF token might be invalid, clear cache and retry
          console.error('🚫 Forbidden - CSRF token might be invalid, clearing cache');
          clearCsrfToken();
          break;
        default:
          console.error(`❌ API Error [${status}]:`, error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error('🌐 Network error:', error.message);
    } else {
      // Other error
      console.error('⚠️ Request error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;