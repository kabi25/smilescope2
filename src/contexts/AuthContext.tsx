"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  profilePicture: string;
  age: string;
  phone: string;
  country: string;
}

interface AuthContextType {
  user: User | null;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
  resetUser: () => void;
}

const defaultUser: User = {
  id: '',
  username: '',
  email: '',
  profilePicture: '/default-avatar.png',
  age: '',
  phone: '',
  country: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('smilescope_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  // Save user to localStorage when changed
  useEffect(() => {
    if (user) {
      localStorage.setItem('smilescope_user', JSON.stringify(user));
    }
  }, [user]);

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : { ...defaultUser, ...userData });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smilescope_user');
  };

  const resetUser = () => {
    setUser(null);
    localStorage.removeItem('smilescope_user');
  };

  return (
    <AuthContext.Provider value={{ user, updateUser, logout, resetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 