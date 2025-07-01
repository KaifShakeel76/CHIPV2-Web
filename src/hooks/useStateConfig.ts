import { useState, useEffect } from 'react';
import { StateConfig } from '../types/state';
import { stateApi } from '../api/stateApi';
import { getStateConfig as getFallbackConfig } from '../config/stateConfigs';

export const useStateConfig = (initialStateCode?: string) => {
  const [stateConfig, setStateConfig] = useState<StateConfig>(getFallbackConfig('KA'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStateConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const config = await stateApi.getStateConfig(initialStateCode);
        setStateConfig(config);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch state config';
        setError(errorMessage);
        console.error('State config fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStateConfig();
  }, [initialStateCode]);

  const refetchStateConfig = async (newStateCode?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = await stateApi.getStateConfig(newStateCode);
      setStateConfig(config);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch state config';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    stateConfig,
    loading,
    error,
    refetchStateConfig
  };
};