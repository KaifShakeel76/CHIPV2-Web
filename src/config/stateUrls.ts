// State-specific API URL configuration
export interface StateUrlConfig {
  baseUrl: string;
  stateCode: string;
  stateName: string;
}

export const stateUrlConfigs: Record<string, StateUrlConfig> = {
  KA: {
    baseUrl: import.meta.env.VITE_KA_API_URL || (() => {
      throw new Error('VITE_KA_API_URL environment variable is required');
    })(),
    stateCode: 'KA',
    stateName: 'Karnataka'
  },
  MH: {
    baseUrl: import.meta.env.VITE_MH_API_URL || (() => {
      throw new Error('VITE_MH_API_URL environment variable is required');
    })(),
    stateCode: 'MH', 
    stateName: 'Maharashtra'
  },
  RJ: {
    baseUrl: import.meta.env.VITE_RJ_API_URL || (() => {
      throw new Error('VITE_RJ_API_URL environment variable is required');
    })(),
    stateCode: 'RJ',
    stateName: 'Rajasthan'
  }
};

// Get base URL for specific state
export const getStateBaseUrl = (stateCode: string): string => {
  const config = stateUrlConfigs[stateCode.toUpperCase()];
  if (!config) {
    throw new Error(`No configuration found for state: ${stateCode}. Available states: ${Object.keys(stateUrlConfigs).join(', ')}`);
  }
  return config.baseUrl;
};

// Auto-detect state from deployment URL or environment
export const getCurrentStateCode = (): string => {
  // 1. Check environment variable (set during build)
  const envState = import.meta.env.VITE_DEFAULT_STATE;
  if (envState && stateUrlConfigs[envState]) {
    return envState;
  }
  
  // 2. Detect from domain name
  const hostname = window.location.hostname;
  if (hostname.includes('ka.') || hostname.includes('karnataka')) {
    return 'KA';
  }
  if (hostname.includes('mh.') || hostname.includes('maharashtra')) {
    return 'MH';
  }
  if (hostname.includes('rj.') || hostname.includes('rajasthan')) {
    return 'RJ';
  }
  
  // 3. Try to get from URL params (for testing)
  const urlParams = new URLSearchParams(window.location.search);
  const stateFromUrl = urlParams.get('state');
  if (stateFromUrl && stateUrlConfigs[stateFromUrl.toUpperCase()]) {
    return stateFromUrl.toUpperCase();
  }
  
  // 4. Try to get from localStorage
  const storedState = localStorage.getItem('selectedState');
  if (storedState && stateUrlConfigs[storedState]) {
    return storedState;
  }
  
  // 5. Default fallback
  return 'KA';
};

// Get the default state for current deployment
export const getDeploymentState = (): string => {
  return import.meta.env.VITE_DEFAULT_STATE || getCurrentStateCode();
};