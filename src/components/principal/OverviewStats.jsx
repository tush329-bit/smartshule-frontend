// src/components/principal/OverviewStats.jsx
const OverviewStats = () => {
  const stats = [
    { label: 'Total Students', value: '0', icon: '🎓', color: 'blue' },
    { label: 'Total Teachers', value: '0', icon: '👨‍🏫', color: 'green' },
    { label: 'Total Parents', value: '0', icon: '👨‍👩‍👧', color: 'purple' },
    { label: 'Avg Performance', value: '0%', icon: '📈', color: 'orange' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${stat.color}-600 hover:shadow-lg transition`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
            <span className="text-4xl opacity-50">{stat.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OverviewStats;