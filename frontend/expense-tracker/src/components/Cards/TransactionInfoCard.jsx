import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addThousandsSeparator } from '../../utils/helper';
import { LuChevronDown, LuEye } from 'react-icons/lu';

const TransactionInfoCard = ({ 
  title, 
  amount, 
  date, 
  icon, 
  type, 
  color = 'green',
  showDropdown = false 
}) => {
  const navigate = useNavigate();
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdownMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleViewDetails = () => {
    setShowDropdownMenu(false);
    if (type === 'income') {
      navigate('/income');
    } else {
      navigate('/expense');
    }
  };

  const getAmountColor = () => {
    return type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  };

  const getAmountPrefix = () => {
    return type === 'income' ? '+' : '-';
  };

  const getTypeColor = () => {
    return type === 'income' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:scale-[1.02] group">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
          <span className="text-xl">{icon || (type === 'income' ? '💰' : '💸')}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {type === 'income' ? 'Income' : 'Expense'} • {date}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-lg font-bold ${getAmountColor()}`}>
          {amount}
        </span>
        <div className={`w-2 h-2 rounded-full ${getTypeColor()} animate-pulse`}></div>
        
        {showDropdown && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdownMenu(!showDropdownMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-300"
            >
              <LuChevronDown 
                size={16} 
                className={`transition-transform duration-300 ${showDropdownMenu ? 'rotate-180' : ''}`}
              />
            </button>
            
            {showDropdownMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-10 animate-slide-up">
                <button
                  onClick={handleViewDetails}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-xl transition-colors flex items-center gap-2"
                >
                  <LuEye size={16} />
                  View Details
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionInfoCard;
