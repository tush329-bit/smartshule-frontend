import { useState, useEffect } from 'react';
import axios from 'axios';

const MyClasses = () => {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    const fetchAllocations = async () => {
      try {
        const token = localStorage.getItem('smartshule_token');
        const res = await axios.get('http://localhost:5000/api/v1/allocations/my-classes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllocations(res.data.allocations);
      } catch (error) { console.error(error); }
    };
    fetchAllocations();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-teal-600">
      <h3 className="text-lg font-bold text-gray-800 mb-4">📚 My Allocated Classes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allocations.map((a, i) => (
          <div key={i} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-xl font-bold text-teal-800">{a.class_id}</p>
            <p className="text-sm text-teal-600">{a.subject_name}</p>
            <p className="text-xs text-gray-500 mt-2">{a.term}</p>
          </div>
        ))}
        {allocations.length === 0 && <p className="text-gray-500 col-span-full text-center py-8">No classes allocated yet.</p>}
      </div>
    </div>
  );
};
export default MyClasses;