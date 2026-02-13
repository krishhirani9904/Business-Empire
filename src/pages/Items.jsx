// src/pages/Items.jsx
import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Car, Plane, Ship, ShoppingBag, Palette,
  Award, Hexagon, TreePalm
} from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState('garage');

  const c = isDarkTheme
    ? {
        bg: 'bg-gray-950',
        cardBg: 'bg-gray-900',
        cardBorder: 'border-gray-700',
        text: 'text-white',
        textSec: 'text-gray-400',
        tabBg: 'bg-gray-800',
        tabActive: 'bg-purple-600 text-white',
        tabInactive: 'text-gray-400 hover:bg-gray-700'
      }
    : {
        bg: 'bg-gray-50',
        cardBg: 'bg-white',
        cardBorder: 'border-gray-200',
        text: 'text-gray-900',
        textSec: 'text-gray-500',
        tabBg: 'bg-gray-100',
        tabActive: 'bg-purple-500 text-white',
        tabInactive: 'text-gray-600 hover:bg-gray-200'
      };

  const sections = [
    { id: 'garage', label: 'Garage', icon: Car },
    { id: 'hangar', label: 'Hangar', icon: Plane },
    { id: 'harbor', label: 'Harbor', icon: Ship },
    { id: 'car_showroom', label: 'Car Shop', icon: Car },
    { id: 'aircraft_shop', label: 'Aircraft', icon: Plane },
    { id: 'yacht_shop', label: 'Yacht', icon: Ship },
    { id: 'collections', label: 'Collections', icon: Palette },
    { id: 'insignia', label: 'Insignia', icon: Award },
    { id: 'nft', label: 'NFT', icon: Hexagon },
    { id: 'islands', label: 'Islands', icon: TreePalm }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'garage': return <Garage />;
      case 'hangar': return <Hangar />;
      case 'harbor': return <Harbor />;
      case 'car_showroom': return <CarShowroom />;
      case 'aircraft_shop': return <AircraftShop />;
      case 'yacht_shop': return <YachtShop />;
      case 'collections': return <Collections />;
      case 'insignia': return <InsigniaSection />;
      case 'nft': return <NFTSection />;
      case 'islands': return <IslandsSection />;
      default: return <Garage />;
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-4">
      {/* Title */}
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${c.text}`}>
          🛍️ Items & Collections
        </h2>
        <p className={`text-sm ${c.textSec}`}>Buy luxury items and collectibles</p>
      </div>

      {/* Section Tabs - Horizontal Scroll */}
      <div className={`${c.tabBg} rounded-2xl p-2 overflow-x-auto`}>
        <div className="flex gap-1 min-w-max">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium
                  transition-all duration-200 whitespace-nowrap
                  ${isActive ? c.tabActive : c.tabInactive}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {section.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div>{renderSection()}</div>
    </div>
  );
}

export default Items;