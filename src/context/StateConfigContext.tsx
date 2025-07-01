import React, { createContext, useContext, ReactNode } from 'react';
import { StateConfig } from '../types/state';
import { useStateConfig } from '../hooks/useStateConfig';

interface StateConfigContextType {
  stateConfig: StateConfig;
  loading: boolean;
  error: string | null;
  refetchStateConfig: (newStateCode?: string) => Promise<void>;
}

const StateConfigContext = createContext<StateConfigContextType | undefined>(undefined);

interface StateConfigProviderProps {
  children: ReactNode;
  initialStateCode?: string;
}

export const StateConfigProvider: React.FC<StateConfigProviderProps> = ({ 
  children, 
  initialStateCode 
}) => {
  const stateConfigData = useStateConfig(initialStateCode);

  return (
    <StateConfigContext.Provider value={stateConfigData}>
      {children}
    </StateConfigContext.Provider>
  );
};

export const useStateConfigContext = () => {
  const context = useContext(StateConfigContext);
  if (context === undefined) {
    throw new Error('useStateConfigContext must be used within a StateConfigProvider');
  }
  return context;
};