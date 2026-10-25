// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('smartshule_user');
    const token = localStorage.getItem('smartshule_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem('smartshule_user');
        localStorage.removeItem('smartshule_token');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('smartshule_token');
    localStorage.removeItem('smartshule_user');
    setUser(null);
  };

  // ✅ CRITICAL: Make sure setUser is included in the value object
  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};