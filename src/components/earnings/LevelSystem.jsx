import { TrendingUp, Star } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatNumber } from '../../utils/formatCurrency';

// Props with Callback
// onUpgrade = function che je Parent thi aave
const LevelSystem = ({ level, balance, upgradeCost, onUpgrade }) => {
  const { isDarkTheme } = useTheme();

  // Computed Value from Props
  const progress = Math.min((balance / upgradeCost) * 100, 100);

  // Derived Boolean
  const canUpgrade = balance >= upgradeCost;

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      progressBg: 'bg-gray-800',
      progressBorder: 'border-gray-600',
      buttonDisabled: 'bg-gray-800 text-gray-500'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-300',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500',
      progressBg: 'bg-gray-100',
      progressBorder: 'border-gray-300',
      buttonDisabled: 'bg-gray-200 text-gray-400'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  // Array for Titles — Level based title system
  const getLevelTitle = (lvl) => {
    const titles = [
      'Beginner', 'Hustler', 'Trader', 'Investor', 'Businessman',
      'Entrepreneur', 'Mogul', 'Tycoon', 'Baron', 'Legend'
    ];
    return titles[Math.min(lvl - 1, titles.length - 1)];
  };

  return (
    <div className={`${c.cardBg} rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 
      border ${c.cardBorder} transition-colors duration-300`}
    >
      {/* Level Info Row */}
      <div className="flex justify-between items-center mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
          <h3 className={`${c.textPrimary} font-bold text-sm sm:text-lg`}>
            Lv.{level}
          </h3>
          <span className={`${c.textSecondary} text-xs sm:text-sm truncate`}>
            {getLevelTitle(level)}
          </span>
        </div>
        <span className={`text-[10px] sm:text-xs ${c.textSecondary} flex-shrink-0 ml-2`}>
          ₹{formatNumber(upgradeCost)}
        </span>
      </div>

      {/* Dynamic Width for Progress Bar */}
      <div className={`w-full ${c.progressBg} rounded-full h-2 sm:h-3 mb-3 
        overflow-hidden border ${c.progressBorder}`}
      >
        <div
          className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full 
            rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Disabled Button with Conditional Styling */}
      <button
        onClick={onUpgrade}
        disabled={!canUpgrade}
        className={`w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl 
          font-bold text-sm sm:text-base flex items-center justify-center 
          gap-1.5 sm:gap-2 transition-all duration-300 ${
            canUpgrade
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/25 active:scale-[0.98]'
              : `${c.buttonDisabled} cursor-not-allowed`
          }`}
      >
        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Upgrade ₹{formatNumber(upgradeCost)}</span>
      </button>
    </div>
  );
};

export default LevelSystem;