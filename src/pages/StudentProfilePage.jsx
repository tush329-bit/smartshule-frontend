// src/pages/StudentProfilePage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import UnifiedStudentProfile from '../components/UnifiedStudentProfile';

const StudentProfilePage = () => {
  // ✅ Dynamically get the student ID from the URL
  const { studentId } = useParams(); 
  const navigate = useNavigate();

  // If no ID is in the URL, redirect back to the class directory
  if (!studentId) {
    navigate('/dashboard/class-directory');
    return null;
  }

  return (
    <div className="p-4">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
      >
        ← Back to Directory
      </button>
      {/* ✅ Pass the dynamic ID to the live component */}
      <UnifiedStudentProfile 
        studentId={studentId} 
        studentName="Loading..." // The component will fetch real data
        admissionNumber="Loading..." 
      />
    </div>
  );
};

export default StudentProfilePage;