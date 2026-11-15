// src/components/AcademicsTab.jsx
import { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AcademicsTab = ({ studentId }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/academics/analytics/${studentId}`);
        setChartData({
          labels: res.data.labels,
          datasets: [{
            label: 'Mean Score (%)',
            data: res.data.data,
            borderColor: 'rgb(37, 99, 235)',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            tension: 0.3,
            fill: true,
          }],
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchAnalytics();
  }, [studentId]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#9ca3af' } },
      title: { display: true, text: 'Term-over-Term Academic Performance', color: '#9ca3af' },
    },
    scales: {
      y: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (%)', color: '#9ca3af' }, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
    }
  };

  if (loading) return <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading academic analytics...</p>;
  if (chartData.labels.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700/50 p-8 rounded-lg text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-600">
        <p className="text-lg font-semibold">No Academic Data Yet</p>
        <p className="text-sm">Marks have not been entered for this student.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Performance Trend</h3>
        <div className="h-64 md:h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Current Term Subject Grades</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[{ subject: 'Mathematics', grade: 'A', score: 85 }, { subject: 'English', grade: 'B+', score: 78 }, { subject: 'Kiswahili', grade: 'A-', score: 82 }, { subject: 'Science', grade: 'B', score: 75 }].map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-center border border-gray-100 dark:border-gray-600">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{item.subject}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{item.grade}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.score}/100</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AcademicsTab;