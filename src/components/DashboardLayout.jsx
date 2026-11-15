// src/components/DashboardLayout.jsx
import { useState } from 'react';

// ✅ FIX 1: Added `sections = []` as a default parameter to prevent undefined crashes
const DashboardLayout = ({ title, subtitle, icon, children, sections = [] }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'overview');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-blue-600">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{title}</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* ✅ FIX 2: Multi-Section Navigation (Only renders if there are 2+ sections) */}
      {sections.length > 1 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b dark:border-gray-700 overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition ${
                  activeSection === section.id
                    ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>

          {/* Active Section Content */}
          <div className="p-6">
            {sections.find(s => s.id === activeSection)?.content}
          </div>
        </div>
      )}

      {/* ✅ FIX 3: Single Section Content (Renders cleanly without tabs) */}
      {sections.length === 1 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {sections[0].content}
        </div>
      )}

      {/* ✅ FIX 4: Direct Children Fallback (Wrapped in a card for consistent styling) */}
      {sections.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {children}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;