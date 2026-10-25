// src/components/StudentDirectory.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import UnifiedStudentProfile from './UnifiedStudentProfile';

const StudentDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Build query string dynamically based on filters
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedClass) params.append('class_id', selectedClass);

      const res = await axios.get(`http://localhost:5000/api/v1/students?${params.toString()}`);
      setStudents(res.data.students);
    } catch (error) {
      console.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, selectedClass]); // Re-fetch whenever filters change!

  // If a student is selected, show their Unified Profile
  if (selectedStudent) {
    return (
      <div>
        <button 
          onClick={() => setSelectedStudent(null)} 
          className="mb-4 text-blue-600 hover:underline flex items-center gap-1"
        >
          ← Back to Student Directory
        </button>
        <UnifiedStudentProfile 
          studentId={selectedStudent.id}
          studentName={`Student ${selectedStudent.admission_number}`} // In Phase 7, we'll add names to the students table
          admissionNumber={selectedStudent.admission_number}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Directory</h2>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <input 
          type="text" 
          placeholder="Search Admission No..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Classes/Streams</option>
          <option value="Grade-8-East">Grade 8 East</option>
          <option value="Grade-7-West">Grade 7 West</option>
        </select>
      </div>

      {/* Student List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading directory...</p>
      ) : students.length === 0 ? (
        <p className="text-center text-gray-500">No students found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student) => (
            <div 
              key={student.id} 
              onClick={() => setSelectedStudent(student)}
              className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold text-gray-800">{student.admission_number}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{student.class_id}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Click to view full profile</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;