// src/components/teacher/ClassComparison.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

   const API = import.meta.env.VITE_API_URL;

const ClassComparison = () => {
  const [comparisonType, setComparisonType] = useState('class');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem('smartshule_token')}`
  });

  // Load classes and students
  useEffect(() => {
    const load = async () => {
      try {
        const studentsRes = await axios.get(`${API}/students`, { headers: headers() });
        const uniqueClasses = [...new Set(studentsRes.data.students.map(s => s.class_id))].sort();
        setClasses(uniqueClasses);
        setStudents(studentsRes.data.students);
        if (uniqueClasses.length) setSelectedClass(uniqueClasses[0]);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    load();
  }, []);

  // Fetch comparison data
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClass && comparisonType !== 'student') return;
      if (comparisonType === 'student' && !selectedStudent) return;

      setLoading(true);
      try {
        let url = `${API}/academics/performance/comparison?type=${comparisonType}`;
        
        if (comparisonType === 'student') {
          url += `&student_id=${selectedStudent}`;
        } else if (comparisonType === 'stream') {
          url += `&class_id=Grade`; // Match all Grade classes
        } else {
          url += `&class_id=${selectedClass}`;
        }

        const res = await axios.get(url, { headers: headers() });
        setData(res.data.data);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [comparisonType, selectedClass, selectedStudent]);

  // Prepare chart data based on comparison type
  const getChartData = () => {
    if (!data || data.length === 0) return null;

    if (comparisonType === 'class') {
      // Line chart: Class average across exams
      const labels = [...new Set(data.map(d => d.exam_name))];
      const scores = labels.map(exam => {
        const row = data.find(d => d.exam_name === exam);
        return row ? row.average_score : 0;
      });

      return {
        labels,
        datasets: [{
          label: 'Class Average (%)',
          data: scores,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3
        }]
      };
    }

    if (comparisonType === 'stream') {
      // Grouped bar chart: Compare streams across exams
      const exams = [...new Set(data.map(d => d.exam_name))];
      const streams = [...new Set(data.map(d => d.class_id))];

      const datasets = streams.map((stream, index) => {
        const colors = ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(139, 92, 246)'];
        return {
          label: stream,
          data: exams.map(exam => {
            const row = data.find(d => d.class_id === stream && d.exam_name === exam);
            return row ? row.average_score : 0;
          }),
          backgroundColor: colors[index % colors.length]
        };
      });

      return { labels: exams, datasets };
    }

    if (comparisonType === 'student') {
      // Multi-line chart: Student performance in each subject across exams
      const exams = [...new Set(data.map(d => d.exam_name))];
      const subjects = [...new Set(data.map(d => d.subject_name))];

      const datasets = subjects.map((subject, index) => {
        const colors = ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(139, 92, 246)', 'rgb(239, 68, 68)'];
        return {
          label: subject,
          data: exams.map(exam => {
            const row = data.find(d => d.subject_name === subject && d.exam_name === exam);
            return row ? row.score : null;
          }),
          borderColor: colors[index % colors.length],
          tension: 0.3
        };
      });

      return { labels: exams, datasets };
    }

    if (comparisonType === 'subject') {
      // Grouped bar chart: Subject performance across exams
      const exams = [...new Set(data.map(d => d.exam_name))];
      const subjects = [...new Set(data.map(d => d.subject_name))];

      const datasets = subjects.map((subject, index) => {
        const colors = ['rgb(59, 130, 246)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(139, 92, 246)'];
        return {
          label: subject,
          data: exams.map(exam => {
            const row = data.find(d => d.subject_name === subject && d.exam_name === exam);
            return row ? row.average_score : 0;
          }),
          backgroundColor: colors[index % colors.length]
        };
      });

      return { labels: exams, datasets };
    }

    return null;
  };

  const chartData = getChartData();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">📈 Performance Comparison Tool</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comparison Type</label>
            <select
              value={comparisonType}
              onChange={e => setComparisonType(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="class">Class Trend (Average across exams)</option>
              <option value="stream">Stream Comparison (Multiple classes)</option>
              <option value="student">Student Trend (Individual performance)</option>
              <option value="subject">Subject Analysis (By learning area)</option>
            </select>
          </div>

          {comparisonType !== 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {comparisonType === 'stream' ? 'Class Pattern' : 'Select Class'}
              </label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                {comparisonType === 'stream' ? (
                  <>
                    <option value="Grade">All Grade Classes</option>
                    <option value="Grade-6">Grade 6 Streams</option>
                    <option value="Grade-7">Grade 7 Streams</option>
                    <option value="Grade-8">Grade 8 Streams</option>
                  </>
                ) : (
                  classes.map(c => <option key={c} value={c}>{c}</option>)
                )}
              </select>
            </div>
          )}

          {comparisonType === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <select
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.admission_number} ({s.class_id})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p className="text-center py-12 text-gray-500">Loading analytics...</p>
        ) : chartData ? (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              {comparisonType === 'class' && `Class Performance Trend - ${selectedClass}`}
              {comparisonType === 'stream' && 'Stream Comparison Across Exams'}
              {comparisonType === 'student' && 'Individual Student Performance'}
              {comparisonType === 'subject' && `Subject-wise Performance - ${selectedClass}`}
            </h3>
            <div className="h-96">
              {comparisonType === 'stream' || comparisonType === 'subject' ? (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Score (%)' }
                      }
                    }
                  }}
                />
              ) : (
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      title: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                        title: { display: true, text: 'Score (%)' }
                      }
                    }
                  }}
                />
              )}
            </div>
          </>
        ) : (
          <p className="text-center py-12 text-gray-500">No data available for this comparison.</p>
        )}
      </div>

      {/* Data Table */}
      {data && data.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {comparisonType === 'stream' && <th className="p-3 text-left">Stream</th>}
                  {comparisonType === 'student' && <th className="p-3 text-left">Subject</th>}
                  {comparisonType === 'subject' && <th className="p-3 text-left">Subject</th>}
                  <th className="p-3 text-left">Exam</th>
                  <th className="p-3 text-left">Term</th>
                  {comparisonType === 'student' ? (
                    <th className="p-3 text-left">Score</th>
                  ) : (
                    <>
                      <th className="p-3 text-left">Average</th>
                      <th className="p-3 text-left">Students</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50">
                    {comparisonType === 'stream' && <td className="p-3 font-medium">{row.class_id}</td>}
                    {comparisonType === 'student' && <td className="p-3 font-medium">{row.subject_name}</td>}
                    {comparisonType === 'subject' && <td className="p-3 font-medium">{row.subject_name}</td>}
                    <td className="p-3">{row.exam_name}</td>
                    <td className="p-3">{row.term}</td>
                    {comparisonType === 'student' ? (
                      <td className="p-3 font-bold">{row.score}%</td>
                    ) : (
                      <>
                        <td className="p-3 font-bold">{row.average_score}%</td>
                        <td className="p-3">{row.students_count}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassComparison;