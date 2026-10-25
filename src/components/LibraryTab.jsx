// src/components/LibraryTab.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const LibraryTab = ({ studentId }) => {
  const [books, setBooks] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const [selectedBookId, setSelectedBookId] = useState('');
  const [dueDate, setDueDate] = useState('');

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  const fetchStudentBooks = async () => {
    try {
      const res = await axios.get(`${API}/library/student/${studentId}`, { headers: headers() });
      setBooks(res.data.books);
    } catch (error) {
      console.error('Failed to fetch student books');
    }
  };

  const fetchCatalog = async () => {
    try {
      const res = await axios.get(`${API}/library/catalog`, { headers: headers() });
      setCatalog(res.data.books);
    } catch (error) {
      console.error('Failed to fetch catalog');
    }
  };

  useEffect(() => {
    if (studentId) {
      setLoading(true);
      Promise.all([fetchStudentBooks(), fetchCatalog()]).finally(() => setLoading(false));
    }
  }, [studentId]);

  const handleIssue = async (e) => {
    e.preventDefault();
    setMessage('🔄 Processing...');
    try {
      await axios.post(`${API}/library/issue`, {
        book_id: selectedBookId,
        student_id: studentId,
        due_date: dueDate
      }, { headers: headers() });
      
      setMessage('✅ Book issued successfully!');
      setSelectedBookId(''); setDueDate('');
      fetchStudentBooks(); fetchCatalog();
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to issue book'}`);
    }
  };

  const handleReturn = async (issuanceId, condition) => {
    try {
      await axios.post(`${API}/library/return`, {
        issuance_id: issuanceId,
        condition: condition
      }, { headers: headers() });
      
      setMessage(`✅ Book returned (${condition}).`);
      fetchStudentBooks(); fetchCatalog();
    } catch (error) {
      setMessage('❌ Failed to return book.');
    }
  };

  if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading library records...</p>;

  return (
    <div className="space-y-6">
      {/* Issue Book Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Issue New Book</h3>
        
        {message && (
          <p className={`mb-4 text-sm p-2 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleIssue} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Book</label>
            <select value={selectedBookId} onChange={(e) => setSelectedBookId(e.target.value)} required className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition">
              <option value="">Choose a book...</option>
              {catalog.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} ({book.author}) - {book.available_copies} available
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none transition" />
          </div>
          <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            📚 Issue Book
          </button>
        </form>
      </div>

      {/* Currently Held Books */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Currently Checked Out</h3>
        {books.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">This student has no books currently checked out.</p>
        ) : (
          <div className="space-y-3">
            {books.map((book, index) => (
              <div key={index} className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-200 dark:border-gray-600 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-100">{book.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">by {book.author}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Issued: {new Date(book.issue_date).toLocaleDateString()} | Due: {new Date(book.due_date).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button onClick={() => handleReturn(book.id, 'Good')} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded hover:bg-green-200 transition font-medium">
                    Return (Good)
                  </button>
                  <button onClick={() => handleReturn(book.id, 'Damaged')} className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded hover:bg-red-200 transition font-medium">
                    Return (Damaged)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryTab;