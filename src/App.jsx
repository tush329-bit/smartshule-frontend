// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './components/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import PrincipalDashboard from './pages/PrincipalDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

// A wrapper component to protect routes and apply the Layout
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  // Wrap the children in our Layout (which includes the dark mode toggle & logout)
  return <Layout>{children}</Layout>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      
      {/* Protected Dashboard Route */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            {/* Dynamically render dashboard based on role */}
            {user?.role === 'super_admin' ? (
              <SuperAdminDashboard />
            ) : user?.role === 'principal' ? (
              <PrincipalDashboard />
            ) : user?.role === 'teacher' ? (
              <TeacherDashboard />
            ) : user?.role === 'parent' || user?.role === 'student' ? (
              <ParentDashboard />
            ) : (
              <div className="p-8 text-center text-gray-500">
                Dashboard under construction for role: {user?.role}
              </div>
            )}
          </ProtectedRoute>
        } 
      />

      {/* Fallback route: redirect everything else to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;