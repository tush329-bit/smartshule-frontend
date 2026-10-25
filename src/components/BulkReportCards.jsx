// src/components/BulkReportCards.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { generateSmartComment } from '../utils/commentBuilder';

const API = import.meta.env.VITE_API_URL;

const BulkReportCards = () => {
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [classId, setClassId] = useState('');
  const [examId, setExamId] = useState('');
  const [results, setResults] = useState([]);
  const [classMean, setClassMean] = useState(0);
  const [selected, setSelected] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [message, setMessage] = useState('');

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [studentsRes, examsRes] = await Promise.all([
          axios.get(`${API}/students`, { headers: headers() }),
          axios.get(`${API}/academics/exams`, { headers: headers() })
        ]);
        const unique = [...new Set(studentsRes.data.students.map(s => s.class_id).filter(Boolean))].sort();
        setClasses(unique);
        setExams(examsRes.data.exams);
        if (unique.length) setClassId(unique[0]);
        if (examsRes.data.exams.length) setExamId(examsRes.data.exams[0].id);
      } catch (err) {
        setMessage('❌ Could not load classes/exams. Check your login and backend.');
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!classId || !examId) return;
    const load = async () => {
      try {
        const res = await axios.get(`${API}/academics/class-results/${classId}?exam_id=${examId}`, { headers: headers() });
        setResults(res.data.results);
        setClassMean(res.data.classMean || 0);
        setSelected(res.data.results.map(r => r.student_id));
        setMessage('');
      } catch (err) {
        setMessage(`❌ ${err.response?.data?.message || 'Failed to load results.'}`);
      }
    };
    load();
  }, [classId, examId]);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const gradeOf = (score) => {
    if (score === null || score === undefined) return '—';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C+';
    if (score >= 40) return 'C';
    return 'D';
  };

  const generateBulkPDF = async () => {
    const chosen = results.filter(r => selected.includes(r.student_id));
    if (chosen.length === 0) return setMessage('❌ Select at least one learner.');
    if (!examId) return setMessage('❌ Select an exam first.');

    setGenerating(true);
    setMessage('');
    try {
      const exam = exams.find(e => e.id === examId);
      const doc = new jsPDF();
      for (let i = 0; i < chosen.length; i++) {
        const learner = chosen[i];
        setProgress(`Rendering ${i + 1} of ${chosen.length}: ${learner.admission_number}`);
        if (i > 0) doc.addPage();

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('SMARTSHULE ACADEMY', 105, 18, { align: 'center' });
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`End of Term Report — ${exam?.name || 'Assessment'}`, 105, 27, { align: 'center' });

        doc.setFillColor(240, 244, 255);
        doc.rect(14, 35, 182, 24, 'F');
        doc.setFontSize(11);
        doc.text(`Admission No: ${learner.admission_number}`, 20, 45);
        doc.text(`Class: ${learner.class_id}`, 20, 53);
        doc.text(`Mean Score: ${learner.mean ?? 'N/A'}%`, 130, 45);
        doc.text(`Overall Grade: ${gradeOf(learner.mean)}`, 130, 53);

        const rows = learner.subjects.length
          ? learner.subjects.map(s => [s.name, `${s.score}`, gradeOf(s.score)])
          : [['No marks entered for this assessment', '—', '—']];
        
        autoTable(doc, {
          startY: 66,
          head: [['Learning Area', 'Score (%)', 'Grade']],
          body: rows,
          theme: 'grid',
          headStyles: { fillColor: [37, 99, 235] }
        });

        const y = doc.lastAutoTable.finalY + 15;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text("Class Teacher's Data-Driven Comment:", 14, y);
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        
        const smartComment = generateSmartComment(learner, classMean);
        const commentLines = doc.splitTextToSize(smartComment, 180);
        doc.text(commentLines, 14, y + 6);

        const sigY = Math.min(y + (commentLines.length * 5) + 15, 270);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text("Teacher's Signature: __________________", 14, sigY);
        doc.text("Principal's Signature: __________________", 115, sigY);
      }
      doc.save(`SmartShule_${classId}_${exam?.name || 'Report'}.pdf`);
      setMessage(`✅ Generated ${chosen.length} report cards in ONE PDF.`);
    } catch (err) {
      console.error('Bulk PDF Error:', err);
      setMessage(`❌ ${err.message || 'PDF generation failed.'}`);
    } finally {
      setGenerating(false);
      setProgress('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-600 border border-gray-100 dark:border-gray-700 mt-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">🖨️ Bulk Report Cards</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Select a class and assessment. Export the whole class as ONE printable PDF with smart comments.
      </p>

      {message && (
        <p className={`mb-4 p-3 rounded text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Class</label>
          <select value={classId} onChange={e => setClassId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition">
            {classes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Assessment</label>
          <select value={examId} onChange={e => setExamId(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition">
            {exams.map(e => <option key={e.id} value={e.id}>{e.name} ({e.term})</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={generateBulkPDF}
            disabled={generating}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold disabled:bg-gray-400 transition focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {generating ? '⏳ Rendering...' : '📄 Generate Bulk PDF'}
          </button>
        </div>
      </div>

      {progress && <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{progress}</p>}
      
      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
            <tr>
              <th className="p-2 w-10 dark:text-gray-300"></th>
              <th className="p-2 text-left dark:text-gray-300">Admission No</th>
              <th className="p-2 text-left dark:text-gray-300">Subjects</th>
              <th className="p-2 text-left dark:text-gray-300">Mean</th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.student_id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                <td className="p-2">
                  <input type="checkbox" checked={selected.includes(r.student_id)} onChange={() => toggle(r.student_id)} className="rounded focus:ring-2 focus:ring-blue-500" />
                </td>
                <td className="p-2 font-medium dark:text-gray-200">{r.admission_number}</td>
                <td className="p-2 text-gray-500 dark:text-gray-400">{r.subjects.length}</td>
                <td className="p-2 font-semibold dark:text-gray-200">{r.mean ?? '—'}% (Class Avg: {classMean}%)</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500 dark:text-gray-400">No learners found for this class.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        {selected.length} of {results.length} learners selected · Tip: open the PDF and press Ctrl+P → Print All Pages.
      </p>
    </div>
  );
};

export default BulkReportCards;