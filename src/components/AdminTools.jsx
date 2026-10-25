// src/components/AdminTools.jsx
import { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const AdminTools = () => {
  const [activeTool, setActiveTool] = useState('book');
  const [message, setMessage] = useState('');
  
  const [bookData, setBookData] = useState({ title: '', author: '', subject: '', total_copies: 1 });
  const [examData, setExamData] = useState({ name: '', term: 'Term 1', year: 2024, sort_order: 1, total_marks: 100 });

  const handleAddBook = async (e) => {
    e.preventDefault();
    setMessage('🔄 Adding book...');
    try {
      const token = localStorage.getItem('smartshule_token');
      await axios.post(`${API}/library/books`, bookData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Book added to catalogue successfully!');
      setBookData({ title: '', author: '', subject: '', total_copies: 1 });
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to add book.'}`);
    }
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    setMessage('🔄 Creating exam...');
    try {
      const token = localStorage.getItem('smartshule_token');
      await axios.post(`${API}/academics/exams`, examData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Exam created successfully!');
      setExamData({ name: '', term: 'Term 1', year: 2024, sort_order: 1, total_marks: 100 });
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to create exam.'}`);
    }
  };

  const inputClasses = "p-2.5 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-indigo-600 border border-gray-100 dark:border-gray-700">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">🛠️ Principal's Admin Tools</h2>
      
      {message && (
        <p className={`mb-4 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
          {message}
        </p>
      )}

      <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
        <button 
          onClick={() => { setActiveTool('book'); setMessage(''); }} 
          className={`pb-2 px-4 font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-t ${activeTool === 'book' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          📚 Add Book to Catalogue
        </button>
        <button 
          onClick={() => { setActiveTool('exam'); setMessage(''); }} 
          className={`pb-2 px-4 font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-t ${activeTool === 'exam' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          📝 Create New Exam/Test
        </button>
      </div>

      {activeTool === 'book' && (
        <form onSubmit={handleAddBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Book Title" value={bookData.title} onChange={e => setBookData({...bookData, title: e.target.value})} className={inputClasses} />
          <input required placeholder="Author" value={bookData.author} onChange={e => setBookData({...bookData, author: e.target.value})} className={inputClasses} />
          <input required placeholder="Subject" value={bookData.subject} onChange={e => setBookData({...bookData, subject: e.target.value})} className={inputClasses} />
          <input required type="number" placeholder="Total Copies" value={bookData.total_copies} onChange={e => setBookData({...bookData, total_copies: e.target.value})} className={inputClasses} />
          <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2.5 rounded hover:bg-indigo-700 font-semibold transition focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">Add Book</button>
        </form>
      )}

      {activeTool === 'exam' && (
        <form onSubmit={handleCreateExam} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required placeholder="Exam Name (e.g., Opener Term 2)" value={examData.name} onChange={e => setExamData({...examData, name: e.target.value})} className={inputClasses} />
          <select value={examData.term} onChange={e => setExamData({...examData, term: e.target.value})} className={inputClasses}>
            <option>Term 1</option><option>Term 2</option><option>Term 3</option>
          </select>
          <input required type="number" placeholder="Year" value={examData.year} onChange={e => setExamData({...examData, year: e.target.value})} className={inputClasses} />
          <input required type="number" placeholder="Sort Order" value={examData.sort_order} onChange={e => setExamData({...examData, sort_order: e.target.value})} className={inputClasses} />
          <input required type="number" placeholder="Total Marks" value={examData.total_marks} onChange={e => setExamData({...examData, total_marks: e.target.value})} className={inputClasses} />
          <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2.5 rounded hover:bg-indigo-700 font-semibold transition focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">Create Exam</button>
        </form>
      )}
    </div>
  );
};

export default AdminTools;