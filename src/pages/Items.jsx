import React, { useState } from 'react';
import { ShoppingBag, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useGame } from '../context/GameContext';
import { useItems } from '../context/ItemsContext';

import Garage from '../components/items/Garage';
import Hangar from '../components/items/Hangar';
import Harbor from '../components/items/Harbor';
import CarShowroom from '../components/items/CarShowroom';
import AircraftShop from '../components/items/AircraftShop';
import YachtShop from '../components/items/YachtShop';
import Collections from '../components/items/Collections';
import InsigniaSection from '../components/items/InsigniaSection';
import NFTSection from '../components/items/NFTSection';
import IslandsSection from '../components/items/IslandsSection';

function Items() {
  const { isDarkTheme } = useTheme();
  const { balance } = useGame();
  const { ownedCars, ownedAircraft, ownedYachts } = useItems();

  const [activeOwned, setActiveOwned] = useState(null);
  const [activeShop, setActiveShop] = useState(null);
  // Single state for "More" section - only one open at a time
  const [activeMore, setActiveMore] = useState(null);

  const colors = {
    dark: {
      bg: 'bg-gray-950',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      cardBg: 'bg-gray-900',
      border: 'border-gray-700/50',
      innerBg: 'bg-gray-800',
      sectionCard: 'bg-gray-900 border-gray-700/50',
    },
    light: {
      bg: 'bg-white',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-500',
      cardBg: 'bg-gray-50',
      border: 'border-gray-200',
      innerBg: 'bg-gray-100',
      sectionCard: 'bg-gray-50 border-gray-200',
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  const ownedCards = [
    {
      id: 'garage', label: 'Garage', emoji: '🚗',
      count: ownedCars.length,
      color: 'text-blue-500',
      activeBg: 'bg-blue-500',
    },
    {
      id: 'hangar', label: 'Hangar', emoji: '✈️',
      count: ownedAircraft.length,
      color: 'text-violet-500',
      activeBg: 'bg-violet-500',
    },
    {
      id: 'harbor', label: 'Harbor', emoji: '🚢',
      count: ownedYachts.length,
      color: 'text-teal-500',
      activeBg: 'bg-teal-500',
    }
  ];

  const shopCards = [
    {
      id: 'car_shop', label: 'Car Shop', emoji: '🏪',
      color: 'text-orange-500',
      activeBg: 'bg-orange-500',
    },
    {
      id: 'aircraft_shop', label: 'Aircraft', emoji: '🛫',
      color: 'text-indigo-500',
      activeBg: 'bg-indigo-500',
    },
    {
      id: 'yacht_shop', label: 'Yacht', emoji: '⚓',
      color: 'text-cyan-500',
      activeBg: 'bg-cyan-500',
    }
  ];

  // More section cards with their components
  const moreSections = [
    {
      id: 'collections',
      label: 'Collections',
      emoji: '🎨',
      color: 'text-amber-500',
      activeBg: 'bg-amber-500',
      component: <Collections />,
    },
    {
      id: 'insignia',
      label: 'Insignia',
      emoji: '🏆',
      color: 'text-yellow-500',
      activeBg: 'bg-yellow-500',
      component: <InsigniaSection />,
    },
    {
      id: 'nft',
      label: 'NFTs',
      emoji: '🖼️',
      color: 'text-purple-500',
      activeBg: 'bg-purple-500',
      component: <NFTSection />,
    },
    {
      id: 'islands',
      label: 'Islands',
      emoji: '🏝️',
      color: 'text-emerald-500',
      activeBg: 'bg-emerald-500',
      component: <IslandsSection />,
    }
  ];

  const renderOwnedContent = () => {
    switch (activeOwned) {
      case 'garage': return <Garage />;
      case 'hangar': return <Hangar />;
      case 'harbor': return <Harbor />;
      default: return null;
    }
  };

  const renderShopContent = () => {
    switch (activeShop) {
      case 'car_shop': return <CarShowroom />;
      case 'aircraft_shop': return <AircraftShop />;
      case 'yacht_shop': return <YachtShop />;
      default: return null;
    }
  };

  return (
    <div className={`min-h-screen ${c.bg} transition-colors duration-300 pb-2`}>
      <div className="max-w-full mx-auto pt-2">

        {/* Page Title */}
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShoppingBag className="w-6 h-6 text-purple-500" />
            <h2 className={`text-xl sm:text-2xl font-bold ${c.textPrimary}`}>
              Items <span className="text-purple-500">& Collections</span>
            </h2>
          </div>
          <p className={`text-xs sm:text-sm ${c.textSecondary}`}>
            Buy, Collect & Show Off Your Assets
          </p>
        </div>

        {/* ===== SECTION 1: My Vehicles ===== */}
        <div className="mb-3">
          <p className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider mb-2 px-1`}>
            📦 My Vehicles
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ownedCards.map(card => {
              const isActive = activeOwned === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setActiveOwned(isActive ? null : card.id);
                    setActiveShop(null);
                  }}
                  className={`
                    rounded-2xl p-3 text-center transition-all duration-200
                    hover:scale-[1.03] active:scale-95
                    ${isActive
                      ? `${card.activeBg} text-white`
                      : `${c.cardBg} border ${c.border}`}
                  `}
                >
                  <div className="text-2xl mb-1">{card.emoji}</div>
                  <p className={`text-[11px] font-bold 
                    ${isActive ? 'text-white' : c.textPrimary}`}>
                    {card.label}
                  </p>
                  <p className={`text-lg font-black mt-0.5 
                    ${isActive ? 'text-white' : card.color}`}>
                    {card.count}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {activeOwned && (
          <div className="mb-3">
            {renderOwnedContent()}
          </div>
        )}

        {/* ===== SECTION 2: Vehicle Shops ===== */}
        <div className="mb-3">
          <p className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider mb-2 px-1`}>
            🏬 Vehicle Shops
          </p>
          <div className="grid grid-cols-3 gap-2">
            {shopCards.map(card => {
              const isActive = activeShop === card.id;
              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setActiveShop(isActive ? null : card.id);
                    setActiveOwned(null);
                  }}
                  className={`
                    rounded-2xl p-3 text-center transition-all duration-200
                    hover:scale-[1.03] active:scale-95
                    ${isActive
                      ? `${card.activeBg} text-white`
                      : `${c.cardBg} border ${c.border}`}
                  `}
                >
                  <div className="text-2xl mb-1">{card.emoji}</div>
                  <p className={`text-[11px] font-bold 
                    ${isActive ? 'text-white' : c.textPrimary}`}>
                    {card.label}
                  </p>
                  <div className="mt-1 flex items-center justify-center gap-1">
                    <Tag className={`w-3 h-3 
                      ${isActive ? 'text-white/70' : c.textSecondary}`} />
                    <span className={`text-[10px] 
                      ${isActive ? 'text-white/70' : c.textSecondary}`}>
                      Shop
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {activeShop && (
          <div className="mb-3">
            {renderShopContent()}
          </div>
        )}

        {/* ===== SECTION 3: More - Each card with content directly below it ===== */}
        <div className="mb-3">
          <p className={`text-xs font-bold ${c.textSecondary} uppercase tracking-wider mb-2 px-1`}>
            ✨ More
          </p>
          <div className="flex flex-col gap-2">
            {moreSections.map(section => {
              const isActive = activeMore === section.id;
              return (
                <React.Fragment key={section.id}>
                  {/* Card Button */}
                  <button
                    onClick={() => setActiveMore(isActive ? null : section.id)}
                    className={`
                      w-full rounded-2xl p-3 transition-all duration-200
                      hover:scale-[1.01] active:scale-[0.99]
                      ${isActive
                        ? `${section.activeBg} text-white`
                        : `${c.cardBg} border ${c.border}`}
                    `}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{section.emoji}</span>
                        <p className={`text-sm font-bold 
                          ${isActive ? 'text-white' : c.textPrimary}`}>
                          {section.label}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 
                        ${isActive ? 'text-white/70' : c.textSecondary}`}>
                        <span className="text-[10px]">
                          {isActive ? 'Hide' : 'Open'}
                        </span>
                        {isActive 
                          ? <ChevronUp className="w-4 h-4" /> 
                          : <ChevronDown className="w-4 h-4" />
                        }
                      </div>
                    </div>
                  </button>

                  {/* Content - directly below its card */}
                  {isActive && (
                    <div className={`
                      rounded-2xl border overflow-hidden
                      ${c.border} ${c.cardBg}
                      animate-in slide-in-from-top-2 duration-200
                    `}>
                      {section.component}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Items;