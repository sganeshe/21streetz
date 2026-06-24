import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const data = await authService.getProfile();
          const currentUser = data.user || data;
          
          if (currentUser.role !== 'ADMIN') {
            throw new Error("Unauthorized access. Admin privileges required.");
          }
          
          setUser(currentUser); 
        } catch (error) {
          console.error("Auth check failed or unauthorized:", error);
          localStorage.removeItem('accessToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    const currentUser = data.user || data;

    // FIXED: Changed to match backend "ADMIN"
    if (currentUser.role !== 'ADMIN') {
      throw new Error("Access denied. Only administrators can log in here.");
    }

    localStorage.setItem('accessToken', data.token);
    setUser(currentUser);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);