import React, { useState, useEffect, useRef } from 'react';
import { Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';

import IncomeBoostCard from '../components/business/IncomeBoostCard';
import ActionButtons from '../components/business/ActionButtons';
import BusinessList from '../components/business/BusinessList';
import BusinessDetailModal from '../components/business/BusinessDetailModal';
import MergerPanel from '../components/business/MergerPanel';
import OwnedBusinessList from '../components/business/OwnedBusinessList';
import AdBanner from '../components/earnings/AdBanner';

function Business() {
  const { isDarkTheme } = useTheme();

  const {
    balance,
    ownedBusinesses,
    mergedBusinesses,
    calculateTotalIncome,
    getOwnedCount,
    handleBuyBusiness,
    handleMerge,
    handleSellBusiness,
    addBonus
  } = useGame();

  const [activeTab, setActiveTab] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const buyTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (buyTimeoutRef.current) clearTimeout(buyTimeoutRef.current);
    };
  }, []);

  const colors = {
    dark: { bg: 'bg-gray-950', textPrimary: 'text-white', textSecondary: 'text-gray-400' },
    light: { bg: 'bg-white', textPrimary: 'text-gray-900', textSecondary: 'text-gray-600' }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  const totalIncome = calculateTotalIncome();

  const onBuyBusiness = (business, size, customName) => {
    handleBuyBusiness(business, size, customName);

    if (buyTimeoutRef.current) clearTimeout(buyTimeoutRef.current);

    buyTimeoutRef.current = setTimeout(() => {
      setSelectedBusiness(null);
      buyTimeoutRef.current = null;
    }, 300);
  };

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300 pb-2`}>
      <div className="max-w-full mx-auto pt-2">

        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Briefcase className="w-6 h-6 text-blue-500" />
            <h2 className={`text-xl sm:text-2xl font-bold ${c.textPrimary}`}>
              Business <span className="text-blue-500">Empire</span>
            </h2>
          </div>
          <p className={`text-xs sm:text-sm ${c.textSecondary}`}>
            Start, Grow & Merge Your Businesses
          </p>
        </div>

        <IncomeBoostCard totalIncome={totalIncome} />

        <ActionButtons
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'start' && (
          <BusinessList
            ownedBusinesses={ownedBusinesses}
            onSelectBusiness={setSelectedBusiness}
            getOwnedCount={getOwnedCount}
          />
        )}

        {selectedBusiness && (
          <BusinessDetailModal
            business={selectedBusiness}
            balance={balance}
            ownedCount={getOwnedCount(selectedBusiness.id)}
            onBuy={onBuyBusiness}
            onClose={() => setSelectedBusiness(null)}
          />
        )}

        {activeTab === 'merge' && (
          <MergerPanel
            ownedBusinesses={ownedBusinesses}
            mergedBusinesses={mergedBusinesses}
            onMerge={handleMerge}
            getOwnedCount={getOwnedCount}
          />
        )}

        <OwnedBusinessList
          ownedBusinesses={ownedBusinesses}
          totalIncome={totalIncome}
          onSellBusiness={handleSellBusiness}
        />
      </div>

      <AdBanner
        onAdComplete={() => addBonus(50)}
        adDuration={5}
        rewardAmount={50}
      />
    </div>
  );
}

export default Business;