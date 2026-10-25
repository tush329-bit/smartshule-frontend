// src/pages/ParentDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ParentAcademics from '../components/ParentAcademics';
import ParentFeeStatement from '../components/parent/ParentFeeStatement';

   const API = import.meta.env.VITE_API_URL;

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [activeTab, setActiveTab] = useState('academics');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const token = localStorage.getItem('smartshule_token');
        const res = await axios.get(`${API}/students/my-children`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChildren(res.data.children);
        if (res.data.children.length > 0) {
          setSelectedChild(res.data.children[0]);
        }
      } catch (error) {
        console.error('Failed to fetch children:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchChildren();
  }, []);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading your children's data...</p>;

  if (children.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
        <h2 className="text-xl font-bold">No Children Linked</h2>
        <p className="mt-2">Please contact the school administration to link your account to your child's profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-emerald-600">
        <h2 className="text-2xl font-bold text-gray-800">Parent Portal</h2>
        <p className="text-gray-600 mt-1">Monitor your child's academic progress securely.</p>
      </div>

      {/* Child Selector */}
      {children.length > 1 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Child:</label>
          <div className="flex gap-3 flex-wrap">
            {children.map(child => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  selectedChild?.id === child.id 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {child.admission_number} ({child.relationship})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Child Profile View */}
      {selectedChild && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Learner: {selectedChild.admission_number}</h3>
              <p className="text-sm text-gray-500">Class: {selectedChild.class_id} • Gender: {selectedChild.gender}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab('academics')}
              className={`flex-1 py-3 text-sm font-medium ${activeTab === 'academics' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              📚 Academic Progress
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`flex-1 py-3 text-sm font-medium ${activeTab === 'finance' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              💰 Fee Statement
            </button>
          </div>

             {/* Tab Content */}
   <div className="p-6">
     {activeTab === 'academics' && <ParentAcademics studentId={selectedChild.id} />}
     
     {/* ✅ REPLACED PLACEHOLDER WITH REAL COMPONENT */}
     {activeTab === 'finance' && <ParentFeeStatement admissionNumber={selectedChild.admission_number} />}
   </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;