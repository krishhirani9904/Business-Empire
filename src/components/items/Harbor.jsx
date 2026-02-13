// src/components/items/Harbor.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useItems } from '../../context/ItemsContext';
import { formatCurrency } from './itemsData';
import { Ship, ArrowUpDown, MapPin } from 'lucide-react';

function Harbor() {
  const { isDarkTheme } = useTheme();
  const { ownedYachts } = useItems();
  const [sortOrder, setSortOrder] = useState('expensive');

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', innerBg: 'bg-gray-800' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', innerBg: 'bg-gray-100' };

  const sortedYachts = [...ownedYachts].sort((a, b) =>
    sortOrder === 'expensive'
      ? b.purchasePrice - a.purchasePrice
      : a.purchasePrice - b.purchasePrice
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
          <Ship className="w-5 h-5" /> Harbor ({ownedYachts.length})
        </h3>
        {ownedYachts.length > 1 && (
          <button
            onClick={() => setSortOrder(prev => prev === 'expensive' ? 'cheap' : 'expensive')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${c.innerBg} ${c.textSec}`}
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === 'expensive' ? 'Expensive First' : 'Cheap First'}
          </button>
        )}
      </div>

      {sortedYachts.length === 0 ? (
        <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
          <Ship className={`w-12 h-12 mx-auto mb-3 ${c.textSec}`} />
          <p className={`${c.textSec} text-sm`}>No yachts in your harbor yet.</p>
          <p className={`${c.textSec} text-xs mt-1`}>Visit the Yacht Shop to buy one!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedYachts.map(yacht => (
            <div
              key={yacht.ownId}
              className={`${c.cardBg} border ${c.border} rounded-2xl p-4 flex items-center gap-4`}
            >
              <div className="text-4xl">{yacht.image}</div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold ${c.text} truncate`}>{yacht.name}</h4>
                <p className={`text-xs ${c.textSec}`}>
                  {yacht.type} • {yacht.hasTeam ? 'Crew Hired' : 'No Crew'}
                  {' • '}{yacht.selectedDesign?.name || 'Standard'}
                </p>
                {yacht.selectedLocation && (
                  <p className={`text-xs ${c.textSec} flex items-center gap-1 mt-0.5`}>
                    <MapPin className="w-3 h-3" /> {yacht.selectedLocation}
                  </p>
                )}
                <p className="text-sm font-bold text-green-500 mt-1">
                  {formatCurrency(yacht.purchasePrice)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Harbor;