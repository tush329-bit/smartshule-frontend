// src/components/principal/OverviewStats.jsx
const OverviewStats = () => {
  // ✅ FIX: Define full, static class names so Tailwind's scanner can find them
  const stats = [
    { 
      label: 'Total Students', 
      value: '0', 
      icon: '🎓', 
      borderClass: 'border-blue-600', 
      textClass: 'text-blue-600', 
      bgClass: 'bg-blue-50 dark:bg-blue-900/20' 
    },
    { 
      label: 'Total Teachers', 
      value: '0', 
      icon: '👨‍🏫', 
      borderClass: 'border-green-600', 
      textClass: 'text-green-600', 
      bgClass: 'bg-green-50 dark:bg-green-900/20' 
    },
    { 
      label: 'Total Parents', 
      value: '0', 
      icon: '👨‍👩‍👧', 
      borderClass: 'border-purple-600', 
      textClass: 'text-purple-600', 
      bgClass: 'bg-purple-50 dark:bg-purple-900/20' 
    },
    { 
      label: 'Avg Performance', 
      value: '0%', 
      icon: '📈', 
      borderClass: 'border-orange-600', 
      textClass: 'text-orange-600', 
      bgClass: 'bg-orange-50 dark:bg-orange-900/20' 
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          // ✅ FIX: Use the static class variables directly in the template literal
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 ${stat.borderClass} hover:shadow-lg transition`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {stat.label}
              </p>
              <p className={`text-3xl font-bold ${stat.textClass} mt-2`}>
                {stat.value}
              </p>
            </div>
            {/* ✅ Added a subtle background circle to the icon for better visual hierarchy */}
            <span className={`text-4xl p-3 rounded-full ${stat.bgClass}`}>
              {stat.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;