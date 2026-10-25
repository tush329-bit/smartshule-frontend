// src/components/UserManagement.jsx
import { useState } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    password: '',
    role: 'teacher'
  });
  const [message, setMessage] = useState('');

      const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('🔄 Creating user...');

    try {
      // ✅ FIX: Get the token using the correct key
      const token = localStorage.getItem('smartshule_token');

      if (!token) {
        setMessage('❌ You must be logged in as an Admin to create users.');
        return;
      }

      const res = await axios.post('http://localhost:5000/api/v1/auth/register', formData, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      setMessage(`✅ ${res.data.message}`);
      setFormData({ first_name: '', last_name: '', phone_number: '', password: '', role: 'teacher' });
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to create user.'}`);
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-orange-500 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">👤 User Management (Admin Only)</h2>
      
      {message && <p className={`mb-4 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
          <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
          <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
          <input required type="tel" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full p-2 border rounded" placeholder="0712345678" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
          <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-2 border rounded" placeholder="Min 6 characters" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Role</label>
          <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-2 border rounded">
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 font-semibold">
            Create User Account
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 mt-3">Note: Only Admins can create accounts. Parents/Students cannot self-register.</p>
    </div>
  );
};

export default UserManagement;