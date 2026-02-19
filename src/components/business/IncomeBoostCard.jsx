import React from 'react';
import { Clock, IndianRupee, Play, Zap, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { formatNumber } from '../../utils/formatCurrency';

function IncomeBoostCard({ totalIncome }) {
  const { isDarkTheme } = useTheme();

  // SEPARATE: Fakat business boost values
  const {
    businessBoostActive: isBoostActive,
    businessAdStatus: adStatus,
    businessBoostTimer: boostTimer,
    startBusinessAd: startWatchingAd
  } = useGame();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900', cardBorder: 'border-gray-700',
      textPrimary: 'text-white', textSecondary: 'text-gray-400'
    },
    light: {
      cardBg: 'bg-white', cardBorder: 'border-gray-200',
      textPrimary: 'text-gray-900', textSecondary: 'text-gray-600'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4 mb-4`}>
      <div className="flex items-center justify-between">
        {/* Income Display */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className={`w-4 h-4 ${c.textSecondary}`} />
            <span className={`text-xs ${c.textSecondary}`}>Business Income</span>
            {isBoostActive && (
              <span className="bg-yellow-500 text-black text-[10px] px-1.5 
                py-0.5 rounded font-bold animate-pulse">
                2x BOOST
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-5 h-5 text-green-500" />
            <span className={`text-2xl font-bold ${c.textPrimary}`}>
              {formatNumber(totalIncome)}
            </span>
            <span className={`text-xs ${c.textSecondary}`}>/hr</span>
          </div>
          {isBoostActive && (
            <p className="text-yellow-500 text-xs mt-1">
              Business boost: {boostTimer}s left
            </p>
          )}
        </div>

        {/* Business Boost Button */}
        <button
          onClick={startWatchingAd}
          disabled={adStatus !== 'idle'}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
            transition-all duration-300
            ${adStatus === 'watching'
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
              : adStatus === 'boosted'
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:scale-105'
            }
          `}
        >
          {adStatus === 'watching' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{boostTimer}s</span>
            </>
          ) : adStatus === 'boosted' ? (
            <>
              <Zap className="w-4 h-4" />
              <span>{boostTimer}s</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Boost</span>
              <span className="text-xs opacity-75">2x</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default IncomeBoostCard;