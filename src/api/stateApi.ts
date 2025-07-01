import { StateConfig } from '../types/state';
import { fetchWithAuth } from '../components/auth/utils/fetchWithAuth';
import { getStateBaseUrl, getCurrentStateCode } from '../config/stateUrls';

export interface StateApiResponse {
  success: boolean;
  data: StateConfig;
  message?: string;
}

export interface StatesListApiResponse {
  success: boolean;
  data: StateConfig[];
  message?: string;
}

export const stateApi = {
  // Get state config by user location or state code
  getStateConfig: async (stateCode?: string): Promise<StateConfig> => {
    try {
      const targetStateCode = stateCode || getCurrentStateCode();
      const baseUrl = getStateBaseUrl(targetStateCode);
      
      const endpoint = stateCode 
        ? `/api/states/${stateCode}`
        : '/api/states/current'; 
      
      const result: StateApiResponse = await fetchWithAuth(endpoint, { baseUrl });

      if (!result.success) {
        throw new Error(result.message || 'Failed to get state configuration');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching state config:', error);
      // Fallback to Karnataka config
      const { getStateConfig } = await import('../config/stateConfigs');
      return getStateConfig('KA');
    }
  },

  getAllStates: async (): Promise<StateConfig[]> => {
    try {
      const currentStateCode = getCurrentStateCode();
      const baseUrl = getStateBaseUrl(currentStateCode);
      
      const result: StatesListApiResponse = await fetchWithAuth('/api/states', { baseUrl });
      return result.data || [];
    } catch (error) {
      console.error('Error fetching all states:', error);
      return [];
    }
  }
};