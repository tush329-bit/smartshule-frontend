// src/components/StudentOnboarding.jsx
import { useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse';

const StudentOnboarding = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [message, setMessage] = useState('');

  // Manual Form State
  const [manualData, setManualData] = useState({ admission_number: '', gender: 'Male', class_id: 'Grade-7-West' });

  // CSV Upload State
  const [csvData, setCsvData] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setMessage('🔄 Processing...');
    try {
      await axios.post('http://localhost:5000/api/v1/students/bulk', { students: [manualData] });
      setMessage('✅ Student onboarded successfully!');
      setManualData({ admission_number: '', gender: 'Male', class_id: 'Grade-7-West' });
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to onboard student.'}`);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Map CSV headers to our database fields
          const formattedData = results.data.map(row => ({
            admission_number: row['Admission Number'],
            gender: row['Gender'],
            class_id: row['Class']
          }));
          setCsvData(formattedData);
          setMessage(`📄 Parsed ${formattedData.length} students from ${file.name}. Review and submit.`);
        },
        error: () => setMessage('❌ Failed to parse CSV file.')
      });
    }
  };

  const handleBatchSubmit = async () => {
    if (csvData.length === 0) return;
    setMessage('🔄 Processing batch...');
    try {
      await axios.post('http://localhost:5000/api/v1/students/bulk', { students: csvData });
      setMessage(`✅ Successfully onboarded ${csvData.length} students!`);
      setCsvData([]);
      setFileName('');
    } catch (error) {
      setMessage(`❌ Batch failed: ${error.response?.data?.message || 'Check for duplicate Admission Numbers.'}`);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,Admission Number,Gender,Class\nADM-NEW-001,Male,Grade-7-West\nADM-NEW-002,Female,Grade-8-East";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "smartshule_student_template.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-teal-600 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">👥 Student Onboarding</h2>
      
      {message && <p className={`mb-4 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}

      <div className="flex gap-4 mb-6 border-b">
        <button onClick={() => { setActiveTab('manual'); setMessage(''); }} className={`pb-2 px-4 font-semibold ${activeTab === 'manual' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}>
          ➕ Add Single Student
        </button>
        <button onClick={() => { setActiveTab('batch'); setMessage(''); }} className={`pb-2 px-4 font-semibold ${activeTab === 'batch' ? 'border-b-2 border-teal-600 text-teal-600' : 'text-gray-500'}`}>
           Batch Upload (CSV)
        </button>
      </div>

      {/* Manual Form */}
      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Admission Number</label>
            <input required value={manualData.admission_number} onChange={e => setManualData({...manualData, admission_number: e.target.value})} className="w-full p-2 border rounded" placeholder="ADM-XXX" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
            <select value={manualData.gender} onChange={e => setManualData({...manualData, gender: e.target.value})} className="w-full p-2 border rounded">
              <option>Male</option><option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Class</label>
            <select value={manualData.class_id} onChange={e => setManualData({...manualData, class_id: e.target.value})} className="w-full p-2 border rounded">
              <option>Grade-6-North</option><option>Grade-7-West</option><option>Grade-8-East</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700">Onboard Student</button>
        </form>
      )}

      {/* Batch Upload */}
      {activeTab === 'batch' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-gray-50 p-4 rounded border border-dashed border-gray-300">
            <button onClick={downloadTemplate} className="text-blue-600 hover:underline text-sm font-semibold">⬇️ Download CSV Template</button>
            <span className="text-gray-400">|</span>
            <label className="cursor-pointer bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 text-sm">
              Choose File
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
            {fileName && <span className="text-sm text-gray-600">Selected: {fileName}</span>}
          </div>

          {csvData.length > 0 && (
            <div className="border rounded overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                  <tr><th className="p-2">Admission No</th><th className="p-2">Gender</th><th className="p-2">Class</th></tr>
                </thead>
                <tbody>
                  {csvData.slice(0, 5).map((row, i) => (
                    <tr key={i} className="border-t"><td className="p-2">{row.admission_number}</td><td className="p-2">{row.gender}</td><td className="p-2">{row.class_id}</td></tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 5 && <p className="p-2 text-xs text-gray-500 bg-gray-50">...and {csvData.length - 5} more students.</p>}
              
              <div className="p-3 bg-gray-50 border-t flex justify-end">
                <button onClick={handleBatchSubmit} className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 font-semibold">
                  🚀 Process {csvData.length} Students
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentOnboarding;