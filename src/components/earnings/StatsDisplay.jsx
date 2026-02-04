import React from 'react';
import { IndianRupee, Zap, MousePointerClick } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const StatsDisplay = ({ balance, perClick, isBoosted }) => {
  const { isDarkTheme } = useTheme();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      boostBg: 'bg-purple-900/50',
      boostBorder: 'border-purple-500'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-300',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500',
      boostBg: 'bg-purple-100',
      boostBorder: 'border-purple-400'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  // Format large numbers
  const formatBalance = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
      {/* Balance Card */}
      <div className={`${c.cardBg} p-3 sm:p-4 rounded-xl sm:rounded-2xl border ${c.cardBorder} transition-colors duration-300`}>
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
          <span className={`${c.textSecondary} text-[10px] sm:text-xs font-medium`}>Balance</span>
        </div>
        <div className="flex items-center text-green-500">
          <span className="text-lg sm:text-2xl md:text-3xl font-bold truncate">
            ₹{formatBalance(balance)}
          </span>
        </div>
      </div>

      {/* Per Click Card */}
      <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
        isBoosted
          ? `${c.boostBg} ${c.boostBorder}`
          : `${c.cardBg} ${c.cardBorder}`
      }`}>
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
          <MousePointerClick className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBoosted ? 'text-purple-500' : 'text-yellow-500'}`} />
          <span className={`${isBoosted ? 'text-purple-400' : c.textSecondary} text-[10px] sm:text-xs font-medium`}>
            {isBoosted ? '2X Active!' : 'Per Click'}
          </span>
        </div>
        <div className="flex items-center">
          <span className={`text-lg sm:text-2xl md:text-3xl font-bold ${isBoosted ? 'text-purple-400' : 'text-yellow-500'}`}>
            ₹{perClick}
          </span>
          {isBoosted && <Zap className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" fill="currentColor" />}
        </div>
      </div>
    </div>
  );
};

export default StatsDisplay;