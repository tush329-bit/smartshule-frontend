// src/pages/TeacherDashboard.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import MyClasses from '../components/teacher/MyClasses';
import MarkEntry from '../components/teacher/MarkEntry';
import StudentAnalytics from '../components/teacher/StudentAnalytics';
import ClassComparison from '../components/teacher/ClassComparison';
import BulkReportCards from '../components/BulkReportCards';

const TeacherDashboard = () => {
  const sections = [
    {
      id: 'my-classes',
      label: 'My Classes',
      icon: '📚',
      content: <MyClasses />
    },
    {
      id: 'mark-entry',
      label: 'Mark Entry',
      icon: '✍️',
      content: <MarkEntry />
    },
    {
      id: 'analytics',
      label: 'Student Analytics',
      icon: '📊',
      content: <StudentAnalytics />
    },
    {
      id: 'comparison',
      label: 'Performance Comparison',
      icon: '📈',
      content: <ClassComparison />
    },
    {
      id: 'reports',
      label: 'Report Cards',
      icon: '📄',
      content: <BulkReportCards />
    }
  ];

  return (
    <DashboardLayout
      title="Teacher's Portal"
      subtitle="Manage your classes, enter marks, and track student performance"
      icon="👨‍🏫"
      sections={sections}
    />
  );
};

export default TeacherDashboard;