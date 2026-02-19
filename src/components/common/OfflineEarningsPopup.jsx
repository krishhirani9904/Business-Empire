import React from 'react';
import { useGame } from '../../context/GameContext';
import { useTheme } from '../../context/ThemeContext';
import { Coins } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

function OfflineEarningsPopup() {
  const { offlineEarnings, clearOfflineEarnings } = useGame();
  const { isDarkTheme } = useTheme();

  // CONCEPT: Early Return / Conditional Rendering
  // Offline earnings nathi to kaij render na karo
  if (!offlineEarnings || offlineEarnings <= 0) return null;

  return (
    // CONCEPT: Modal Overlay Pattern
    // fixed inset-0 = Puru screen cover kare
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`
        ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}
        border rounded-2xl p-6 max-w-sm w-full text-center
      `}>
        {/* Icon Circle */}
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 
          rounded-full flex items-center justify-center mx-auto mb-4">
          <Coins className="w-8 h-8 text-white" />
        </div>

        <h3 className={`text-xl font-bold mb-2 
          ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Welcome Back! 🎉
        </h3>

        <p className={`text-sm mb-3 
          ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
          Your businesses earned while you were away
        </p>

        <div className="text-3xl font-bold text-green-500 mb-4">
          +{formatCurrency(offlineEarnings)}
        </div>

        {/* Click → offlineEarnings = 0 → popup hide (early return) */}
        <button
          onClick={clearOfflineEarnings}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 
            text-white py-3 rounded-xl font-bold text-base 
            hover:scale-105 transition-transform"
        >
          Collect Earnings
        </button>
      </div>
    </div>
  );
}

export default OfflineEarningsPopup;