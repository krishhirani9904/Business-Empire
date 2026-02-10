// components/business/ActionButtons.jsx
import React from 'react';
import { Plus, GitMerge } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

function ActionButtons({ activeTab, onTabChange }) {
  const { isDarkTheme } = useTheme();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      textPrimary: 'text-white'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      textPrimary: 'text-gray-900'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <button
        onClick={() => onTabChange(activeTab === 'start' ? null : 'start')}
        className={`
          flex items-center justify-center gap-2 p-4 rounded-2xl font-medium
          transition-all duration-300 border-2
          ${activeTab === 'start'
            ? 'bg-blue-500 border-blue-500 text-white'
            : `${c.cardBg} ${c.cardBorder} ${c.textPrimary} hover:border-blue-500`
          }
        `}
      >
        <Plus className="w-5 h-5" />
        <span>Start Business</span>
      </button>

      <button
        onClick={() => onTabChange(activeTab === 'merge' ? null : 'merge')}
        className={`
          flex items-center justify-center gap-2 p-4 rounded-2xl font-medium
          transition-all duration-300 border-2
          ${activeTab === 'merge'
            ? 'bg-purple-500 border-purple-500 text-white'
            : `${c.cardBg} ${c.cardBorder} ${c.textPrimary} hover:border-purple-500`
          }
        `}
      >
        <GitMerge className="w-5 h-5" />
        <span>Merge Business</span>
      </button>
    </div>
  );
}

export default ActionButtons;