import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: Student | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (studentId: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (studentId: string, password: string, name: string, email: string, department?: string, yearOfStudy?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Student | null>(() => {
    const saved = localStorage.getItem('studymate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('studymate_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('studymate_token');
      if (storedToken) {
        try {
          const profile = await api.get<Student>('/auth/me');
          setUser(profile);
          localStorage.setItem('studymate_user', JSON.stringify(profile));
        } catch (error) {
          console.warn('Session expired or backend not reached', error);
          // If network error, preserve saved user for seamless offline preview, but if 401 it was cleared
        }
      }
      setIsLoading(false);
    };

    const handleExpired = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('studymate-auth-expired', handleExpired);
    checkAuth();

    return () => {
      window.removeEventListener('studymate-auth-expired', handleExpired);
    };
  }, []);

  const login = async (studentId: string, password: string, rememberMe = true) => {
    setIsLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/login', {
        student_id: studentId.trim(),
        password,
      });

      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('studymate_token', res.access_token);
      localStorage.setItem('studymate_user', JSON.stringify(res.user));
      if (rememberMe) {
        localStorage.setItem('studymate_remember_id', studentId.trim());
      } else {
        localStorage.removeItem('studymate_remember_id');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    studentId: string,
    password: string,
    name: string,
    email: string,
    department?: string,
    yearOfStudy?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await api.post<AuthResponse>('/auth/register', {
        student_id: studentId.trim(),
        password,
        name: name.trim(),
        email: email.trim(),
        department,
        year_of_study: yearOfStudy,
      });

      setToken(res.access_token);
      setUser(res.user);
      localStorage.setItem('studymate_token', res.access_token);
      localStorage.setItem('studymate_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('studymate_token');
      localStorage.removeItem('studymate_user');
      setToken(null);
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await api.get<Student>('/auth/me');
      setUser(profile);
      localStorage.setItem('studymate_user', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
