// src/components/DisciplineTab.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const DisciplineTab = ({ studentId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [action, setAction] = useState('');
  const [message, setMessage] = useState('');

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`${API}/discipline/student/${studentId}`, { headers: headers() });
      setRecords(res.data.records);
    } catch (error) {
      console.error('Failed to fetch discipline records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) fetchRecords();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('🔄 Recording...');
    try {
      await axios.post(`${API}/discipline/record`, {
        student_id: studentId,
        incident_type: type,
        description,
        action_taken: action
      }, { headers: headers() });
      
      setMessage('✅ Incident recorded successfully.');
      setType(''); setDescription(''); setAction('');
      fetchRecords(); 
    } catch (error) {
      setMessage('❌ Failed to record incident.');
    }
  };

  if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading records...</p>;

  return (
    <div className="space-y-6">
      {/* Add New Record Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Log New Incident</h3>
        
        {message && (
          <p className={`mb-4 text-sm p-2 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Incident Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition">
              <option value="">Select Type...</option>
              <option value="Lateness">Lateness</option>
              <option value="Uniform Violation">Uniform Violation</option>
              <option value="Disruption">Classroom Disruption</option>
              <option value="Bullying">Bullying</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows="3" className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="Details of the incident..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Action Taken</label>
            <input type="text" value={action} onChange={(e) => setAction(e.target.value)} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500 outline-none transition" placeholder="e.g., Verbal warning, Sent to Deputy" />
          </div>
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-semibold focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">Record Incident</button>
        </form>
      </div>

      {/* History List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Incident History</h3>
        {records.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No disciplinary records found. Great job!</p>
        ) : (
          <div className="space-y-4">
            {records.map((record, index) => (
              <div key={index} className="border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 p-4 rounded-r-lg">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100">{record.incident_type}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(record.incident_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{record.description}</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-2">Action: {record.action_taken}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Recorded by: {record.recorded_by_name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisciplineTab;