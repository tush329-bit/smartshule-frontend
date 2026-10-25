// src/components/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();
    const payload = { phone_number: cleanPhone, password: cleanPassword };
    
    // ✅ Audit 2 Complete: Debug log removed for production security
    
    try {
      const response = await axios.post(`${API}/auth/login`, payload);
      
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('smartshule_token', token);
        localStorage.setItem('smartshule_user', JSON.stringify(user));
        setUser(user);
        toast.success(`Welcome back, ${user.first_name || user.name}!`);
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(response.data.message || 'Invalid credentials.');
      }
    } catch (error) {
      console.error('❌ FULL LOGIN ERROR OBJECT:', error);
      console.error('❌ BACKEND ERROR RESPONSE:', error.response?.data);
      toast.error(error.response?.data?.message || 'Invalid credentials. Check browser console (F12) for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-5xl mb-4">🏫</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SmartShule</h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 0700000000"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs space-y-1">
          <p className="font-semibold text-gray-700 dark:text-gray-300">Demo Credentials:</p>
          <p className="text-gray-600 dark:text-gray-400">Super Admin: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">0700000000</code> / <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Password123</code></p>
          <p className="text-gray-600 dark:text-gray-400">Principal: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">0711111111</code> / <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded">Password123</code></p>
        </div>
      </div>
    </div>
  );
};

export default Login;