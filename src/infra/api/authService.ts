// services/authService.ts
import axios from 'axios';
import { API_BASE_URL } from '../../../apiConfig.ts';

export const loginUser = async (data: { username: string; password: string }): Promise<{ token: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Expecting { token: 'abc123' }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 'Unknown';
      const message = error.response?.data?.message ?? error.message;
      throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error(`Unexpected error: ${error}`);
  }
};

export const validateToken = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/validate`,
      {},
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    return response.status === 200; // Returns true if the token is valid
  } catch (error) {
    console.error("Token validation failed:", error);
    return false;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('authToken');

    if (!token) {
      throw new Error('No token found, cannot log out.');
    }

    await axios.post(
      'http://localhost:5120/api/auth/logout',
      {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
          'Content-Type': 'application/json',
        },
      }
    );

    localStorage.removeItem('authToken');
    localStorage.removeItem('role');

    console.log('Logout successful');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};