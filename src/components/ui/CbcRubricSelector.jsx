// src/components/ui/CbcRubricSelector.jsx
import React from 'react';

const CbcRubricSelector = ({ value, onChange, label = "Performance Level" }) => {
  const options = [
    { value: 'EE', label: 'Exceeding Expectations (EE)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300' },
    { value: 'ME', label: 'Meeting Expectations (ME)', color: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300' },
    { value: 'AE', label: 'Approaching Expectations (AE)', color: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { value: 'BE', label: 'Below Expectations (BE)', color: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
              value === opt.value 
                ? `${opt.color} border-current ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-gray-800` 
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400'
            }`}
          >
            <span className="text-lg">{opt.value === 'EE' ? '🌟' : opt.value === 'ME' ? '✅' : opt.value === 'AE' ? '⚠️' : '📉'}</span>
            <span>{opt.value}</span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Selected: {options.find(o => o.value === value)?.label}
        </p>
      )}
    </div>
  );
};

export default CbcRubricSelector;