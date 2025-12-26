import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, suffix, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1 pl-1">
        {label} {suffix && <span className="text-gray-500 font-normal">{suffix}</span>}
      </label>
      <input
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white"
        {...props}
      />
    </div>
  );
};