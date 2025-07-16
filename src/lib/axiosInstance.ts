import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { getCsrfToken, clearCsrfToken } from './csrfToken';

// Environment variables - no fallbacks for security
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const API_VERSION = import.meta.env.VITE_BACKEND_API_VERSION || 'v1';
const API_BASE_URL = `${BACKEND_BASE_URL}/${API_VERSION}`;

const API_KEY = import.meta.env.VITE_API_KEY;

// Validate required environment variables
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}

if (!API_KEY) {
  throw new Error('VITE_API_KEY environment variable is required');
}

// Create centralized Axios instance
console.log('🌐 Axios Instance Configuration:', {
  baseURL: API_BASE_URL,
  backendBaseUrl: BACKEND_BASE_URL,
  apiVersion: API_VERSION,
  apiKey: API_KEY ? 'Present' : 'Missing',
  fullUrl: API_BASE_URL
});

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
    // Log the actual request URL being called
    console.log('🌐 Axios Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: config.headers,
      withCredentials: config.withCredentials,
      cookies: document.cookie
    });
    
    // Skip CSRF token for GET requests, CSRF token endpoint, and Skip-CSRF requests
    if (config.method?.toUpperCase() === 'GET' || 
        config.url?.includes('/auth/csrf_token') ||
        config.headers?.['Skip-CSRF']) {
      console.log('🔐 Skipping CSRF token for:', config.url);
      return config;
    }

    const csrfHeaderName = import.meta.env.VITE_CSRF_HEADER_NAME || 'X-CSRF-Token';
    
    // Skip if CSRF token is already present in headers
    if (config.headers && config.headers[csrfHeaderName]) {
      console.log('🔐 CSRF token already present in headers, skipping interceptor');
      return config;
    }

    try {
      const csrfToken = await getCsrfToken(false); // Use cached token if available
      config.headers[csrfHeaderName] = csrfToken;
      console.log('🔐 Added CSRF token to request:', csrfHeaderName, csrfToken);
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
    // Log response headers to debug cookie setting
    if (response.config.url?.includes('/auth/csrf_token') || response.config.url?.includes('/auth/register')) {
      console.log('📡 Response Headers:', response.headers);
      console.log('🍪 Set-Cookie from response:', response.headers['set-cookie']);
      console.log('🍪 Current document cookies:', document.cookie);
    }
    
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
          // Forbidden - CSRF token might be invalid, clear cache
          console.error('🚫 Forbidden - CSRF token might be invalid, clearing cache');
          clearCsrfToken();
          
          // If this was a CSRF token error, we could retry once with a fresh token
          if (error.response?.data?.message?.includes('CSRF') || 
              error.response?.data?.error?.includes('CSRF')) {
            console.log('🔄 CSRF token error detected, will need fresh token for next request');
          }
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