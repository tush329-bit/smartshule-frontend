// src/api/axiosClient.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartshule_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically log out and redirect to /login if a 401 Unauthorized occurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('smartshule_token');
      localStorage.removeItem('smartshule_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ⚠️ CRITICAL: This line MUST be here. Do not delete it!
export default api;