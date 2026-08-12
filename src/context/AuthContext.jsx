import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authApi.getUser());
  const [token, setToken] = useState(() => localStorage.getItem('setu_token'));
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const isLoggedIn = !!token;

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.login(email, password);
      authApi.saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.message || 'Login failed.';
      // Server unreachable → nudge user toward demo
      const isNetwork = msg.toLowerCase().includes('server') || msg.toLowerCase().includes('timeout');
      setAuthError(
        isNetwork
          ? `${msg} Use the "Try Demo" button below to explore the app without a backend.`
          : msg
      );
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const data = await authApi.register(payload);
      authApi.saveSession(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      const msg = err.message || 'Registration failed.';
      const isNetwork = msg.toLowerCase().includes('server') || msg.toLowerCase().includes('timeout');
      setAuthError(
        isNetwork
          ? `${msg} Use the "Try Demo" button below to explore the app without a backend.`
          : msg
      );
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authApi.clearSession();
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  /* Demo login — skips backend, works offline */
  const demoLogin = useCallback((role) => {
    const DEMO_USERS = {
      patient:      { _id: 'demo-patient',  name: 'Ramsevak Kumar',   role: 'patient',      email: 'patient@demo.com',  village: 'Sonbhadra, UP' },
      doctor:       { _id: 'demo-doctor',   name: 'Dr. Rajesh Sharma',role: 'doctor',       email: 'doctor@demo.com',   specialization: 'General Physician' },
      healthworker: { _id: 'demo-hw',       name: 'Kavita Devi',      role: 'healthworker', email: 'worker@demo.com',   village: 'Bhojpur, Bihar' },
    };
    const demoUser = DEMO_USERS[role];
    const demoToken = `demo-token-${role}`;
    authApi.saveSession(demoToken, demoUser);
    setToken(demoToken);
    setUser(demoUser);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token, isLoggedIn,
      authLoading, authError, setAuthError,
      login, register, logout, demoLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
