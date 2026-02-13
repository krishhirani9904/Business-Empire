// src/pages/Investing.jsx
import React, { useState } from 'react';
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
  const { balance, addBonus, calculateTotalIncome } = useGame();
  const [activeTab, setActiveTab] = useState('shares');

  const totalIncome = calculateTotalIncome();

  const tabs = [
    { id: 'shares', label: 'Shares', icon: '📈' },
    { id: 'realestate', label: 'Real Estate', icon: '🏠' },
    { id: 'crypto', label: 'Crypto', icon: '🪙' }
  ];

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300 pb-2`}>
      <div className="max-w-full mx-auto pt-2">

        {/* Header */}
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="w-6 h-6 text-green-500" />
            <h2 className={`text-xl sm:text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Investment <span className="text-green-500">Hub</span>
            </h2>
          </div>
          <p className={`text-xs sm:text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            Invest Smart, Grow Wealth
          </p>
        </div>

        {/* Balance Card */}
        <div className={`mx-2 mb-4 p-4 rounded-2xl border ${
          isDarkTheme ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Available Balance</p>
              <p className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {formatINR(balance)}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Total Income</p>
              <p className="text-lg font-bold text-green-500">
                +{formatINR(totalIncome)}/hr
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex mx-2 mb-4 gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 scale-[1.02]'
                  : isDarkTheme
                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'shares' && <SharesTab />}
        {activeTab === 'realestate' && <RealEstateTab />}
        {activeTab === 'crypto' && <CryptoTab />}
      </div>

      <AdBanner onAdComplete={() => addBonus(50)} adDuration={5} />
    </div>
  );
}

export default Investing;