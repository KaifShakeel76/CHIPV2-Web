// src/features/auth/authApi.ts - Updated for Rails backend
import axios from 'axios';
import PasswordSecurity from '@/components/auth/utils/passwordSecurity';

// Rails backend configuration
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || 'http://127.0.0.1:3000';
const BACKEND_API_VERSION = import.meta.env.VITE_BACKEND_API_VERSION || 'v1';
const API_URL = `${BACKEND_BASE_URL}/${BACKEND_API_VERSION}`;
const API_KEY = import.meta.env.VITE_API_KEY;

// Get CSRF token for Rails API
export const getCsrfToken = async () => {
  const response = await axios.get(`${API_URL}/auth/csrf_token`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  return response.data.csrf_token;
};

// Updated login function for Rails backend
export const loginUser = async (email: string, password: string) => {
  // Hash password before sending over network for security
  const hashedPassword = PasswordSecurity.hashPassword(password);
  
  // Get CSRF token first
  const csrfToken = await getCsrfToken();
  
  const response = await axios.post(
    `${API_URL}/auth/login`,
    {
      email, // Rails API expects "email"
      encrypted_password: hashedPassword,
    },
    {
      headers: {
        'X-API-KEY': API_KEY,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true, // Required for session cookies
    }
  );
  return response.data;
};

// User registration for Rails backend
export const registerUser = async (userData: {
  email: string;
  first_name: string;
  last_name: string;
  mobile: string;
  whatsapp_number: string;
  geography_type: string;
  geography_id: string;
  org: string;
  password: string;
}) => {
  // Encrypt password before sending
  const encryptedPassword = PasswordSecurity.hashPassword(userData.password);
  
  // Create full_name by concatenating first and last name
  const full_name = `${userData.first_name} ${userData.last_name}`;
  
  // Get CSRF token first
  const csrfToken = await getCsrfToken();
  
  const response = await axios.post(
    `${API_URL}/auth/register`,
    {
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      full_name: full_name,
      mobile: userData.mobile,
      whatsapp_number: userData.whatsapp_number,
      geography_type: userData.geography_type,
      geography_id: userData.geography_id,
      org: userData.org,
      encrypted_password: encryptedPassword,
    },
    {
      headers: {
        'X-API-KEY': API_KEY,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  // Get CSRF token first
  const csrfToken = await getCsrfToken();
  
  const response = await axios.delete(`${API_URL}/auth/logout`, {
    headers: {
      'X-API-KEY': API_KEY,
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

// OTP Verification APIs

// Mobile OTP
export const sendMobileOtp = async () => {
  const response = await axios.get(`${API_URL}/mob_otps`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

export const verifyMobileOtp = async (otp: string) => {
  const response = await axios.post(`${API_URL}/mob_otps/verify`, 
    { otp },
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const resendMobileOtp = async () => {
  const response = await axios.post(`${API_URL}/mob_otps/resend`, 
    {},
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// WhatsApp OTP
export const sendWhatsAppOtp = async () => {
  const response = await axios.get(`${API_URL}/wa_otps`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

export const verifyWhatsAppOtp = async (otp: string) => {
  const response = await axios.post(`${API_URL}/wa_otps/verify`, 
    { otp },
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const resendWhatsAppOtp = async () => {
  const response = await axios.post(`${API_URL}/wa_otps/resend`, 
    {},
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// Email OTP
export const sendEmailOtp = async () => {
  const response = await axios.get(`${API_URL}/email_otps`, {
    headers: {
      'X-API-KEY': API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    withCredentials: true,
  });
  return response.data;
};

export const verifyEmailOtp = async (otp: string) => {
  const response = await axios.post(`${API_URL}/email_otps/verify`, 
    { otp },
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

export const resendEmailOtp = async () => {
  const response = await axios.post(`${API_URL}/email_otps/resend`, 
    {},
    {
      headers: {
        'X-API-KEY': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
    }
  );
  return response.data;
};

// COMMENTED OUT: Old FreeAPI implementation
// const OLD_API_URL = 'https://api.freeapi.app/api/v1/users';
// export const loginUserOld = async (username: string, password: string) => {
//   // Hash password before sending over network for security
//   const hashedPassword = PasswordSecurity.hashPassword(password);
//   
//   const response = await axios.post(
//     `${OLD_API_URL}/login`,
//     {
//       username, // 👈 FreeAPI expects "username"
//       password: hashedPassword,
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       withCredentials: true, // 👈 required if using cookies
//     }
//   );
//   return response.data;
// };
