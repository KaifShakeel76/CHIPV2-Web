import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import SecureStorage from '@/components/auth/utils/secureStorage';
import { useRefreshTokenMutation } from '@/features/auth/authApiSlice';
import { AUTH_CONFIG } from '@/components/auth/config/auth.config';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

interface RootState {
  auth: {
    isAuthenticated: boolean;
    token: string | null;
    user: any;
  };
}

const AuthGuard: React.FC<AuthGuardProps> = memo(({ 
  children, 
  requireAuth = true, 
  redirectTo = AUTH_CONFIG.ROUTES.LOGIN 
}) => {
  const authState = useSelector((state: RootState) => ({
    isAuthenticated: state.auth.isAuthenticated,
    token: state.auth.token
  }));
  const [refreshToken] = useRefreshTokenMutation();
  const [isValidating, setIsValidating] = useState(true);
  const location = useLocation();
  const dispatch = useDispatch();

  const validateAuthentication = useCallback(async () => {
    try {
      // Check if we have stored tokens
      const tokenData = SecureStorage.getTokens();
      
      if (!tokenData) {
        setIsValidating(false);
        return;
      }

      // Validate token format
      if (!SecureStorage.isValidTokenFormat(tokenData.token)) {
        SecureStorage.clearTokens();
        dispatch({ type: 'auth/logout' });
        setIsValidating(false);
        return;
      }

      // Check if token is about to expire (refresh if < threshold left)
      const tokenExpiry = SecureStorage.getTokenExpiry(tokenData.token);
      const refreshThreshold = Date.now() + AUTH_CONFIG.TOKEN.REFRESH_THRESHOLD;
      
      if (tokenExpiry && tokenExpiry < refreshThreshold) {
        try {
          await refreshToken({ refreshToken: tokenData.refreshToken }).unwrap();
          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Token refresh failed:', error);
          SecureStorage.clearTokens();
          dispatch({ type: 'auth/logout' });
        }
      }

      setIsValidating(false);
    } catch (error) {
      console.error('Auth validation error:', error);
      SecureStorage.clearTokens();
      dispatch({ type: 'auth/logout' });
      setIsValidating(false);
    }
  }, [refreshToken, dispatch]);

  useEffect(() => {
    validateAuthentication();
  }, [validateAuthentication]);

  const loadingComponent = useMemo(() => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Validating session...</span>
    </div>
  ), []);

  // Show loading while validating
  if (isValidating) {
    return loadingComponent;
  }

  // Handle authentication requirements
  if (requireAuth && !authState.isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If already authenticated and trying to access login/register, redirect to dashboard
  if (!requireAuth && authState.isAuthenticated && 
      (location.pathname === AUTH_CONFIG.ROUTES.LOGIN || location.pathname === AUTH_CONFIG.ROUTES.REGISTER)) {
    return <Navigate to={AUTH_CONFIG.ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
});

export default AuthGuard;

// Higher-order component for easier usage
export const withAuthGuard = (
  Component: React.ComponentType<any>, 
  options?: { requireAuth?: boolean; redirectTo?: string }
) => {
  return (props: any) => (
    <AuthGuard {...options}>
      <Component {...props} />
    </AuthGuard>
  );
};

// Hook for checking auth status
export const useAuthStatus = () => {
  const authState = useSelector((state: RootState) => state.auth);
  
  return useMemo(() => ({
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    token: authState.token,
    isTokenValid: authState.token ? SecureStorage.isValidTokenFormat(authState.token) : false,
    tokenExpiry: authState.token ? SecureStorage.getTokenExpiry(authState.token) : null,
  }), [authState]);
};