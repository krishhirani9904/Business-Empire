// components/business/IncomeBoostCard.jsx
import React, { useState, useEffect } from 'react';
import { Clock, IndianRupee, Play, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from './businessData';

function IncomeBoostCard({ totalIncome, onBoostChange }) {
  const { isDarkTheme } = useTheme();
  
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [adWatching, setAdWatching] = useState(false);
  const [adCountdown, setAdCountdown] = useState(0);

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  // Notify parent about boost status
  useEffect(() => {
    onBoostChange && onBoostChange(isBoostActive);
  }, [isBoostActive, onBoostChange]);

  // Watch Ad for Boost
  const handleWatchAd = () => {
    setAdWatching(true);
    setAdCountdown(5);

    const timer = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdWatching(false);
          setIsBoostActive(true);
          setBoostTimeLeft(30);
          
          // Boost timer
          const boostTimer = setInterval(() => {
            setBoostTimeLeft(prev => {
              if (prev <= 1) {
                clearInterval(boostTimer);
                setIsBoostActive(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const displayIncome = isBoostActive ? totalIncome * 2 : totalIncome;

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4 mb-4`}>
      <div className="flex items-center justify-between">
        {/* Income Display */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className={`w-4 h-4 ${c.textSecondary}`} />
            <span className={`text-xs ${c.textSecondary}`}>Income Per Hour</span>
            {isBoostActive && (
              <span className="bg-yellow-500 text-black text-[10px] px-1.5 py-0.5 rounded font-bold animate-pulse">
                2x BOOST
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <IndianRupee className="w-5 h-5 text-green-500" />
            <span className={`text-2xl font-bold ${c.textPrimary}`}>
              {formatCurrency(displayIncome)}
            </span>
            <span className={`text-xs ${c.textSecondary}`}>/hr</span>
          </div>
          {isBoostActive && (
            <p className="text-yellow-500 text-xs mt-1">
              Boost ends in {boostTimeLeft}s
            </p>
          )}
        </div>

        {/* Boost Button */}
        <button
          onClick={handleWatchAd}
          disabled={adWatching || isBoostActive}
          className={`
            flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm
            transition-all duration-300
            ${adWatching 
              ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
              : isBoostActive
                ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500'
                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:scale-105'
            }
          `}
        >
          {adWatching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{adCountdown}s</span>
            </>
          ) : isBoostActive ? (
            <>
              <Zap className="w-4 h-4" />
              <span>Active</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Watch Ad</span>
              <span className="text-xs opacity-75">2x</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default IncomeBoostCard;