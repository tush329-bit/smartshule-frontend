// src/components/teacher/StudentAnalytics.jsx
import ClassComparison from './ClassComparison';

const StudentAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
        <h3 className="font-bold text-gray-800">📊 Advanced Performance Analytics</h3>
        <p className="text-sm text-gray-600">Use this tool to compare class streams, track student trends, and analyze subject performance over time.</p>
      </div>
      {/* This renders the powerful comparison engine we built earlier */}
      <ClassComparison />
    </div>
  );
};

export default StudentAnalytics;