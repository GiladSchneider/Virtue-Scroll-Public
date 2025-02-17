import React, { createContext, useContext, useState, useEffect } from 'react';
import { config } from '../config';

interface User {
  id: string;
  email: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/auth/me`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setUser({
          id: data.data.id,
          email: data.data.email,
          displayName: data.data.display_name,
          username: data.data.username,
          avatarUrl: data.data.avatar_url
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    const currentUrl = window.location.href;
    window.location.href = `${config.API_URL}/auth/login?redirect_url=${encodeURIComponent(currentUrl)}`;
  };

  const logout = async () => {
    try {
      const currentUrl = window.location.href;
      window.location.href = `${config.API_URL}/auth/logout?redirect_url=${encodeURIComponent(currentUrl)}`;
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};