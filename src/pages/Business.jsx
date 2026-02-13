// pages/Business.jsx
import React, { useState, useCallback } from 'react';
import { Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Import Components
import IncomeBoostCard from '../components/business/IncomeBoostCard';
import ActionButtons from '../components/business/ActionButtons';
import BusinessList from '../components/business/BusinessList';
import BusinessDetailModal from '../components/business/BusinessDetailModal';
import MergerPanel from '../components/business/MergerPanel';
import OwnedBusinessList from '../components/business/OwnedBusinessList';
import OwnedBusinessDetailModal from '../components/business/OwnedBusinessDetailModal';
import AdBanner from '../components/earnings/AdBanner';

// Import Data
import { BUSINESSES, MERGER_OPTIONS } from '../components/business/businessData';

function Business() {
  const { isDarkTheme } = useTheme();
  
  // State
  const [balance, setBalance] = useState(500000);
  const [ownedBusinesses, setOwnedBusinesses] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedOwnedBusiness, setSelectedOwnedBusiness] = useState(null);
  const [isBoostActive, setIsBoostActive] = useState(false);
  const [mergedBusinesses, setMergedBusinesses] = useState([]);

  // Theme Colors
  const colors = {
    dark: {
      bg: 'bg-gray-950',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400'
    },
    light: {
      bg: 'bg-gray-50',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  // Calculate total income per hour
  const calculateTotalIncome = useCallback(() => {
    let total = ownedBusinesses.reduce((sum, owned) => {
      return sum + (owned.incomePerHour || 0);
    }, 0);

    mergedBusinesses.forEach(mergerId => {
      const merger = MERGER_OPTIONS.find(m => m.id === mergerId);
      if (merger) {
        total = total * (1 + merger.bonus / 100);
      }
    });

    if (isBoostActive) {
      total = total * 2;
    }

    return Math.floor(total);
  }, [ownedBusinesses, mergedBusinesses, isBoostActive]);

  // Get owned count by business type
  const getOwnedCount = (businessId) => {
    return ownedBusinesses.filter(o => o.businessId === businessId).length;
  };

  // Handle Boost Change
  const handleBoostChange = useCallback((status) => {
    setIsBoostActive(status);
  }, []);

  // Handle Tab Change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle Select Business (for buying)
  const handleSelectBusiness = (business) => {
    setSelectedBusiness(business);
  };

  // Handle Buy Business
  const handleBuyBusiness = (business, size, customName) => {
    const cost = size.cost;
    if (balance >= cost) {
      setBalance(prev => prev - cost);
      setOwnedBusinesses(prev => [...prev, {
        id: Date.now(),
        businessId: business.id,
        businessName: business.name,
        sizeType: size.type,
        customName: customName || `${size.type} ${business.name}`,
        incomePerHour: size.incomePerHour,
        cost: cost,
        purchasedAt: new Date().toISOString()
      }]);
      setSelectedBusiness(null);
    }
  };

  // Handle Select Owned Business (for viewing details)
  const handleSelectOwnedBusiness = (ownedBusiness) => {
    setSelectedOwnedBusiness(ownedBusiness);
  };

  // Handle Update Business Name
  const handleUpdateBusinessName = (businessId, newName) => {
    setOwnedBusinesses(prev => 
      prev.map(b => 
        b.id === businessId 
          ? { ...b, customName: newName } 
          : b
      )
    );
    // Update selected business reference too
    setSelectedOwnedBusiness(prev => 
      prev && prev.id === businessId 
        ? { ...prev, customName: newName } 
        : prev
    );
  };

  // Handle Sell Business
  const handleSellBusiness = (businessId, sellPrice) => {
    setBalance(prev => prev + sellPrice);
    setOwnedBusinesses(prev => prev.filter(b => b.id !== businessId));
    setSelectedOwnedBusiness(null);
  };

  // Handle Merge
  const handleMerge = (merger) => {
    const canMerge = merger.requirements.every(req => {
      const count = getOwnedCount(req.businessId);
      return count >= req.minCount;
    });

    if (canMerge && !mergedBusinesses.includes(merger.id)) {
      setMergedBusinesses(prev => [...prev, merger.id]);
    }
  };

  // Handle Ad Complete
  const handleAdComplete = () => {
    setBalance(prev => prev + 50);
  };

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300 pb-4`}>
      <div className="max-w-full mx-auto">
        
        {/* Page Title */}
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

        {/* Income & Boost Section */}
        <IncomeBoostCard 
          totalIncome={calculateTotalIncome()}
          onBoostChange={handleBoostChange}
        />

        {/* Action Buttons */}
        <ActionButtons 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Start Business Panel */}
        {activeTab === 'start' && (
          <BusinessList 
            ownedBusinesses={ownedBusinesses}
            onSelectBusiness={handleSelectBusiness}
          />
        )}

        {/* Business Detail Modal (Buy) */}
        {selectedBusiness && (
          <BusinessDetailModal
            business={selectedBusiness}
            balance={balance}
            ownedCount={getOwnedCount(selectedBusiness.id)}
            onBuy={handleBuyBusiness}
            onClose={() => setSelectedBusiness(null)}
          />
        )}

        {/* Owned Business Detail Modal (View/Edit/Sell) */}
        {selectedOwnedBusiness && (
          <OwnedBusinessDetailModal
            ownedBusiness={selectedOwnedBusiness}
            onClose={() => setSelectedOwnedBusiness(null)}
            onUpdateName={handleUpdateBusinessName}
            onSell={handleSellBusiness}
          />
        )}

        {/* Merge Business Panel */}
        {activeTab === 'merge' && (
          <MergerPanel 
            ownedBusinesses={ownedBusinesses}
            mergedBusinesses={mergedBusinesses}
            onMerge={handleMerge}
          />
        )}

        {/* Owned Businesses List */}
        <OwnedBusinessList 
          ownedBusinesses={ownedBusinesses}
          totalIncome={calculateTotalIncome()}
          onSelectOwned={handleSelectOwnedBusiness}
        />

      </div>

      {/* Ad Banner */}
      <AdBanner 
        onAdComplete={handleAdComplete}
        adDuration={5}
      />
    </div>
  );
}

export default Business;