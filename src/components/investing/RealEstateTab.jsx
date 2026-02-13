// src/components/investing/RealEstateTab.jsx
import React, { useState, useMemo } from 'react';
import { Home, ShoppingBag, Wrench, Check, ChevronDown, ChevronUp, DollarSign, AlertTriangle, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { PROPERTIES, formatINR } from './investingData';

const INITIAL_ITEMS = 5;

function RealEstateTab() {
  const { isDarkTheme } = useTheme();
  const { balance, ownedProperties, buyProperty, improveProperty, sellProperty } = useGame();
  const [expandedSection, setExpandedSection] = useState(null);
  const [sortBy, setSortBy] = useState('cheapFirst');
  const [selectedOwned, setSelectedOwned] = useState(null);
  const [ownedSort, setOwnedSort] = useState('expensiveFirst');
  const [showSellConfirm, setShowSellConfirm] = useState(null);
  
  // Show more states
  const [showAllMarket, setShowAllMarket] = useState(false);
  const [showAllOwned, setShowAllOwned] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  // Rental income per hour
  const totalRentalIncome = useMemo(() => {
    return ownedProperties.reduce((sum, prop) => {
      let rental = prop.rentalIncomePerHour || 0;
      if (prop.improvements) {
        prop.improvements.forEach(imp => { rental += imp.bonusIncome || 0; });
      }
      return sum + rental;
    }, 0);
  }, [ownedProperties]);

  // Total property value
  const totalPropertyValue = useMemo(() => {
    return ownedProperties.reduce((sum, prop) => {
      let value = prop.price;
      if (prop.improvements) {
        prop.improvements.forEach(imp => { value += imp.cost || 0; });
      }
      return sum + value;
    }, 0);
  }, [ownedProperties]);

  // Sorted market properties
  const sortedProperties = useMemo(() => {
    let sorted = [...PROPERTIES];
    if (sortBy === 'expensiveFirst') sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => a.price - b.price);
    return sorted;
  }, [sortBy]);

  // Sorted owned properties
  const sortedOwned = useMemo(() => {
    let sorted = [...ownedProperties];
    switch (ownedSort) {
      case 'expensiveFirst':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'cheapFirst':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'improvementAvailable':
        sorted.sort((a, b) => {
          const aAvail = (a.improvements?.length || 0) < (PROPERTIES.find(p => p.id === a.id)?.improvements?.length || 0) ? 0 : 1;
          const bAvail = (b.improvements?.length || 0) < (PROPERTIES.find(p => p.id === b.id)?.improvements?.length || 0) ? 0 : 1;
          return aAvail - bAvail;
        });
        break;
      case 'fullyImproved':
        sorted.sort((a, b) => {
          const aFull = (a.improvements?.length || 0) >= (PROPERTIES.find(p => p.id === a.id)?.improvements?.length || 0) ? 0 : 1;
          const bFull = (b.improvements?.length || 0) >= (PROPERTIES.find(p => p.id === b.id)?.improvements?.length || 0) ? 0 : 1;
          return aFull - bFull;
        });
        break;
      default:
        break;
    }
    return sorted;
  }, [ownedProperties, ownedSort]);

  const handleBuyProperty = (property) => {
    buyProperty(property);
  };

  const handleImprove = (ownId, improvement) => {
    improveProperty(ownId, improvement);
  };

  const getSellPrice = (prop) => {
    let sellPrice = prop.price * 0.7;
    if (prop.improvements) {
      prop.improvements.forEach(imp => { sellPrice += imp.cost * 0.5; });
    }
    return Math.floor(sellPrice);
  };

  const handleSellProperty = (ownId) => {
    sellProperty(ownId);
    setShowSellConfirm(null);
    setSelectedOwned(null);
  };

  // View More Button Component
  const ViewMoreButton = ({ shown, total, isExpanded, onToggle }) => {
    if (total <= INITIAL_ITEMS) return null;
    
    return (
      <button
        onClick={onToggle}
        className={`w-full py-2.5 mt-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
          isDarkTheme 
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
        }`}
      >
        <Eye className="w-4 h-4" />
        {isExpanded ? `Show Less` : `View All ${total} Items`}
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    );
  };

  // Section Card
  const SectionCard = ({ id, icon: Icon, title, subtitle, accentColor, children }) => {
    const isExpanded = expandedSection === id;

    return (
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDarkTheme ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-4 flex items-center justify-between text-left transition-all hover:opacity-90"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              accentColor === 'orange' ? 'bg-orange-500/15' : 'bg-blue-500/15'
            }`}>
              <Icon className={`w-5 h-5 ${
                accentColor === 'orange' ? 'text-orange-500' : 'text-blue-500'
              }`} />
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{title}</p>
              <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>
            </div>
          </div>
          <div className={`p-1.5 rounded-full transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          } ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {isExpanded && (
          <div className={`px-4 pb-4 border-t ${isDarkTheme ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="pt-3">{children}</div>
          </div>
        )}
      </div>
    );
  };

  // Get displayed items
  const displayedMarketProperties = showAllMarket ? sortedProperties : sortedProperties.slice(0, INITIAL_ITEMS);
  const displayedOwnedProperties = showAllOwned ? sortedOwned : sortedOwned.slice(0, INITIAL_ITEMS);

  return (
    <div className="px-2 space-y-3">
      {/* Rental Income Overview Card */}
      <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-orange-500" />
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Real Estate Overview</p>
        </div>
        <p className="text-xl font-bold text-orange-500">{formatINR(totalRentalIncome)}/hr</p>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
            {ownedProperties.length} properties · Value: {formatINR(totalPropertyValue)}
          </span>
        </div>
      </div>

      {/* ====== CARD 1: Real Estate Market ====== */}
      <SectionCard
        id="market"
        icon={ShoppingBag}
        title="Real Estate Market"
        subtitle={`${PROPERTIES.length} properties available`}
        accentColor="orange"
      >
        {/* Sort */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setSortBy('expensiveFirst')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortBy === 'expensiveFirst' ? 'bg-orange-500 text-white' : isDarkTheme ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Expensive First
          </button>
          <button
            onClick={() => setSortBy('cheapFirst')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              sortBy === 'cheapFirst' ? 'bg-orange-500 text-white' : isDarkTheme ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Cheap First
          </button>
        </div>

        {/* Property List */}
        <div className="space-y-2">
          {displayedMarketProperties.map(property => {
            const canAfford = balance >= property.price;
            return (
              <div
                key={property.id}
                className={`p-3 rounded-xl border transition-all ${
                  isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{property.image}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{property.name}</p>
                    <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>📍 {property.location}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{formatINR(property.price)}</span>
                      <span className="text-[10px] text-green-500 font-medium">+{formatINR(property.rentalIncomePerHour)}/hr</span>
                    </div>
                  </div>
                  <button
                    onClick={() => canAfford ? handleBuyProperty(property) : null}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 active:scale-95'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Buy' : 'Locked'}
                  </button>
                </div>

                <div className="flex gap-1 mt-2 flex-wrap">
                  {property.improvements.slice(0, 3).map(imp => (
                    <span key={imp.id} className={`text-[9px] px-2 py-0.5 rounded-full ${
                      isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {imp.name}
                    </span>
                  ))}
                  {property.improvements.length > 3 && (
                    <span className={`text-[9px] px-2 py-0.5 rounded-full ${
                      isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      +{property.improvements.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        <ViewMoreButton 
          shown={displayedMarketProperties.length}
          total={sortedProperties.length}
          isExpanded={showAllMarket}
          onToggle={() => setShowAllMarket(!showAllMarket)}
        />
      </SectionCard>

      {/* ====== CARD 2: My Properties ====== */}
      <SectionCard
        id="owned"
        icon={Home}
        title="My Properties"
        subtitle={`${ownedProperties.length} owned · ${formatINR(totalRentalIncome)}/hr income`}
        accentColor="blue"
      >
        {/* Sort */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {[
            { value: 'expensiveFirst', label: 'Expensive First' },
            { value: 'cheapFirst', label: 'Cheap First' },
            { value: 'improvementAvailable', label: 'Upgradable' },
            { value: 'fullyImproved', label: 'Fully Improved' }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setOwnedSort(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                ownedSort === opt.value ? 'bg-orange-500 text-white' : isDarkTheme ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {sortedOwned.length > 0 ? (
          <>
            <div className="space-y-2">
              {displayedOwnedProperties.map(prop => {
                const originalProp = PROPERTIES.find(p => p.id === prop.id);
                const totalIncome = (prop.rentalIncomePerHour || 0) + (prop.improvements?.reduce((s, i) => s + (i.bonusIncome || 0), 0) || 0);
                const allImprovements = originalProp?.improvements || [];
                const doneImprovements = prop.improvements || [];
                const availableImprovements = allImprovements.filter(imp => !doneImprovements.find(d => d.id === imp.id));
                const isFullyImproved = availableImprovements.length === 0;
                const isExpanded = selectedOwned === prop.ownId;
                const sellPrice = getSellPrice(prop);

                return (
                  <div
                    key={prop.ownId}
                    className={`rounded-xl border overflow-hidden transition-all ${
                      isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <button
                      onClick={() => setSelectedOwned(isExpanded ? null : prop.ownId)}
                      className="w-full p-3 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{prop.image}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{prop.name}</p>
                              {isFullyImproved && (
                                <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">MAXED</span>
                              )}
                            </div>
                            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>📍 {prop.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-500">+{formatINR(totalIncome)}/hr</p>
                          <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            {doneImprovements.length}/{allImprovements.length} improved
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Expanded: Improvements + Sell */}
                    {isExpanded && (
                      <div className={`px-3 pb-3 pt-1 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                        {/* Improvements */}
                        <p className={`text-xs font-semibold mb-2 flex items-center gap-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                          <Wrench className="w-3.5 h-3.5" /> Improvements
                        </p>
                        <div className="space-y-1.5 mb-3">
                          {allImprovements.map(imp => {
                            const isDone = doneImprovements.find(d => d.id === imp.id);
                            const canAfford = balance >= imp.cost;

                            return (
                              <div
                                key={imp.id}
                                className={`flex items-center justify-between p-2 rounded-lg ${
                                  isDone
                                    ? isDarkTheme ? 'bg-green-900/20' : 'bg-green-50'
                                    : isDarkTheme ? 'bg-gray-700/50' : 'bg-gray-50'
                                }`}
                              >
                                <div>
                                  <p className={`text-xs font-medium ${isDone ? 'text-green-500' : isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                                    {isDone && <Check className="w-3 h-3 inline mr-1" />}
                                    {imp.name}
                                  </p>
                                  <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                                    +{formatINR(imp.bonusIncome)}/hr
                                  </p>
                                </div>
                                {isDone ? (
                                  <span className="text-[10px] text-green-500 font-medium">Done ✓</span>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (canAfford) handleImprove(prop.ownId, imp);
                                    }}
                                    className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                      canAfford
                                        ? 'bg-orange-500 text-white hover:scale-105 active:scale-95'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                    }`}
                                  >
                                    {formatINR(imp.cost)}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Sell Button */}
                        {showSellConfirm === prop.ownId ? (
                          <div className={`p-3 rounded-xl border ${isDarkTheme ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <p className={`text-xs font-semibold ${isDarkTheme ? 'text-red-400' : 'text-red-700'}`}>Confirm Sell?</p>
                            </div>
                            <p className={`text-[10px] mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                              You'll receive {formatINR(sellPrice)} (70% value + 50% improvements)
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSellProperty(prop.ownId); }}
                                className="flex-1 py-2 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                              >
                                Yes, Sell for {formatINR(sellPrice)}
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); setShowSellConfirm(null); }}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold ${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); setShowSellConfirm(prop.ownId); }}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                              isDarkTheme ? 'bg-red-900/30 text-red-400 border border-red-800 hover:bg-red-900/50' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                            }`}
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            Sell Property ({formatINR(sellPrice)})
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <ViewMoreButton 
              shown={displayedOwnedProperties.length}
              total={sortedOwned.length}
              isExpanded={showAllOwned}
              onToggle={() => setShowAllOwned(!showAllOwned)}
            />
          </>
        ) : (
          <div className={`text-center py-6 rounded-xl ${isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
            <Home className={`w-10 h-10 mx-auto mb-2 ${isDarkTheme ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No properties owned</p>
            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`}>Visit Real Estate Market above</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

export default RealEstateTab;