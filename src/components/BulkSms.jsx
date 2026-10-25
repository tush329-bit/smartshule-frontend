// src/components/BulkSms.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_URL;

const BulkSms = () => {
  const [targetGroup, setTargetGroup] = useState('all_parents');
  const [customMessage, setCustomMessage] = useState('');
  const [recipientCount, setRecipientCount] = useState(0);
  const [actualRecipients, setActualRecipients] = useState([]);
  const [sending, setSending] = useState(false);
  const [logs, setLogs] = useState([]);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const res = await axios.get(`${API}/communications/recipients?group=${targetGroup}`, { headers: headers() });
        setRecipientCount(res.data.count);
        setActualRecipients(res.data.recipients);
      } catch (error) {
        console.error('Failed to fetch recipients');
        setRecipientCount(0);
        setActualRecipients([]);
      }
    };
    fetchRecipients();
  }, [targetGroup]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`${API}/communications/logs`, { headers: headers() });
        setLogs(res.data.logs);
      } catch (error) {
        console.error('Failed to fetch logs');
      }
    };
    fetchLogs();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!customMessage.trim()) return toast.error('Message cannot be empty.');
    if (actualRecipients.length === 0) return toast.error('No recipients found for this group.');
    
    setSending(true);
    try {
      await axios.post(`${API}/communications/send`, {
        recipients: actualRecipients, 
        message: customMessage
      }, { headers: headers() });
      
      toast.success(`SMS successfully queued for ${actualRecipients.length} recipients!`);
      setCustomMessage('');
      
      // Refresh logs
      const res = await axios.get(`${API}/communications/logs`, { headers: headers() });
      setLogs(res.data.logs);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send SMS.');
    } finally {
      setSending(false);
    }
  };

  const charCount = customMessage.length;
  const smsSegments = Math.ceil(charCount / 160);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-green-600 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📱 Bulk SMS Composer</h3>
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Audience</label>
            <select 
              value={targetGroup} 
              onChange={e => setTargetGroup(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
            >
              <option value="all_parents">All Parents/Guardians</option>
              <option value="all_teachers">All Teaching Staff</option>
              <option value="grade_8_parents">Grade 8 Parents Only</option>
              <option value="custom_list">Custom Phone Number List</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Estimated recipients: <span className="font-bold text-green-600 dark:text-green-400">{recipientCount}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
            <textarea
              value={customMessage}
              onChange={e => setCustomMessage(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100 transition"
              placeholder="Dear Parent, this is a reminder that..."
            ></textarea>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{charCount} characters</span>
              <span>{smsSegments} SMS segment(s)</span>
            </div>
          </div>
          <button 
            type="submit" 
            disabled={sending || charCount === 0}
            className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {sending ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              '🚀 Send Bulk SMS'
            )}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📜 Recent SMS Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left dark:text-gray-300">Date</th>
                <th className="p-3 text-left dark:text-gray-300">Recipient</th>
                <th className="p-3 text-left dark:text-gray-300">Message</th>
                <th className="p-3 text-left dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                  <td className="p-3 text-gray-500 dark:text-gray-400">{new Date(log.created_at).toLocaleDateString()}</td>
                  <td className="p-3 font-medium dark:text-gray-200">{log.recipient}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-300 truncate max-w-xs">{log.message}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      log.status === 'Success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan="4" className="p-6 text-center text-gray-500 dark:text-gray-400">No SMS sent yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkSms;