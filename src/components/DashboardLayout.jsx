// src/components/DashboardLayout.jsx
import { useState } from 'react';

const DashboardLayout = ({ title, subtitle, icon, children, sections }) => {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'overview');

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon}</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      {sections.length > 1 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition ${
                  activeSection === section.id
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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

      {/* Direct Children (for single-section dashboards) */}
      {sections.length === 0 && children}
    </div>
  );
};

export default DashboardLayout;