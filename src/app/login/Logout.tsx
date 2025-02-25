import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.tsx';
import { logout } from '../../infra/api/authService.ts';

const Logout: React.FC = () => {
  const { setIsTokenValid } = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      await logout();
      setIsTokenValid(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('role');
    };

    logoutUser();
  }, []);

  return <Navigate to="/login" />;
};

export default Logout;