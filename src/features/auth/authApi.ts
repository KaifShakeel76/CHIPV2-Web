// src/features/auth/authApi.ts
import axios from 'axios';
import PasswordSecurity from '@/components/auth/utils/passwordSecurity';

const API_URL = 'https://api.freeapi.app/api/v1/users';

export const loginUser = async (username: string, password: string) => {
  // Hash password before sending over network for security
  const hashedPassword = PasswordSecurity.hashPassword(password);
  
  const response = await axios.post(
    `${API_URL}/login`,
    {
      username, // 👈 FreeAPI expects "username"
      password: hashedPassword,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true, // 👈 required if using cookies
    }
  );
  return response.data;
};
