import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get('/profile');
      if (response.data.status) {
        setUser(response.data.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initApp = async () => {
      try {
        // First, get CSRF token to setup the secure environment
        await api.get('/csrf-token');
        // Then, check if user is logged in
        await checkAuth();
      } catch (error) {
        console.error("System initialization failed", error);
        setLoading(false);
      }
    };
    
    initApp();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    if (response.data.status) {
      setUser(response.data.data);
    }
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/register', { name, email, password });
    if (response.data.status) {
      setUser(response.data.data);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await api.get('/logout');
      setUser(null);
      return { status: true };
    } catch (error) {
      return { status: false, msg: error.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

