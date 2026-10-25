// src/components/parent/ParentFeeStatement.jsx
import { useState } from 'react';

const ParentFeeStatement = ({ admissionNumber }) => {
  // Mock data for demonstration (In production, this comes from the backend)
  const feeData = {
    totalFees: 45000,
    amountPaid: 30000,
    balance: 15000,
    term: 'Term 1, 2024',
    payments: [
      { date: '2024-01-15', amount: 20000, method: 'M-Pesa', ref: 'QKH789XYZ' },
      { date: '2024-02-10', amount: 10000, method: 'Bank Transfer', ref: 'BT-99821' },
    ]
  };

  const balanceColor = feeData.balance > 0 ? 'text-red-600' : 'text-green-600';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total Fees ({feeData.term})</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">KES {feeData.totalFees.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Amount Paid</p>
          <p className="text-2xl font-bold text-green-800 mt-1">KES {feeData.amountPaid.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Outstanding Balance</p>
          <p className={`text-2xl font-bold mt-1 ${balanceColor}`}>KES {feeData.balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Payment History Table */}
      <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-emerald-600">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💳 Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount (KES)</th>
                <th className="p-3 text-left">Payment Method</th>
                <th className="p-3 text-left">Reference</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {feeData.payments.map((payment, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-gray-600">{payment.date}</td>
                  <td className="p-3 font-semibold text-green-700">+ {payment.amount.toLocaleString()}</td>
                  <td className="p-3">{payment.method}</td>
                  <td className="p-3 font-mono text-xs text-gray-500">{payment.ref}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                      Cleared
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic">
          * For fee inquiries or payment plans, please contact the school bursar.
        </p>
      </div>
    </div>
  );
};

export default ParentFeeStatement;