// src/contexts/AuthContext.tsx
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
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setUser(data.data);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Construct the login URL with the current URL as the redirect
    const currentUrl = window.location.href;
    const loginUrl = `https://virtuescroll.cloudflareaccess.com/cdn-cgi/access/login?redirect_url=${encodeURIComponent(currentUrl)}`;
    window.location.href = loginUrl;
  };

  const logout = async () => {
    try {
      // First, call our backend logout endpoint
      await fetch(`${config.API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      
      // Then redirect to Cloudflare Access logout
      const currentUrl = window.location.href;
      const logoutUrl = `https://virtuescroll.cloudflareaccess.com/cdn-cgi/access/logout?redirect_url=${encodeURIComponent(currentUrl)}`;
      window.location.href = logoutUrl;
      
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