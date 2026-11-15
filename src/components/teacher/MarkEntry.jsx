// src/components/teacher/MarkEntry.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSmartSync } from '../../hooks/useSmartSync';
import CbcRubricSelector from '../ui/CbcRubricSelector';

const API = import.meta.env.VITE_API_URL;

const MarkEntry = () => {
  // 1. Destructure the smart sync engine
  const { queueAction, triggerSync, isOnline, pendingCount, isSyncing } = useSmartSync();

  // 2. State for dropdowns and data
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  
  // 3. State for the form
  const [performanceLevel, setPerformanceLevel] = useState('');
  const [marks, setMarks] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Helper to get auth headers
  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  // 4. Fetch dropdown options on mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [allocationsRes, examsRes] = await Promise.all([
          axios.get(`${API}/allocations/options`, { headers: getHeaders() }),
          axios.get(`${API}/academics/exams`, { headers: getHeaders() })
        ]);
        setClasses(allocationsRes.data.classes || []);
        setSubjects(allocationsRes.data.subjects || []);
        setExams(examsRes.data.exams || []);
      } catch (err) {
        console.error('Failed to load mark entry options:', err);
        toast.error('Failed to load classes or subjects.');
      }
    };
    loadOptions();
  }, []);

  // 5. Fetch students whenever the selected class changes
  useEffect(() => {
    if (!selectedClass) {
      setStudents([]);
      return;
    }
    
    const loadStudents = async () => {
      try {
        const res = await axios.get(`${API}/students?class_id=${selectedClass}`, { headers: getHeaders() });
        setStudents(res.data.students || []);
      } catch (err) {
        console.error('Failed to load students:', err);
        toast.error('Failed to load students for this class.');
        setStudents([]);
      }
    };
    loadStudents();
  }, [selectedClass]);

  // 6. Handle individual mark input changes
  const handleMarkChange = (studentId, value) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setMarks(prev => ({ ...prev, [studentId]: value }));
    }
  };

  // 7. Save to Offline Queue (The "Wow Factor" for KSEF)
  const handleSaveLocally = async () => {
    if (!selectedExam || !selectedSubject) {
      return toast.error('Please select an Exam and Learning Area first.');
    }
    
    setIsSaving(true);
    try {
      let savedCount = 0;
      for (const [studentId, score] of Object.entries(marks)) {
        if (score !== '') {
          // ✅ CRITICAL FIX: Use queueAction instead of direct db.offlineMarks calls
          await queueAction('mark', {
            studentId,
            subjectId: selectedSubject,
            examId: selectedExam,
            score: Number(score)
          });
          savedCount++;
        }
      }
      
      if (savedCount > 0) {
        toast.success(`Saved ${savedCount} marks to offline queue!`);
        setMarks({}); // Clear form after saving
        
        // Auto-sync if we are currently online
        if (isOnline) {
          await triggerSync();
        }
      } else {
        toast.error('No valid marks to save.');
      }
    } catch (error) {
      console.error('Queue Error:', error);
      toast.error('Failed to queue marks locally.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">✍️ Enter Assessment Marks</h2>

        {/* Selection Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Class</label>
            <select 
              value={selectedClass} 
              onChange={e => setSelectedClass(e.target.value)} 
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Class...</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.id}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Learning Area</label>
            <select 
              value={selectedSubject} 
              onChange={e => setSelectedSubject(e.target.value)} 
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Subject...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Exam / Term</label>
            <select 
              value={selectedExam} 
              onChange={e => setSelectedExam(e.target.value)} 
              className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Exam...</option>
              {exams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.term})</option>)}
            </select>
          </div>
        </div>

        {/* CBC Rubric Note */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CbcRubricSelector 
            value={performanceLevel} 
            onChange={setPerformanceLevel} 
            label="CBC Performance Level (Optional Class Note)" 
          />
        </div>

        {/* Student Marks Table */}
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Adm No.</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Student Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 w-28">Score (%)</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-3 text-sm font-medium text-gray-800 dark:text-gray-100">{student.admission_number}</td>
                    <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{student.gender === 'Male' ? 'Boy' : 'Girl'} - {student.admission_number}</td>
                    <td className="p-3">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={marks[student.id] || ''}
                        onChange={e => handleMarkChange(student.id, e.target.value)}
                        placeholder="-"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-center dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">
              {selectedClass ? 'No students found in this class.' : 'Select a class above to load learners.'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveLocally}
            disabled={isSaving || Object.keys(marks).length === 0}
            className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {isSaving ? 'Saving...' : '💾 Save & Queue Marks'}
          </button>
          
          {pendingCount > 0 && (
            <button
              onClick={triggerSync}
              disabled={isSyncing || !isOnline}
              className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isSyncing ? 'Syncing...' : `🌐 Sync ${pendingCount} Pending Now`}
            </button>
          )}
          
          <button
            onClick={() => setMarks({})}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkEntry;