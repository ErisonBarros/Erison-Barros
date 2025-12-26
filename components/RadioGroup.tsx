import React from 'react';

interface RadioGroupProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  name: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, value, onChange, name }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2 pl-1">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`flex items-center flex-1 min-w-[140px] p-3 rounded-xl border cursor-pointer transition-all select-none
              ${
                value === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-2"
            />
            <span className="text-sm font-medium whitespace-nowrap">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};