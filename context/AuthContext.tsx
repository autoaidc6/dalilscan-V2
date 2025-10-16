import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { useUser } from './UserContext';
import { useLog } from './LogContext';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('dalilscan-auth') === 'true';
    } catch {
      return false;
    }
  });

  const { resetUser } = useUser();
  const { resetLog } = useLog();

  useEffect(() => {
    try {
        localStorage.setItem('dalilscan-auth', String(isAuthenticated));
    } catch (error) {
        console.error("Could not persist authentication state:", error);
    }
  }, [isAuthenticated]);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    // Clear all user-related data upon logout
    resetUser();
    resetLog();
    // Clear auth flag last
    setIsAuthenticated(false);
    // Also explicitly remove from storage for a full reset
    try {
        localStorage.removeItem('dalilscan-user');
        localStorage.removeItem('dalilscan-log');
        localStorage.removeItem('dalilscan-auth');
    } catch (error) {
        console.error("Could not clear localStorage on logout:", error);
    }
  }, [resetUser, resetLog]);

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);

  return (
    <AuthContext.Provider value={value}>
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
