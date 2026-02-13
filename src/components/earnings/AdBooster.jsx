import React, { useState, useEffect, useRef } from 'react';
import { Play, Loader2, Clock, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdBooster = ({ onBoostActivate }) => {
  const { isDarkTheme } = useTheme();
  const [adStatus, setAdStatus] = useState('idle');
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);

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

  // Fixed: Single timer effect with proper cleanup
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;

            if (adStatus === 'watching') {
              setAdStatus('boosted');
              onBoostActivate(true);
              return 60; // Start boost timer
            } else if (adStatus === 'boosted') {
              setAdStatus('idle');
              onBoostActivate(false);
              return 0;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [adStatus, timer > 0]); // Only re-run when status changes or timer starts/stops

  const startAd = () => {
    setAdStatus('watching');
    setTimer(30);
  };

  return (
    <div className={`${c.cardBg} rounded-xl sm:rounded-2xl p-3 sm:p-4 mt-3 border ${c.cardBorder} transition-colors duration-300`}>
      <h3 className={`${c.textPrimary} font-bold text-sm sm:text-base mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2`}>
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
        Ad Boost
      </h3>

      <div className={`${c.innerBg} p-3 sm:p-4 rounded-lg sm:rounded-xl border ${c.innerBorder} transition-colors duration-300`}>
        {adStatus === 'idle' && (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-purple-500 font-bold text-sm sm:text-lg">2X Income</p>
              <p className={`${c.textSecondary} text-[10px] sm:text-xs`}>Duration: 1 min</p>
            </div>
            <button
              onClick={startAd}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-colors flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Watch
            </button>
          </div>
        )}

        {adStatus === 'watching' && (
          <div className="flex flex-col items-center justify-center text-center py-2 sm:py-3">
            <Loader2 className="animate-spin text-purple-500 w-8 h-8 sm:w-10 sm:h-10 mb-2" />
            <p className={`${c.textPrimary} text-sm sm:text-base`}>Watching Ad...</p>
            <p className={`${c.textSecondary} text-xs sm:text-sm`}>Reward in: {timer}s</p>
          </div>
        )}

        {adStatus === 'boosted' && (
          <div className={`flex items-center justify-between ${c.boostBg} p-2.5 sm:p-3 rounded-lg sm:rounded-xl border ${c.boostBorder}`}>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="text-green-500 w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
              <span className="text-green-500 font-bold text-xs sm:text-base">2X ACTIVE</span>
            </div>
            <span className={`${c.textPrimary} font-mono text-base sm:text-lg`}>{timer}s</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdBooster;