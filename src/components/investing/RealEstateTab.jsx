// ============================================
// 📄 FILE: src/components/investing/RealEstateTab.jsx
// 🎯 PURPOSE: 2 Expandable Cards — Market + My Properties
// 🔧 FIXES:
//    1. Both sections are now expandable cards
//    2. Buy button → opens PropertyBuyModal
//    3. My Properties → has Sell option
//    4. Owned list → scrollable with hidden scrollbar
//    5. All sorting options preserved
// ============================================

import React, { useState, useMemo } from 'react';
import { 
  Home, ShoppingBag, Wrench, Check, ChevronDown, ChevronUp,
  DollarSign
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { PROPERTIES, formatINR } from './investingData';
import PropertyBuyModal from './PropertyBuyModal';
import PropertySellModal from './PropertySellModal';

function RealEstateTab() {
  const { isDarkTheme } = useTheme();
  const { balance, ownedProperties, buyProperty, improveProperty, sellProperty } = useGame();

  // 📖 Expanded card state
  const [expandedCard, setExpandedCard] = useState(null);
  
  // 📖 Expanded property for improvements
  const [expandedProperty, setExpandedProperty] = useState(null);

  // 📖 Sort states
  const [marketSort, setMarketSort] = useState('cheapFirst');
  const [ownedSort, setOwnedSort] = useState('expensiveFirst');

  // 📖 Modal states
  const [buyModalProperty, setBuyModalProperty] = useState(null);
  const [sellModalProperty, setSellModalProperty] = useState(null);

  // 📖 Card toggle function
  const toggleCard = (cardId) => {
    setExpandedCard(prev => prev === cardId ? null : cardId);
  };

  // 📖 Total Rental Income calculate karo
  const totalRentalIncome = useMemo(() => {
    return ownedProperties.reduce((sum, prop) => {
      let rental = prop.rentalIncomePerHour || 0;
      if (prop.improvements) {
        prop.improvements.forEach(imp => {
          rental += imp.bonusIncome || 0;
        });
      }
      return sum + rental;
    }, 0);
  }, [ownedProperties]);

  // 📖 Sorted market properties
  const sortedMarketProperties = useMemo(() => {
    let sorted = [...PROPERTIES];
    switch (marketSort) {
      case 'cheapFirst':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'expensiveFirst':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'highestIncome':
        sorted.sort((a, b) => b.rentalIncomePerHour - a.rentalIncomePerHour);
        break;
      case 'lowestIncome':
        sorted.sort((a, b) => a.rentalIncomePerHour - b.rentalIncomePerHour);
        break;
      case 'bestValue':
        sorted.sort((a, b) => (b.rentalIncomePerHour / b.price) - (a.rentalIncomePerHour / a.price));
        break;
      default:
        break;
    }
    return sorted;
  }, [marketSort]);

  // 📖 Sorted owned properties
  const sortedOwnedProperties = useMemo(() => {
    let sorted = [...ownedProperties];
    switch (ownedSort) {
      case 'expensiveFirst':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'cheapFirst':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'highestIncome':
        sorted.sort((a, b) => {
          const aIncome = (a.rentalIncomePerHour || 0) + (a.improvements?.reduce((s, i) => s + (i.bonusIncome || 0), 0) || 0);
          const bIncome = (b.rentalIncomePerHour || 0) + (b.improvements?.reduce((s, i) => s + (i.bonusIncome || 0), 0) || 0);
          return bIncome - aIncome;
        });
        break;
      case 'improvementAvailable':
        sorted.sort((a, b) => {
          const aOriginal = PROPERTIES.find(p => p.id === a.id);
          const bOriginal = PROPERTIES.find(p => p.id === b.id);
          const aAvail = (aOriginal?.improvements?.length || 0) - (a.improvements?.length || 0);
          const bAvail = (bOriginal?.improvements?.length || 0) - (b.improvements?.length || 0);
          return bAvail - aAvail;
        });
        break;
      case 'fullyImproved':
        sorted.sort((a, b) => {
          const aOriginal = PROPERTIES.find(p => p.id === a.id);
          const bOriginal = PROPERTIES.find(p => p.id === b.id);
          const aFull = (a.improvements?.length || 0) >= (aOriginal?.improvements?.length || 0) ? 1 : 0;
          const bFull = (b.improvements?.length || 0) >= (bOriginal?.improvements?.length || 0) ? 1 : 0;
          return bFull - aFull;
        });
        break;
      default:
        break;
    }
    return sorted;
  }, [ownedProperties, ownedSort]);

  // 📖 Handlers
  const handleBuyProperty = (property) => {
    buyProperty(property);
  };

  const handleImprove = (ownId, improvement) => {
    improveProperty(ownId, improvement);
  };

  const handleSellProperty = (ownId) => {
    sellProperty(ownId);
  };

  // ========== THEME COLORS ==========
  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-800/50', border: 'border-gray-700',
        text: 'text-white', textSec: 'text-gray-400',
        inner: 'bg-gray-800', hover: 'hover:bg-gray-750'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200',
        text: 'text-gray-900', textSec: 'text-gray-500',
        inner: 'bg-gray-50', hover: 'hover:bg-gray-100'
      };

  // ========== SORT OPTIONS ==========
  const marketSortOptions = [
    { value: 'cheapFirst', label: 'Cheap First' },
    { value: 'expensiveFirst', label: 'Expensive First' },
    { value: 'highestIncome', label: 'Highest Income' },
    { value: 'lowestIncome', label: 'Lowest Income' },
    { value: 'bestValue', label: 'Best ROI' }
  ];

  const ownedSortOptions = [
    { value: 'expensiveFirst', label: 'Expensive First' },
    { value: 'cheapFirst', label: 'Cheap First' },
    { value: 'highestIncome', label: 'Highest Income' },
    { value: 'improvementAvailable', label: 'Upgrades Available' },
    { value: 'fullyImproved', label: 'Fully Improved' }
  ];

  // ========== REUSABLE SORT CHIPS ==========
  const renderSortChips = (options, currentSort, setSortFn) => {
    return (
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSortFn(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
              currentSort === opt.value
                ? 'bg-orange-500 text-white shadow-sm'
                : isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  };

  // ========== EXPANDABLE CARD COMPONENT ==========
  const ExpandableCard = ({ id, icon: Icon, title, subtitle, color, badge, children }) => {
    const isExpanded = expandedCard === id;

    return (
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${c.cardBg} ${c.border}`}>
        {/* Card Header — Click to toggle */}
        <button
          onClick={() => toggleCard(id)}
          className={`w-full p-4 flex items-center justify-between text-left transition-all ${c.hover}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold ${c.text}`}>{title}</h3>
                {badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    isDarkTheme ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {badge}
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${c.textSec}`}>{subtitle}</p>
            </div>
          </div>

          <div className={`p-1.5 rounded-full transition-all ${
            isExpanded ? (isDarkTheme ? 'bg-gray-700' : 'bg-gray-200') : ''
          }`}>
            {isExpanded
              ? <ChevronUp className={`w-5 h-5 ${c.textSec}`} />
              : <ChevronDown className={`w-5 h-5 ${c.textSec}`} />
            }
          </div>
        </button>

        {/* Expandable Content */}
        {isExpanded && (
          <div className={`px-4 pb-4 pt-1 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="px-2 space-y-4">

      {/* ===== RENTAL INCOME SUMMARY ===== */}
      <div className={`p-4 rounded-2xl border ${
        isDarkTheme
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <Home className="w-5 h-5 text-orange-500" />
          <p className={`text-xs ${c.textSec}`}>Total Rental Income</p>
        </div>
        <p className="text-2xl font-bold text-orange-500">{formatINR(totalRentalIncome)}/hr</p>
        <p className={`text-[11px] mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
          {ownedProperties.length} properties owned
        </p>
      </div>


      {/* ===== CARD 1: REAL ESTATE MARKET ===== */}
      <ExpandableCard
        id="market"
        icon={ShoppingBag}
        title="Real Estate Market"
        subtitle="Browse & buy properties"
        color="bg-gradient-to-br from-orange-500 to-amber-500"
        badge={`${PROPERTIES.length} properties`}
      >
        {/* Sort Chips */}
        {renderSortChips(marketSortOptions, marketSort, setMarketSort)}

        {/* 📖 Properties List — Scrollable, max height */}
        <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
          {sortedMarketProperties.map(property => {
            const canAfford = balance >= property.price;

            return (
              <div
                key={property.id}
                className={`p-3 rounded-xl border transition-all ${c.cardBg} ${c.border}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl">{property.image}</span>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${c.text}`}>{property.name}</p>
                    <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                      📍 {property.location}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                        {formatINR(property.price)}
                      </span>
                      <span className="text-[10px] text-green-500 font-medium">
                        +{formatINR(property.rentalIncomePerHour)}/hr
                      </span>
                    </div>
                  </div>

                  {/* 📖 Buy Button — Opens confirmation modal */}
                  <button
                    onClick={() => setBuyModalProperty(property)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      canAfford
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-105 active:scale-95'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Buy' : 'Locked'}
                  </button>
                </div>

                {/* Improvements Preview Tags */}
                <div className="flex gap-1 mt-2 flex-wrap">
                  {property.improvements.map(imp => (
                    <span
                      key={imp.id}
                      className={`text-[9px] px-2 py-0.5 rounded-full ${
                        isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {imp.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </ExpandableCard>


      {/* ===== CARD 2: MY PROPERTIES ===== */}
      <ExpandableCard
        id="owned"
        icon={Home}
        title="My Properties"
        subtitle={ownedProperties.length > 0 
          ? `Earning ${formatINR(totalRentalIncome)}/hr` 
          : "No properties owned yet"
        }
        color="bg-gradient-to-br from-green-500 to-emerald-500"
        badge={ownedProperties.length > 0 ? `${ownedProperties.length} owned` : null}
      >
        {/* Sort Chips — only show if 2+ properties owned */}
        {ownedProperties.length > 1 && renderSortChips(ownedSortOptions, ownedSort, setOwnedSort)}

        {/* 📖 Owned Properties List — Scrollable with hidden scrollbar */}
        {sortedOwnedProperties.length > 0 ? (
          <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
            {sortedOwnedProperties.map(prop => {
              const originalProp = PROPERTIES.find(p => p.id === prop.id);
              const totalIncome = (prop.rentalIncomePerHour || 0) +
                (prop.improvements?.reduce((s, i) => s + (i.bonusIncome || 0), 0) || 0);
              const allImprovements = originalProp?.improvements || [];
              const doneImprovements = prop.improvements || [];
              const isFullyImproved = doneImprovements.length >= allImprovements.length;
              const isExpanded = expandedProperty === prop.ownId;

              return (
                <div
                  key={prop.ownId}
                  className={`rounded-xl border overflow-hidden transition-all ${c.cardBg} ${c.border}`}
                >
                  {/* Property Header */}
                  <button
                    onClick={() => setExpandedProperty(isExpanded ? null : prop.ownId)}
                    className={`w-full p-3 text-left transition-all ${c.hover}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{prop.image}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${c.text}`}>{prop.name}</p>
                            {isFullyImproved && (
                              <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full">
                                MAXED
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            📍 {prop.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-500">+{formatINR(totalIncome)}/hr</p>
                          <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            {doneImprovements.length}/{allImprovements.length} improved
                          </p>
                        </div>
                        {isExpanded
                          ? <ChevronUp className={`w-4 h-4 ${c.textSec}`} />
                          : <ChevronDown className={`w-4 h-4 ${c.textSec}`} />
                        }
                      </div>
                    </div>
                  </button>

                  {/* Improvements + Sell Panel */}
                  {isExpanded && (
                    <div className={`px-3 pb-3 pt-1 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
                      
                      {/* Improvements Section */}
                      <p className={`text-xs font-semibold mb-2 flex items-center gap-1 ${
                        isDarkTheme ? 'text-gray-300' : 'text-gray-700'
                      }`}>
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
                                <p className={`text-xs font-medium ${isDone ? 'text-green-500' : c.text}`}>
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
                                  disabled={!canAfford}
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

                      {/* 📖 SELL BUTTON */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSellModalProperty(prop);
                        }}
                        className={`w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all
                          ${isDarkTheme 
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        Sell Property
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className={`text-center py-8 rounded-xl ${
            isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'
          }`}>
            <Home className={`w-12 h-12 mx-auto mb-2 ${isDarkTheme ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm font-medium ${c.textSec}`}>No properties owned</p>
            <p className={`text-xs ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`}>
              Open Real Estate Market to buy properties
            </p>
          </div>
        )}
      </ExpandableCard>


      {/* ===== BUY MODAL ===== */}
      {buyModalProperty && (
        <PropertyBuyModal
          property={buyModalProperty}
          balance={balance}
          onBuy={handleBuyProperty}
          onClose={() => setBuyModalProperty(null)}
        />
      )}

      {/* ===== SELL MODAL ===== */}
      {sellModalProperty && (
        <PropertySellModal
          property={sellModalProperty}
          onSell={handleSellProperty}
          onClose={() => setSellModalProperty(null)}
        />
      )}
    </div>
  );
}

export default RealEstateTab;