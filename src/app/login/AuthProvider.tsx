import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateToken } from '../../infra/api/authService.ts';

interface AuthContextType {
  isTokenValid: boolean | null;
  setIsTokenValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (location.pathname === "/login") {
      return;
    }
    const checkToken = async () => {
      const isValid = await validateToken();
      setIsTokenValid(isValid);

      if (isValid) {
        const storedRole = localStorage.getItem('role');
        setRole(storedRole);
      } else {
        setRole(null);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isTokenValid, setIsTokenValid, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};