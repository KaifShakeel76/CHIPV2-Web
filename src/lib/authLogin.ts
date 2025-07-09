import { loginUser } from './authApi';
import PasswordSecurity from '../components/auth/utils/passwordSecurity';

// Interface for login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface for secure login request (matches backend expectation)
interface SecureLoginRequest {
  email: string;
  encrypted_password: string;
}

// Interface for login response
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    mobile?: string;
    name: string;
    role: string;
  };
  token?: string;
  refreshToken?: string;
}

/**
 * Secure email login with password encryption and CSRF protection
 */
export const emailLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    console.log('🔐 Starting secure email login process...');
    
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Encrypt password before transmission (if encryption is enabled)
    const encryptedPassword = PasswordSecurity.hashPassword(credentials.password);
    
    console.log('🔒 Password encrypted for transmission');

    // Create the secure login request
    const loginRequest: SecureLoginRequest = {
      email: credentials.email,
      encrypted_password: encryptedPassword, // Backend expects 'encrypted_password' field
    };

    // Use the secure authApi loginUser function which handles CSRF automatically
    const response = await loginUser(loginRequest as any);

    console.log('✅ Login successful');
    
    return {
      success: true,
      message: response.message || 'Login successful',
      user: response.user ? {
        id: String(response.user.id), // Convert to string
        email: response.user.email,
        mobile: undefined, // Not in current response
        name: response.user.firstName + ' ' + response.user.lastName,
        role: 'User', // Default role
      } : undefined,
      token: undefined, // Not in current AuthResponse - will be handled by cookies
      refreshToken: undefined, // Not in current AuthResponse
    };

  } catch (error: any) {
    console.error('❌ Email login failed:', error);
    
    // Extract meaningful error message
    let errorMessage = 'Login failed';
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.response?.status === 404) {
      errorMessage = 'Email not registered. Please sign up first.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Account access denied. Please contact support.';
    } else if (error.response?.status === 429) {
      errorMessage = 'Too many login attempts. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Check user approval status after login
 */
export const checkUserApprovalStatus = async (userId: string, token: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/user-details/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        [import.meta.env.VITE_API_KEY_HEADER_NAME || 'X-API-KEY']: import.meta.env.VITE_API_KEY || '',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user approval status');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking approval status:', error);
    throw error;
  }
};