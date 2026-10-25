// src/components/FeeStatement.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const FeeStatement = ({ studentId }) => {
  const targetStudentId = studentId || 'a965c9d3-e6d7-499f-ab4a-edcb3d7a847e';
  const [statement, setStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [amount, setAmount] = useState('');
  const [mpesaCode, setMpesaCode] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  const fetchStatement = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/finance/statement/${targetStudentId}`, { headers: headers() });
      setStatement(res.data);
    } catch (error) {
      console.error('Fetch Error:', error);
      setMessage('❌ Failed to load statement.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatement();
  }, [targetStudentId]);

  const handleStkPush = async (e) => {
    e.preventDefault();
    setMessage('🔄 Sending M-Pesa prompt to phone...');
    try {
      const response = await axios.post(`${API}/finance/stk-push`, {
        student_id: targetStudentId,
        amount: parseFloat(amount),
        phone_number: phone
      }, { headers: headers() });
      
      if (response.data.success) {
        setMessage(`✅ Prompt sent! Check phone ${phone}. (ID: ${response.data.checkoutRequestId})`);
        setAmount(''); setPhone('');
      }
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to send prompt'}`);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setMessage('🔄 Processing...');
    try {
      await axios.post(`${API}/finance/payments`, {
        student_id: targetStudentId,
        amount: parseFloat(amount),
        transaction_code: mpesaCode,
        phone_number: phone
      }, { headers: headers() });
      
      setMessage('✅ Payment recorded successfully!');
      setAmount(''); setMpesaCode(''); setPhone('');
      fetchStatement();
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to record payment'}`);
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500 dark:text-gray-400">Loading financial data...</div>;

  if (!statement) {
    return (
      <div className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-400 font-bold text-lg">Failed to load financial data.</p>
        <button onClick={fetchStatement} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">Try Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-gray-400 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Expected</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">KES {statement.summary.total_expected.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-green-500 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">KES {statement.summary.total_paid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border-l-4 border-red-500 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">KES {statement.summary.balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Record M-Pesa Payment</h3>
        
        {message && (
          <div className={`p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount (KES)</label>
              <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="e.g., 5000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">M-Pesa Code</label>
              <input type="text" required value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none uppercase transition" placeholder="e.g., QKH1A2B3C4" maxLength="10" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payer's Phone Number</label>
            <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition" placeholder="0712345678" />
          </div>
          <button type="button" onClick={handleStkPush} className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition mb-3 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            📱 Send M-Pesa Prompt (STK Push)
          </button>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
            💰 Record Manual Payment
          </button>
        </form>
      </div>

      {/* Payment History */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Payment History</h3>
        {statement.history.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No payments recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
                <tr>
                  <th className="p-3 dark:text-gray-300">Date</th>
                  <th className="p-3 dark:text-gray-300">M-Pesa Code</th>
                  <th className="p-3 text-right dark:text-gray-300">Amount</th>
                </tr>
              </thead>
              <tbody>
                {statement.history.map((payment, index) => (
                  <tr key={index} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="p-3 text-gray-600 dark:text-gray-300">{new Date(payment.paid_at).toLocaleDateString()}</td>
                    <td className="p-3 font-mono text-gray-600 dark:text-gray-300">{payment.transaction_code}</td>
                    <td className="p-3 text-right font-bold text-green-600 dark:text-green-400">KES {parseFloat(payment.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeStatement;