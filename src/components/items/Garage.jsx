// src/components/items/Garage.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useItems } from '../../context/ItemsContext';
import { formatCurrency } from './itemsData';
import { Car, ArrowUpDown } from 'lucide-react';

function Garage() {
  const { isDarkTheme } = useTheme();
  const { ownedCars } = useItems();
  const [sortOrder, setSortOrder] = useState('expensive');

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', innerBg: 'bg-gray-800' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', innerBg: 'bg-gray-100' };

  const sortedCars = [...ownedCars].sort((a, b) =>
    sortOrder === 'expensive'
      ? b.purchasePrice - a.purchasePrice
      : a.purchasePrice - b.purchasePrice
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
          <Car className="w-5 h-5" /> Garage ({ownedCars.length})
        </h3>
        {ownedCars.length > 1 && (
          <button
            onClick={() => setSortOrder(prev => prev === 'expensive' ? 'cheap' : 'expensive')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium ${c.innerBg} ${c.textSec}`}
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === 'expensive' ? 'Expensive First' : 'Cheap First'}
          </button>
        )}
      </div>

      {sortedCars.length === 0 ? (
        <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
          <Car className={`w-12 h-12 mx-auto mb-3 ${c.textSec}`} />
          <p className={`${c.textSec} text-sm`}>No cars in your garage yet.</p>
          <p className={`${c.textSec} text-xs mt-1`}>Visit the Car Showroom to buy one!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {sortedCars.map(car => (
            <div
              key={car.ownId}
              className={`${c.cardBg} border ${c.border} rounded-2xl p-4 flex items-center gap-4`}
            >
              <div className="text-4xl">{car.image}</div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold ${c.text} truncate`}>{car.name}</h4>
                <p className={`text-xs ${c.textSec}`}>
                  {car.selectedEngine?.name || 'Standard'} • {car.selectedEquipment?.name || 'Standard'}
                </p>
                <p className="text-sm font-bold text-green-500 mt-1">
                  {formatCurrency(car.purchasePrice)}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${c.innerBg} ${c.textSec}`}>
                {car.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Garage;