// src/api/axiosClient.js
import axios from 'axios';

// 1. Create a custom Axios instance with our live API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: { 
    'Content-Type': 'application/json' 
  },
});

// 2. REQUEST INTERCEPTOR: Automatically attach the JWT token to EVERY request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartshule_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. RESPONSE INTERCEPTOR: Automatically handle expired tokens (401 Unauthorized)
api.interceptors.response.use(
  (response) => {
    // If the request is successful, just return the data
    return response;
  },
  (error) => {
    // If the backend says "401 Unauthorized" (token expired or invalid)
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      // Clear the bad data
      localStorage.removeItem('smartshule_token');
      localStorage.removeItem('smartshule_user');
      // Kick the user back to the login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;