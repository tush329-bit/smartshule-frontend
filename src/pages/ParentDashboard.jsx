// src/pages/ParentDashboard.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosClient'; // ✅ Uses our centralized, auto-authenticated client
import DashboardLayout from '../components/DashboardLayout';
import FeeStatement from '../components/FeeStatement';
import ParentAcademics from '../components/ParentAcademics';

const ParentDashboard = () => {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        // ✅ No need for manual headers! The axiosClient interceptor adds the Bearer token automatically.
        const res = await api.get('/students/my-children');
        setChildren(res.data.children || []);
        if (res.data.children?.length > 0) {
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

  if (loading) {
    return <p className="text-center py-10 text-gray-500 dark:text-gray-400">Loading your children's data...</p>;
  }

  if (children.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-300 rounded">
        <h2 className="text-xl font-bold">No Children Linked</h2>
        <p className="mt-2">Please contact the school administration to link your account to your child's profile.</p>
      </div>
    );
  }

  const sections = selectedChild ? [
    {
      id: 'academics',
      label: 'Academic Progress',
      icon: '📚',
      content: <ParentAcademics studentId={selectedChild.id} />
    },
    {
      id: 'finance',
      label: 'Fee Statement',
      icon: '💰',
      content: <FeeStatement studentId={selectedChild.id} />
    }
  ] : [];

  return (
    <div className="space-y-4">
      {children.length > 1 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Child:</label>
            <div className="flex gap-3 flex-wrap">
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    selectedChild?.id === child.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {child.admission_number} ({child.relationship})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <DashboardLayout
        title={`Parent Portal — ${selectedChild?.admission_number || 'Student'}`}
        subtitle={`Class: ${selectedChild?.class_id || 'N/A'} • Gender: ${selectedChild?.gender || 'N/A'}`}
        icon="👨‍👩‍👧"
        sections={sections}
      />
    </div>
  );
};

export default ParentDashboard;