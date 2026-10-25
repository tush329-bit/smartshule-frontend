// src/components/ParentAcademics.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const API = import.meta.env.VITE_API_URL;

const ParentAcademics = ({ studentId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('smartshule_token');
        const res = await axios.get(`${API}/academics/analytics/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setChartData({
          labels: res.data.labels,
          datasets: [{
            label: 'Mean Score (%)',
            data: res.data.data,
            borderColor: 'rgb(16, 185, 129)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointHoverRadius: 7
          }]
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchAnalytics();
  }, [studentId]);

  if (loading) return <p className="text-center py-12 text-gray-500 dark:text-gray-400">Loading academic trends...</p>;

  if (!chartData || chartData.labels.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600">
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300">No Academic Data Yet</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Marks have not been entered for this learner.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-emerald-600 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">📈 Academic Performance Trend</h3>
      <div className="h-80 w-full">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { labels: { color: '#9ca3af' } } // Gray text for dark mode compatibility
            },
            scales: {
              y: { beginAtZero: true, max: 100, title: { display: true, text: 'Score (%)' }, ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
              x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ParentAcademics;