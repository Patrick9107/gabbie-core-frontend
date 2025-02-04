// services/authService.ts
import { API_BASE_URL } from '../../../apiConfig.ts';

export const loginUser = async (data: { username: string; password: string }): Promise<{ token: string }> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json(); // z.B. { token: 'abc123' }
};


