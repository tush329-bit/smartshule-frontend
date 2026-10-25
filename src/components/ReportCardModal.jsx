// src/components/ReportCardModal.jsx
import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportCardModal = ({ studentId, studentName, admissionNumber, onClose }) => {
  const [teacherComment, setTeacherComment] = useState('');
  const [principalComment, setPrincipalComment] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to calculate grade
  const calculateGrade = (score) => {
    if (!score || score === 'N/A') return 'N/A';
    const numScore = parseFloat(score);
    if (numScore >= 80) return 'A';
    if (numScore >= 70) return 'B+';
    if (numScore >= 60) return 'B';
    if (numScore >= 50) return 'C+';
    if (numScore >= 40) return 'C';
    return 'D';
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      // 1. Fetch Real Data in Parallel (Fast!)
      const [analyticsRes, financeRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/v1/academics/analytics/${studentId}`),
        axios.get(`http://localhost:5000/api/v1/finance/statement/${studentId}`)
      ]);

      const analytics = analyticsRes.data;
      const finance = financeRes.data;

      // 2. Initialize jsPDF
      const doc = new jsPDF();
      
      // 3. Header
      doc.setFontSize(22); doc.setFont('helvetica', 'bold');
      doc.text('SMARTSHULE ACADEMY', 105, 20, { align: 'center' });
      doc.setFontSize(12); doc.setFont('helvetica', 'normal');
      doc.text('Official End-of-Term Report Card', 105, 30, { align: 'center' });
      
      // 4. Student Details Box
      doc.setDrawColor(0); doc.setFillColor(240, 240, 240);
      doc.rect(14, 40, 182, 25, 'F');
      doc.setFontSize(11);
      doc.text(`Student Name: ${studentName || 'Student'}`, 20, 50);
      doc.text(`Admission No: ${admissionNumber || 'N/A'}`, 20, 58);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 120, 50);
      doc.text(`Fee Balance: KES ${finance.summary.balance.toLocaleString()}`, 120, 58);

      // 5. Academic Table (Using real mean score for Math, placeholders for others)
      doc.setFontSize(14); doc.setFont('helvetica', 'bold');
      doc.text('Academic Performance', 14, 80);

      const lastScore = analytics.data[analytics.data.length - 1] || 0;
      const subjectsData = [
        ['Mathematics', lastScore, calculateGrade(lastScore)],
        ['English', '78', 'B+'], // Placeholder until subject-specific endpoint is built
        ['Kiswahili', '82', 'A-'],
        ['Science', '75', 'B']
      ];

      autoTable(doc, {
        startY: 85, head: [['Subject', 'Score (%)', 'Grade']], body: subjectsData,
        theme: 'grid', headStyles: { fillColor: [37, 99, 235] }, styles: { fontSize: 10, cellPadding: 3 }
      });

      // 6. Term Trend
      const finalY = doc.lastAutoTable.finalY + 15;
      doc.setFontSize(12); doc.setFont('helvetica', 'bold');
      doc.text('Term-over-Term Mean Scores:', 14, finalY);
      
      const trendData = analytics.labels.map((label, i) => [label, `${analytics.data[i]}%`]);
      autoTable(doc, { startY: finalY + 5, body: trendData, theme: 'plain', styles: { fontSize: 10 } });

      // 7. CUSTOM COMMENTS (The Magic!)
      const commentY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(11); doc.setFont('helvetica', 'bold');
      doc.text("Class Teacher's Comment:", 14, commentY);
      doc.setFont('helvetica', 'italic'); doc.setFontSize(10);
      // Split text to fit within margins
      const teacherLines = doc.splitTextToSize(teacherComment || 'No comment provided.', 180);
      doc.text(teacherLines, 14, commentY + 6);

      const principalY = commentY + (teacherLines.length * 5) + 10;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
      doc.text("Principal's Comment:", 14, principalY);
      doc.setFont('helvetica', 'italic'); doc.setFontSize(10);
      const principalLines = doc.splitTextToSize(principalComment || 'No comment provided.', 180);
      doc.text(principalLines, 14, principalY + 6);

      // 8. Signatures
      const sigY = principalY + (principalLines.length * 5) + 20;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
      doc.text('Teacher\'s Signature: ___________________', 14, sigY);
      doc.text('Principal\'s Signature: ___________________', 120, sigY);

      // 9. Save
      doc.save(`${admissionNumber || 'Student'}_Report_Card.pdf`);
      onClose(); // Close modal on success
      
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate report card. Check console.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h2 className="text-xl font-bold text-gray-800">Generate Report: {studentName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Teacher's Comment (CBC Focus)</label>
            <textarea 
              value={teacherComment} onChange={(e) => setTeacherComment(e.target.value)} rows="4" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g., Grace has shown great improvement in collaborative learning..."
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Principal's Comment</label>
            <textarea 
              value={principalComment} onChange={(e) => setPrincipalComment(e.target.value)} rows="3" 
              className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g., An excellent term. Keep up the good work."
            ></textarea>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">Cancel</button>
          <button onClick={handleGenerate} disabled={isGenerating} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400">
            {isGenerating ? 'Generating...' : '📄 Generate & Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportCardModal;