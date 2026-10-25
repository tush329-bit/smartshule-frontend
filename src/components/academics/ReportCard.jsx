// src/components/academics/ReportCard.jsx
import React from 'react';
import { generateCbcComment } from '../../utils/cbcComments';

const ReportCard = ({ student, school, term, subjectsData }) => {
  // subjectsData should be an array like: [{ name: 'Mathematics', score: 'ME', remarks: '...' }]

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Print Button (Hidden when printing) */}
      <div className="mb-6 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold shadow-md transition flex items-center gap-2"
        >
          🖨️ Print / Save as PDF
        </button>
      </div>

      {/* Report Card Paper (A4 Ratio) */}
      <div className="bg-white p-8 md:p-12 shadow-2xl print:shadow-none print:p-0 border border-gray-200 print:border-none">
        
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">{school?.name || 'SMARTSHULE ACADEMY'}</h1>
          <p className="text-sm text-gray-600 mt-1">P.O. Box 12345 - 00100, Nairobi, Kenya | Tel: +254 700 000 000</p>
          <h2 className="text-xl font-bold text-indigo-700 mt-4 uppercase">Official CBC Progress Report</h2>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-sm">
          <div><span className="font-bold text-gray-700">Student Name:</span> <br/>{student?.name}</div>
          <div><span className="font-bold text-gray-700">Admission No:</span> <br/>{student?.adm_no}</div>
          <div><span className="font-bold text-gray-700">Class:</span> <br/>{student?.class_name}</div>
          <div><span className="font-bold text-gray-700">Term/Year:</span> <br/>{term} / 2024</div>
        </div>

        {/* CBC Performance Table */}
        <table className="w-full text-sm border-collapse mb-8">
          <thead>
            <tr className="bg-gray-100 print:bg-gray-200">
              <th className="border border-gray-400 p-2 text-left font-bold">Learning Area</th>
              <th className="border border-gray-400 p-2 text-center font-bold w-24">Level</th>
              <th className="border border-gray-400 p-2 text-left font-bold">Teacher's Remarks</th>
            </tr>
          </thead>
          <tbody>
            {subjectsData.map((subject, index) => (
              <tr key={index}>
                <td className="border border-gray-400 p-2 font-medium">{subject.name}</td>
                <td className="border border-gray-400 p-2 text-center font-bold text-indigo-700">{subject.score}</td>
                <td className="border border-gray-400 p-2 text-gray-700 italic">
                  {subject.remarks || generateCbcComment(subject.name, subject.score)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Class Teacher's Comment */}
        <div className="mb-8 p-4 bg-gray-50 print:bg-white border border-gray-300 rounded">
          <h3 className="font-bold text-gray-800 mb-2">Class Teacher's General Comment:</h3>
          <p className="text-sm text-gray-700 italic">
            "{student?.name} is a {subjectsData.some(s => s.score === 'EE') ? 'highly dedicated and exceptional' : 'steady and promising'} learner. 
            {subjectsData.some(s => s.score === 'BE' || s.score === 'AE') ? ' With a bit more focus on foundational practice, they will achieve great results.' : ' Keep up the excellent work and positive attitude!'}"
          </p>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 mt-12 text-sm">
          <div>
            <div className="border-b border-gray-400 mb-1 h-8"></div>
            <p className="font-bold text-gray-800">Class Teacher's Signature & Date</p>
          </div>
          <div>
            <div className="border-b border-gray-400 mb-1 h-8"></div>
            <p className="font-bold text-gray-800">Principal's Signature & Stamp</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
          <p>This report is based on the Kenyan Competency-Based Curriculum (CBC) 4-Point Performance Rubric:</p>
          <p className="mt-1 font-semibold">EE = Exceeding Expectations | ME = Meeting Expectations | AE = Approaching Expectations | BE = Below Expectations</p>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;