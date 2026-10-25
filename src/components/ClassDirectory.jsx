// src/components/ClassDirectory.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import UnifiedStudentProfile from './UnifiedStudentProfile';

const API = import.meta.env.VITE_API_URL;

const ClassDirectory = () => {
  const [viewMode, setViewMode] = useState('classes');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('smartshule_token');
      const res = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const uniqueClasses = [...new Set(res.data.students.map(s => s.class_id))].filter(Boolean).sort();
      setClasses(uniqueClasses);
    } catch (error) {
      console.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentsByClass = async (classId) => {
    setLoading(true);
    setSelectedClass(classId);
    try {
      const token = localStorage.getItem('smartshule_token');
      const res = await axios.get(`${API}/students?class_id=${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data.students);
      setViewMode('students');
    } catch (error) {
      console.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  if (selectedStudent) {
    return (
      <div>
        <button 
          onClick={() => setSelectedStudent(null)} 
          className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
        >
          ← Back to {selectedClass} Students
        </button>
        <UnifiedStudentProfile
          studentId={selectedStudent.id}
          studentName={`Student ${selectedStudent.admission_number}`}
          admissionNumber={selectedStudent.admission_number}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <button 
          onClick={() => { setViewMode('classes'); setSelectedStudent(null); }} 
          className="hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
        >
          All Classes
        </button>
        {viewMode === 'students' && (
          <>
            <span>›</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">{selectedClass}</span>
          </>
        )}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        {viewMode === 'classes' ? 'Select a Class' : `Students in ${selectedClass}`}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">Loading...</p>
      ) : (
        <>
          {viewMode === 'classes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.length === 0 ? (
                <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">No classes found. Ensure students have a class_id assigned.</p>
              ) : (
                classes.map((cls) => (
                  <div 
                    key={cls} 
                    onClick={() => fetchStudentsByClass(cls)}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-indigo-500 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fetchStudentsByClass(cls)}
                  >
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{cls}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Click to view learners</p>
                  </div>
                ))
              )}
            </div>
          )}

          {viewMode === 'students' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.length === 0 ? (
                <p className="col-span-3 text-center text-gray-500 dark:text-gray-400">No students in this class.</p>
              ) : (
                students.map((student) => (
                  <div 
                    key={student.id} 
                    onClick={() => setSelectedStudent(student)}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedStudent(student)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-800 dark:text-gray-100">{student.admission_number}</p>
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{student.gender}</span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Click to view full profile</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClassDirectory;