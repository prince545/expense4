import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // For password toggle icons

const Input = ({ value, onChange, placeholder, label, type = 'text' }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;