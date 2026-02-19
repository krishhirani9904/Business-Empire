import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { formatCurrency } from './itemsData';
import { Car, ArrowUpDown, Trash2, X } from 'lucide-react';

function Garage() {
  const { isDarkTheme } = useTheme();
  const { addBonus } = useGame();
  const { ownedCars, sellItem } = useItems();

  const [sortOrder, setSortOrder] = useState('expensive');
  const [sellConfirm, setSellConfirm] = useState(null);

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-800', border: 'border-gray-700', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-700', badge: 'bg-gray-700' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', badge: 'bg-gray-100' };

  const sortedCars = [...ownedCars].sort((a, b) =>
    sortOrder === 'expensive'
      ? b.purchasePrice - a.purchasePrice
      : a.purchasePrice - b.purchasePrice
  );

  const handleSell = (car) => {
    const price = sellItem('Cars', car.ownId);
    if (price && price > 0) {
      addBonus(price);
    }
    setSellConfirm(null);
  };

  return (
    <div className="space-y-3">
      {/* Sort Toggle */}
      {ownedCars.length > 1 && (
        <div className="flex justify-end">
          <button
            onClick={() => setSortOrder(prev => prev === 'expensive' ? 'cheap' : 'expensive')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg 
              text-xs font-medium ${c.innerBg} ${c.textSec}`}
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortOrder === 'expensive' ? 'Expensive First' : 'Cheap First'}
          </button>
        </div>
      )}

      {/* Empty State */}
      {sortedCars.length === 0 ? (
        <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
          <Car className={`w-12 h-12 mx-auto mb-3 ${c.textSec}`} />
          <p className={`${c.textSec} text-sm font-medium`}>No cars yet</p>
          <p className={`${c.textSec} text-xs mt-1`}>Visit the Car Showroom to buy one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedCars.map(car => (
            <div
              key={car.ownId}
              className={`${c.cardBg} border ${c.border} rounded-2xl p-3 
                flex items-center gap-3`}
            >
              <div className="text-3xl">{car.image}</div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${c.text} truncate`}>{car.name}</h4>
                <p className={`text-[10px] ${c.textSec} truncate`}>
                  {car.selectedEngine?.name || 'Standard'} • {car.selectedEquipment?.name || 'Standard'}
                </p>
                <p className="text-xs font-bold text-green-500 mt-0.5">
                  {formatCurrency(car.purchasePrice)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium 
                  ${c.badge} ${c.textSec} capitalize`}>
                  {car.category}
                </span>
                <button
                  onClick={() => setSellConfirm(car)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-500 
                    hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sell Confirmation Modal */}
      {sellConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-5 
            max-w-sm w-full space-y-4`}
          >
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Sell Car?</h4>
              <button onClick={() => setSellConfirm(null)} className={`p-1 rounded-full ${c.innerBg}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{sellConfirm.image}</div>
              <p className={`font-bold ${c.text}`}>{sellConfirm.name}</p>
              <p className={`text-xs ${c.textSec} mt-1`}>
                Purchased for {formatCurrency(sellConfirm.purchasePrice)}
              </p>
              <p className="text-lg font-bold text-green-500 mt-2">
                Sell for {formatCurrency(Math.floor(sellConfirm.purchasePrice * 0.7))}
              </p>
              <p className={`text-[10px] ${c.textSec}`}>(70% of purchase price)</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSellConfirm(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${c.innerBg} ${c.text}`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSell(sellConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white
                  hover:bg-red-600 active:scale-95 transition-all"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Garage;