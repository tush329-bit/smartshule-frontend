// src/components/principal/TeacherManagement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherManagement = () => {
  const [teachers, setTeachers] = useState([]);
  const [message, setMessage] = useState('');

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('smartshule_token')}` });

  const fetchTeachers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/v1/users/teachers', { headers: headers() });
      setTeachers(res.data.teachers);
    } catch (error) {
      console.error('Failed to fetch teachers');
    }
  };

  useEffect(() => { fetchTeachers(); }, []);

  const handleReset = async (id, name) => {
    if (!confirm(`Reset password for ${name} to 'Password123'?`)) return;
    try {
      await axios.post(`http://localhost:5000/api/v1/users/teachers/${id}/reset-password`, {}, { headers: headers() });
      setMessage(`✅ Password reset for ${name}.`);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed'}`);
    }
  };

  // ✅ NEW: DELETE TEACHER FUNCTION
  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to DELETE ${name}? This action cannot be undone.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/users/teachers/${id}`, { headers: headers() });
      setMessage(`✅ ${name} has been removed from the system.`);
      fetchTeachers(); // Refresh the list
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to delete teacher.'}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-600">
      <h3 className="text-lg font-bold mb-4">👨‍🏫 Teaching Staff Management</h3>
      {message && <p className={`mb-3 p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone Number</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map(t => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{t.first_name} {t.last_name}</td>
                <td className="p-3">{t.phone_number}</td>
                <td className="p-3 text-right space-x-2">
                  <button 
                    onClick={() => handleReset(t.id, `${t.first_name} ${t.last_name}`)} 
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-xs hover:bg-yellow-600"
                  >
                    🔑 Reset Password
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id, `${t.first_name} ${t.last_name}`)} 
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {teachers.length === 0 && (
              <tr><td colSpan="3" className="p-6 text-center text-gray-500">No teachers found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherManagement;