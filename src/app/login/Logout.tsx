import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate for redirecting after logout
import { useAuth } from './AuthProvider.tsx';
import { logout } from '../../infra/api/authService.ts';


const Logout: React.FC = () => {
  const { setIsTokenValid } = useAuth(); // Use handleLogout from context

  useEffect(() => {
    const logoutUser = async () => {
      await logout();
    };

    logoutUser();
    setIsTokenValid(false)
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
  });

  // After logout, redirect the user to the login page
  return <Navigate to="/login" />;
};

export default Logout;