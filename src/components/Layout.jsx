// src/components/Layout.jsx
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  // Extract school branding, fallback to defaults if super_admin (no school)
  const school = user?.school || {
    name: 'SmartShule',
    primary_color: '#3b82f6',
    secondary_color: '#10b981'
  };

  const handleLogout = () => {
    localStorage.removeItem('smartshule_token');
    localStorage.removeItem('smartshule_user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav
        className="shadow-md border-b border-gray-200 dark:border-gray-700 transition-colors duration-300"
        style={{ backgroundColor: isDark ? '#1f2937' : school.primary_color }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              {/* ✅ Dynamically display school logo or fallback icon */}
              {school.logo_url ? (
                <img src={school.logo_url} alt="School Logo" className="h-10 w-10 rounded-full bg-white p-1" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                  🏫
                </div>
              )}

              {/* ✅ Dynamically display school name */}
              <span className="text-xl font-bold text-white drop-shadow-md">
                {school.name}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label="Toggle Dark Mode"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-white bg-red-500/80 hover:bg-red-600 px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;