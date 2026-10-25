// src/components/principal/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

   const API = import.meta.env.VITE_API_URL;

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('smartshule_token');
      const res = await axios.get(`${API}/analytics/school`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(res.data.analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading insights...</div>;
  if (!analytics) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

  // Transform gender data for Recharts
  const genderData = analytics.genderPerformance.reduce((acc, curr) => {
    const existing = acc.find(item => item.subject === curr.subject_name);
    if (existing) {
      existing[curr.gender === 'Male' ? 'male_avg' : 'female_avg'] = curr.average_score;
    } else {
      acc.push({
        subject: curr.subject_name,
        male_avg: curr.gender === 'Male' ? curr.average_score : 0,
        female_avg: curr.gender === 'Female' ? curr.average_score : 0
      });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="p-6 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">📊 School Performance Insights</h2>
        <button onClick={fetchAnalytics} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">🔄 Refresh Data</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Class Performance */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">🏆 Average Performance by Class</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.classPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="class_id" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="average_score" fill="#6366f1" radius={[4, 4, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Gender Performance Gap */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">⚖️ Gender Performance in Core Subjects</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={genderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="subject" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="male_avg" fill="#3b82f6" name="Boys Avg" radius={[4, 4, 0, 0]} />
              <Bar dataKey="female_avg" fill="#ec4899" name="Girls Avg" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Subject Mastery (Identify Weak Areas) */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-4">📉 Subject Mastery (Lowest to Highest)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={analytics.subjectMastery}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
              <XAxis type="number" stroke="#9ca3af" domain={[0, 100]} />
              <YAxis dataKey="subject_name" type="category" stroke="#9ca3af" width={150} />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }} />
              <Bar dataKey="average_score" fill="#f59e0b" radius={[0, 4, 4, 0]} name="School Avg" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-gray-500 mt-2 text-center">💡 Tip: Subjects on the left require targeted teacher support and resource allocation.</p>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsDashboard;