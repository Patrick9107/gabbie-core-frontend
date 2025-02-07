import React, { createContext, useState, useEffect, useContext } from 'react';
import { validateToken } from '../../infra/api/authService.ts'; // Import logout function

// Define context type
interface AuthContextType {
  isTokenValid: boolean | null;
  setIsTokenValid: React.Dispatch<React.SetStateAction<boolean | null>>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type for the children prop
interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Validate token on mount
    const checkToken = async () => {
      const isValid = await validateToken();
      setIsTokenValid(isValid);
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isTokenValid, setIsTokenValid }}>
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