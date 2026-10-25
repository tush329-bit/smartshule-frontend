// src/components/principal/TeacherAllocations.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

   const API = import.meta.env.VITE_API_URL;

const TeacherAllocations = () => {
  const [allocations, setAllocations] = useState([]);
  const [options, setOptions] = useState({ teachers: [], classes: [], subjects: [] });
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [teacherId, setTeacherId] = useState('');
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [term, setTerm] = useState('Term 1');

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('smartshule_token')}` });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [allocRes, optRes] = await Promise.all([
        axios.get(`${API}/allocations`, { headers: headers() }),
        axios.get(`${API}/allocations/options`, { headers: headers() })
      ]);
      setAllocations(allocRes.data.allocations);
      setOptions(optRes.data);
    } catch (error) {
      toast.error('Failed to load allocation data');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!teacherId || !classId || !subjectId || !term) {
      return toast.error('Please fill in all fields');
    }

    try {
      await axios.post(`${API}/allocations`, {
        teacher_id: teacherId, class_id: classId, subject_id: subjectId, term
      }, { headers: headers() });
      
      toast.success('Class assigned to teacher successfully!');
      fetchData(); // Refresh list
      setTeacherId(''); setClassId(''); setSubjectId(''); // Reset form
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add allocation');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this class allocation from the teacher?')) return;

    try {
      await axios.delete(`${API}/allocations/${id}`, { headers: headers() });
      toast.success('Allocation removed successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove allocation');
    }
  };

  if (loading) return <div className="text-center py-8 text-gray-500">Loading allocations...</div>;

  return (
    <div className="space-y-6">
      {/* Add Allocation Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-indigo-600">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">➕ Assign Class to Teacher</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Teacher</label>
            <select value={teacherId} onChange={e => setTeacherId(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <option value="">Select Teacher</option>
              {options.teachers.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Class / Stream</label>
            <select value={classId} onChange={e => setClassId(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <option value="">Select Class</option>
              {options.classes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</label>
            <select value={subjectId} onChange={e => setSubjectId(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600">
              <option value="">Select Subject</option>
              {options.subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          // Inside TeacherAllocations.jsx, replace the Class select with this:
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">CBC Grade / Class</label>
            <select 
              value={classId} 
              onChange={e => setClassId(e.target.value)} 
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select CBC Grade</option>
              
              <optgroup label="👶 Early Childhood Development (ECDE)">
                <option value="pp1">Pre-Primary 1 (PP1)</option>
                <option value="pp2">Pre-Primary 2 (PP2)</option>
              </optgroup>
              
              <optgroup label="🎒 Lower & Upper Primary (Grade 1-6)">
                <option value="grade-1">Grade 1</option>
                <option value="grade-2">Grade 2</option>
                <option value="grade-3">Grade 3</option>
                <option value="grade-4">Grade 4</option>
                <option value="grade-5">Grade 5</option>
                <option value="grade-6">Grade 6</option>
              </optgroup>
              
              <optgroup label="🏫 Junior Secondary School (JSS - Grade 7-9)">
                <option value="grade-7">Grade 7</option>
                <option value="grade-8">Grade 8</option>
                <option value="grade-9">Grade 9</option>
              </optgroup>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 font-semibold transition">
            Assign
          </button>
        </form>
      </div>

      {/* Allocations List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📋 Current Teacher Allocations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left dark:text-gray-300">Teacher</th>
                <th className="p-3 text-left dark:text-gray-300">Class</th>
                <th className="p-3 text-left dark:text-gray-300">Subject</th>
                <th className="p-3 text-left dark:text-gray-300">Term</th>
                <th className="p-3 text-right dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(a => (
                <tr key={a.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="p-3 font-medium dark:text-gray-200">{a.first_name} {a.last_name}</td>
                  <td className="p-3 dark:text-gray-300">{a.class_id}</td>
                  <td className="p-3 dark:text-gray-300">{a.subject_name}</td>
                  <td className="p-3 dark:text-gray-300">{a.term}</td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-xs bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded transition"
                    >
                      🗑️ Remove
                    </button>
                  </td>
                </tr>
              ))}
              {allocations.length === 0 && (
                <tr><td colSpan="5" className="p-6 text-center text-gray-500 dark:text-gray-400">No allocations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeacherAllocations;