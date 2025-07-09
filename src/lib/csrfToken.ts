import axiosInstance from './axiosInstance';


let csrfTokenCache: string | null = null;


interface CsrfTokenResponse {
  csrf_token: string;
}


export const getCsrfToken = async (): Promise<string> => {
  // Return cached token if available
  if (csrfTokenCache) {
    console.log('🔐 Using cached CSRF token');
    return csrfTokenCache;
  }

  try {
    const csrfEndpoint = import.meta.env.VITE_AUTH_CSRF_ENDPOINT || '/auth/csrf_token';
    console.log('🔐 Fetching new CSRF token from server...');
    console.log('🔗 CSRF endpoint:', csrfEndpoint);
    console.log('🔗 Full CSRF URL:', `${import.meta.env.VITE_API_BASE_URL}${csrfEndpoint}`);
    
    const response = await axiosInstance.get<CsrfTokenResponse>(csrfEndpoint);
    
    if (response.data && response.data.csrf_token) {
      csrfTokenCache = response.data.csrf_token;
      console.log('✅ CSRF token fetched and cached successfully');
      return csrfTokenCache;
    } else {
      throw new Error('Invalid CSRF token response format');
    }
  } catch (error) {
    console.error('❌ Failed to fetch CSRF token:', error);
    throw new Error('Failed to fetch CSRF token');
  }
};


export const clearCsrfToken = (): void => {
  csrfTokenCache = null;
  console.log('🔐 CSRF token cache cleared');
};


export const isCsrfTokenCached = (): boolean => {
  return csrfTokenCache !== null;
};


export const getCachedCsrfToken = (): string | null => {
  return csrfTokenCache;
};