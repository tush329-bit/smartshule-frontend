// src/components/TeacherAllocation.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const TeacherAllocation = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    teacher_id: '',
    class_id: '',
    subject_id: '',
    term: 'Term 1, 2024'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('smartshule_token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // ✅ Use the unified options endpoint we built for better performance
        const res = await axios.get(`${API}/allocations/options`, { headers });
        
        setTeachers(res.data.teachers);
        setClasses(res.data.classes);
        setSubjects(res.data.subjects);
      } catch (error) {
        console.error('❌ Failed to fetch allocation data:', error);
        setMessage('❌ Failed to load data. Check your connection.');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('🔄 Allocating teacher...');
    try {
      const token = localStorage.getItem('smartshule_token');
      await axios.post(`${API}/allocations`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Teacher allocated successfully!');
      setFormData({ teacher_id: '', class_id: '', subject_id: '', term: 'Term 1, 2024' });
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to allocate.'}`);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-purple-600 mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🔗 Teacher Allocation (CBC)</h2>
      
      {message && (
        <p className={`mb-4 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Select Teacher</label>
          <select 
            required 
            value={formData.teacher_id} 
            onChange={e => setFormData({...formData, teacher_id: e.target.value})} 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="">Choose a teacher...</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Class / Stream</label>
          <select 
            required 
            value={formData.class_id} 
            onChange={e => setFormData({...formData, class_id: e.target.value})} 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="">Choose a class...</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.id}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Learning Area</label>
          <select 
            required 
            value={formData.subject_id} 
            onChange={e => setFormData({...formData, subject_id: e.target.value})} 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option value="">Choose subject...</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Term</label>
          <select 
            required 
            value={formData.term} 
            onChange={e => setFormData({...formData, term: e.target.value})} 
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            <option>Term 1, 2024</option>
            <option>Term 2, 2024</option>
            <option>Term 3, 2024</option>
          </select>
        </div>

        <div className="lg:col-span-4">
          <button type="submit" className="w-full bg-purple-600 text-white py-2.5 rounded hover:bg-purple-700 font-semibold transition focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            🔗 Allocate Teacher
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherAllocation;