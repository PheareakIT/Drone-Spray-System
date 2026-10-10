import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    // Purge any lingering user object from localStorage for security
    localStorage.removeItem('user');

    try {
      // Validate session with the backend server via httpOnly cookie or token header
      const data = await authApi.getMe();
      if (data && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signin = async (email, password) => {
    const res = await authApi.signin({ email, password });
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    // Keep user state strictly in React memory (never write user object to localStorage)
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const signup = async (userData) => {
    const res = await authApi.signup(userData);
    if (res.token) {
      localStorage.setItem('token', res.token);
    }
    // Keep user state strictly in React memory
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const signout = async () => {
    try {
      await authApi.signout();
    } catch (err) {
      console.warn('Signout request warning:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout, checkAuth }}>
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
