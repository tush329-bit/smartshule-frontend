// src/components/MarkEntry.jsx
import { useState } from 'react';
import axios from 'axios';
import db from "../../db/offlineDB"; 
import CbcRubricSelector from '../ui/CbcRubricSelector';

// ✅ Mock data is fine outside the component (it's just a constant)
const MOCK_STUDENTS = [
  { id: 'stu-1', name: 'Achieng, Grace', adm: 'ADM-001' },
  { id: 'stu-2', name: 'Kamau, Brian', adm: 'ADM-002' },
  { id: 'stu-3', name: 'Omondi, David', adm: 'ADM-003' },
  { id: 'stu-4', name: 'Wanjiku, Mary', adm: 'ADM-004' },
];

// ✅ The component function starts HERE
const MarkEntry = () => {
  // ✅ CORRECT: ALL useState hooks MUST be inside the component function
  const [performanceLevel, setPerformanceLevel] = useState('');
  const [marks, setMarks] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Update the marks state when the teacher types
  const handleMarkChange = (studentId, value) => {
    if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
      setMarks((prev) => ({ ...prev, [studentId]: value }));
    }
  };

  // Save all entered marks to the Offline Database (Dexie)
  const handleSaveLocally = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      let savedCount = 0;

      for (const [studentId, score] of Object.entries(marks)) {
        if (score !== '') {
          await db.offlineMarks.add({
            studentId,
            subjectId: 'math-101', 
            examId: 'opener-term1-2024', 
            score: Number(score),
            syncStatus: 'pending', 
            timestamp: new Date().toISOString()
          });
          savedCount++;
        }
      }

      setSaveMessage(`✅ Successfully saved ${savedCount} marks locally! (Will sync when online)`);
      setMarks({});
    } catch (error) {
      console.error('Error saving locally:', error);
      setSaveMessage('❌ Error saving marks. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Sync pending marks to the backend
  const handleSyncToServer = async () => {
    setIsSaving(true);
    setSaveMessage('🔄 Connecting to server...');

    try {
      // 1. Get all pending marks from Dexie
      const pendingMarks = await db.offlineMarks.where('syncStatus').equals('pending').toArray();

      if (pendingMarks.length === 0) {
        setSaveMessage('✅ No pending marks to sync. All up to date!');
        setIsSaving(false);
        return;
      }

      // 2. Format data for the backend
      const payload = pendingMarks.map(mark => ({
        studentId: mark.studentId,
        subjectId: mark.subjectId,
        examId: mark.examId,
        score: mark.score,
        localId: mark.id 
      }));

      // 3. Send to backend
      const response = await axios.post('http://localhost:5000/api/v1/academics/marks/sync', {
        marks: payload
      });

      if (response.data.success) {
        // 4. Update local Dexie records to 'synced'
        for (const result of response.data.insertedIds) {
          await db.offlineMarks.update(result.localId, { syncStatus: 'synced' });
        }
        
        setSaveMessage(`✅ Successfully synced ${pendingMarks.length} marks to the server!`);
      }
    } catch (error) {
      console.error('Sync Error:', error);
      setSaveMessage('❌ Sync failed. Check your internet connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ CORRECT: The return statement contains ALL JSX
  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 md:p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Mathematics - Opener Exam</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter marks out of 100. Data is saved locally first.</p>

        {/* ✅ CORRECT: JSX components are safely inside the return statement */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <CbcRubricSelector 
            value={performanceLevel} 
            onChange={setPerformanceLevel} 
            label="CBC Performance Level (Optional Class Note)" 
          />
        </div>

        {saveMessage && (
          <div className={`p-3 rounded mb-4 text-sm font-medium ${
            saveMessage.includes('✅') 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {saveMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Adm No.</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Student Name</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300 w-24">Mark</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_STUDENTS.map((student) => (
                <tr key={student.id} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="p-3 text-sm text-gray-600 dark:text-gray-300">{student.adm}</td>
                  <td className="p-3 text-sm font-medium text-gray-800 dark:text-gray-100">{student.name}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={marks[student.id] || ''}
                      onChange={(e) => handleMarkChange(student.id, e.target.value)}
                      placeholder="-"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-white transition"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSaveLocally}
            disabled={isSaving || Object.keys(marks).length === 0}
            className="flex-1 bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? 'Saving...' : '💾 Save Locally (Offline)'}
          </button>
          
          <button
            onClick={handleSyncToServer}
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            🌐 Sync Pending Marks to Server
          </button>
          
          <button
            onClick={() => setMarks({})}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
          >
            Clear Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkEntry;