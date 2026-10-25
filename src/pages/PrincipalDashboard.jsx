// src/pages/PrincipalDashboard.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TeacherAllocations from '../components/principal/TeacherAllocations';
// Overview & Analytics
import OverviewStats from '../components/principal/OverviewStats';
import SchoolAnalytics from '../components/principal/SchoolAnalytics';

// User & Staff Management
import UserManagement from '../components/UserManagement';
import TeacherManagement from '../components/principal/TeacherManagement';

// Student & Class Management
import StudentOnboarding from '../components/StudentOnboarding';
import ClassDirectory from '../components/ClassDirectory';
import ClassManagement from '../components/principal/ClassManagement';

// Academics & Reports
import AdminTools from '../components/AdminTools';
import BulkReportCards from '../components/BulkReportCards';

// Communications
import BulkSms from '../components/BulkSms';

const PrincipalDashboard = () => {
  const sections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <OverviewStats />
          <SchoolAnalytics />
        </div>
      )
    },
    {
      id: 'staff',
      label: 'Staff & Users',
      icon: '👥',
      content: (
        <div className="space-y-6">
          <TeacherManagement />
          <UserManagement />
        </div>
      )
    },
    {
     id: 'allocations',
     label: 'Teacher Allocations',
     icon: '📚',
     content: <TeacherAllocations />
   },
    {
      id: 'students',
      label: 'Students & Classes',
      icon: '🎓',
      content: (
        <div className="space-y-6">
          <ClassManagement />
          <StudentOnboarding />
          <ClassDirectory />
        </div>
      )
    },
    {
      id: 'academics',
      label: 'Academics',
      icon: '📚',
      content: (
        <div className="space-y-6">
          <AdminTools />
          <BulkReportCards />
        </div>
      )
    },
    {
      id: 'communications',
      label: 'Communications',
      icon: '📱',
      content: <BulkSms /> // ✅ FIXED: Standard JS comment, not JSX comment
    }
  ];

  return (
    <DashboardLayout
      title="Principal's Office"
      subtitle="Manage your school's operations, staff, students, and performance"
      icon="🏫"
      sections={sections}
    />
  );
};

export default PrincipalDashboard;