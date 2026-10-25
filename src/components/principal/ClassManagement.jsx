import { useState, useEffect } from 'react';
import axios from 'axios';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [grade, setGrade] = useState('Grade 7');
  const [stream, setStream] = useState('East');
  const [message, setMessage] = useState('');

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('smartshule_token')}` });

  const fetchClasses = async () => {
    const res = await axios.get('http://localhost:5000/api/v1/classes', { headers: headers() });
    setClasses(res.data.classes);
  };

  useEffect(() => { fetchClasses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/v1/classes', { grade, stream }, { headers: headers() });
      setMessage(`✅ ${grade} ${stream} created!`);
      fetchClasses();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed'}`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(`Delete ${id}? This cannot be undone.`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/v1/classes/${id}`, { headers: headers() });
      setMessage(`✅ ${id} deleted.`);
      fetchClasses();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-600">
        <h3 className="text-lg font-bold mb-4">➕ Add New Class / Stream</h3>
        {message && <p className={`mb-3 p-2 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        <form onSubmit={handleCreate} className="flex gap-4 items-end">
          <select value={grade} onChange={e => setGrade(e.target.value)} className="p-2 border rounded">
            {['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'].map(g => <option key={g}>{g}</option>)}
          </select>
          <select value={stream} onChange={e => setStream(e.target.value)} className="p-2 border rounded">
            {['East', 'West', 'North', 'South', 'Central', 'A', 'B', 'C'].map(s => <option key={s}>{s}</option>)}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Create Class</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-4">🏫 Active Classes</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {classes.map(c => (
            <div key={c.id} className="bg-gray-50 p-4 rounded border flex justify-between items-center">
              <span className="font-semibold text-gray-800">{c.id}</span>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 hover:text-red-700 text-sm font-bold">🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ClassManagement;