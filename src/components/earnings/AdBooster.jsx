import React from 'react';
import { Play, Loader2, Clock, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';

// Earnings-ONLY Booster
// Aa component FAKAT earnings page mate che
// earningsAdStatus, earningsBoostTimer, startEarningsAd use kare
const AdBooster = () => {
  const { isDarkTheme } = useTheme();

  // Fakat earnings boost values
  const {
    earningsAdStatus: adStatus,
    earningsBoostTimer: boostTimer,
    startEarningsAd: startWatchingAd
  } = useGame();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800',
      innerBorder: 'border-gray-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      boostBg: 'bg-purple-900/40',
      boostBorder: 'border-purple-500'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-300',
      innerBg: 'bg-gray-50',
      innerBorder: 'border-gray-200',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500',
      boostBg: 'bg-purple-100',
      boostBorder: 'border-purple-400'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className={`${c.cardBg} rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-3 
      border ${c.cardBorder} transition-colors duration-300`}
    >
      <h3 className={`${c.textPrimary} font-bold text-sm sm:text-base mb-2 sm:mb-3 
        flex items-center gap-1.5 sm:gap-2`}
      >
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
        Earnings Boost
      </h3>

      <div className={`${c.innerBg} p-3 sm:p-4 rounded-lg sm:rounded-xl 
        border ${c.innerBorder} transition-colors duration-300`}
      >
        {/* IDLE — Watch Ad Button */}
        {adStatus === 'idle' && (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-purple-500 font-bold text-sm sm:text-lg">
                2X Click Income
              </p>
              <p className={`${c.textSecondary} text-[10px] sm:text-xs`}>
                Affects tap earnings only • 1 min
              </p>
            </div>
            <button
              onClick={startWatchingAd}
              className="bg-purple-500 hover:bg-purple-600 text-white 
                px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl 
                font-medium text-sm sm:text-base transition-colors 
                flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Watch
            </button>
          </div>
        )}

        {/* WATCHING — Ad Playing */}
        {adStatus === 'watching' && (
          <div className="flex flex-col items-center justify-center text-center py-2 sm:py-3">
            <Loader2 className="animate-spin text-purple-500 w-8 h-8 sm:w-10 sm:h-10 mb-2" />
            <p className={`${c.textPrimary} text-sm sm:text-base`}>
              Watching Ad...
            </p>
            <p className={`${c.textSecondary} text-xs sm:text-sm`}>
              Reward in: {boostTimer}s
            </p>
          </div>
        )}

        {/* BOOSTED — 2X Active */}
        {adStatus === 'boosted' && (
          <div className={`flex items-center justify-between ${c.boostBg} 
            p-2.5 sm:p-3 rounded-lg sm:rounded-xl border ${c.boostBorder}`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="text-green-500 font-bold text-xs sm:text-base">
                2X CLICKS ACTIVE
              </span>
            </div>
            <span className={`${c.textPrimary} font-mono text-base sm:text-lg`}>
              {boostTimer}s
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBooster;