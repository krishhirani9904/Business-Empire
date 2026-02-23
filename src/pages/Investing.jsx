import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { formatINR } from '../components/investing/investingData';

import SharesTab from '../components/investing/SharesTab';
import RealEstateTab from '../components/investing/RealEstateTab';
import CryptoTab from '../components/investing/CryptoTab';
import AdBanner from '../components/earnings/AdBanner';

function Investing() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus, setIsInvestingActive } = useGame();
  const [activeTab, setActiveTab] = useState('shares');

  useEffect(() => {
    setIsInvestingActive(true);
    return () => setIsInvestingActive(false);
  }, [setIsInvestingActive]);

  const tabs = [
    { id: 'shares', label: 'Shares', icon: '📈' },
    { id: 'realestate', label: 'Real Estate', icon: '🏠' },
    { id: 'crypto', label: 'Crypto', icon: '₿' }
  ];

  const themeColors = isDarkTheme
    ? { bg: 'bg-gray-950', text: 'text-white', textSec: 'text-gray-400', cardBg: 'bg-gray-900', border: 'border-gray-800' }
    : { bg: 'bg-gray-50', text: 'text-gray-900', textSec: 'text-gray-500', cardBg: 'bg-white', border: 'border-gray-200' };

  return (
    <div className={`min-h-screen ${themeColors.bg} transition-colors duration-300 pb-2`}>
      <div className="max-w-full mx-auto pt-2">

        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className={`text-xl sm:text-2xl font-bold ${themeColors.text}`}>
              Investment <span className="text-green-500">Hub</span>
            </h2>
          </div>
          <p className={`text-xs sm:text-sm ${themeColors.textSec}`}>
            Invest Smart, Grow Wealth
          </p>
        </div>

        <div className={`mx-2 mb-4 p-4 rounded-2xl border ${themeColors.cardBg} ${themeColors.border}`}>
          <p className={`text-xs ${themeColors.textSec}`}>Available Balance</p>
          <p className={`text-2xl font-bold ${themeColors.text}`}>
            {formatINR(balance)}
          </p>
        </div>

        <div className="flex mx-2 mb-4 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300
                flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-[1.02]'
                    : isDarkTheme
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'shares' && <SharesTab />}
        {activeTab === 'realestate' && <RealEstateTab />}
        {activeTab === 'crypto' && <CryptoTab />}
      </div>

      <AdBanner
        onAdComplete={() => addBonus(50)}
        adDuration={5}
        rewardAmount={50}
      />
    </div>
  );
}

export default Investing;