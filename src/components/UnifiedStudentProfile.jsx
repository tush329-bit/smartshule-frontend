// src/components/UnifiedStudentProfile.jsx
import { useState } from 'react';
import FeeStatement from './FeeStatement';
import DisciplineTab from './DisciplineTab';
import AcademicsTab from './AcademicsTab';
import LibraryTab from './LibraryTab';
import ReportCardModal from './ReportCardModal';

const UnifiedStudentProfile = ({ studentId, studentName, admissionNumber }) => {
  const [activeTab, setActiveTab] = useState('finance');
  const [showReportModal, setShowReportModal] = useState(false);

  const tabs = [
    { id: 'finance', label: '💰 Fees & Finance' },
    { id: 'discipline', label: '⚠️ Discipline' },
    { id: 'academics', label: '📚 Academics' },
    { id: 'library', label: '📖 Library' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row justify-between items-start md:items-center border-l-4 border-blue-600">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{studentName || 'Student Profile'}</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Admission No: <span className="font-mono font-semibold text-gray-700 dark:text-gray-300">{admissionNumber || 'N/A'}</span>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full h-fit">
            Active Student
          </span>
          <button
            onClick={() => setShowReportModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            📄 Generate Report
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 mb-6 space-x-1 md:space-x-4 no-scrollbar" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-t ${
              activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'finance' && <FeeStatement studentId={studentId} />}
        {activeTab === 'discipline' && <DisciplineTab studentId={studentId} />}
        {activeTab === 'academics' && <AcademicsTab studentId={studentId} />}
        {activeTab === 'library' && <LibraryTab studentId={studentId} />}
      </div>

      {showReportModal && (
        <ReportCardModal 
          studentId={studentId} 
          studentName={studentName} 
          admissionNumber={admissionNumber} 
          onClose={() => setShowReportModal(false)} 
        />
      )}
    </div>
  );
};

export default UnifiedStudentProfile;