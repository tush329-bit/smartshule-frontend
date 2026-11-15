// src/pages/ParentDashboard.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import FeeStatement from '../components/FeeStatement'; // ✅ The LIVE component
import ParentAcademics from '../components/ParentAcademics'; // ✅ The LIVE chart component

const ParentDashboard = () => {
  // In a real app, this comes from your AuthContext (e.g., user.children[0])
  // For now, we use a placeholder ID. Replace this with the actual logged-in parent's child ID.
  const [selectedChild] = useState({
    id: 'a965c9d3-e6d7-499f-ab4a-edcb3d7a847e', // Replace with real child UUID
    name: 'Grace Achieng'
  });

  if (!selectedChild) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">No child profile found. Please contact the school administration.</p>
      </div>
    );
  }

  return (
    <DashboardLayout 
      title={`${selectedChild.name}'s Dashboard`} 
      subtitle="Fees, Academics, and Library Overview" 
      icon="👨‍👩‍👧"
    >
      <div className="space-y-8">
        {/* ✅ LIVE Fee Statement: Fetches real M-Pesa history and balance */}
        <FeeStatement studentId={selectedChild.id} />
        
        {/* ✅ LIVE Academics: Fetches real term-over-term analytics */}
        <ParentAcademics studentId={selectedChild.id} />
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;