const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface FetchWithAuthOptions extends RequestInit {
  baseUrl?: string;
}

export const fetchWithAuth = async (url: string, options: FetchWithAuthOptions = {}) => {
  const token = localStorage.getItem('token');
  const { baseUrl, ...fetchOptions } = options;
  const apiBaseUrl = baseUrl || API_BASE_URL;
  const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...fetchOptions.headers
  };

  const response = await fetch(fullUrl, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};