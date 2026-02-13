// src/components/items/CarShowroom.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { CARS, formatCurrency } from './itemsData';
import { Car, X, ChevronRight, ShoppingCart } from 'lucide-react';

function CarShowroom() {
  const { isDarkTheme } = useTheme();
  const { balance } = useGame();
  const { buyItem } = useItems();
  const { addBonus } = useGame();
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
        selected: 'border-purple-500 bg-purple-500/10', overlay: 'bg-black/70'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
        selected: 'border-purple-500 bg-purple-50', overlay: 'bg-black/50'
      };

  const calculatePrice = (car) => {
    let price = car.basePrice;
    if (selectedEngine) price *= selectedEngine.priceMultiplier;
    if (selectedEquipment) price *= selectedEquipment.priceMultiplier;
    return Math.round(price);
  };

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    setSelectedEngine(car.engineTypes[0]);
    setSelectedEquipment(car.equipmentLevels[0]);
  };

  const handleBuy = () => {
    if (!selectedCar) return;
    const totalPrice = calculatePrice(selectedCar);
    if (balance < totalPrice) return;

    // Deduct balance via addBonus with negative
    addBonus(-totalPrice);
    buyItem('Cars', selectedCar, totalPrice, {
      selectedEngine,
      selectedEquipment,
      category: selectedCar.category
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedCar(null);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
        <Car className="w-5 h-5" /> Car Showroom
      </h3>

      {/* Car Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {CARS.map(car => (
          <button
            key={car.id}
            onClick={() => handleSelectCar(car)}
            className={`${c.cardBg} border ${c.border} rounded-2xl p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-95`}
          >
            <div className="text-4xl text-center mb-2">{car.image}</div>
            <h4 className={`font-bold text-sm ${c.text} truncate`}>{car.name}</h4>
            <p className={`text-xs ${c.textSec} capitalize`}>{car.category}</p>
            <p className="text-sm font-bold text-green-500 mt-1">
              {formatCurrency(car.basePrice)}
            </p>
            <div className="flex items-center justify-end mt-1">
              <ChevronRight className={`w-4 h-4 ${c.textSec}`} />
            </div>
          </button>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCar && (
        <div className={`fixed inset-0 ${c.overlay} z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4`}>
          <div className={`${c.cardBg} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-700/30">
              <h3 className={`text-lg font-bold ${c.text}`}>{selectedCar.name}</h3>
              <button
                onClick={() => setSelectedCar(null)}
                className={`p-2 rounded-full ${c.innerBg}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Car Image */}
              <div className={`${c.innerBg} rounded-2xl p-8 text-center`}>
                <div className="text-7xl mb-2">{selectedCar.image}</div>
                <p className={`text-sm font-medium ${c.textSec} capitalize`}>{selectedCar.category}</p>
              </div>

              {/* Engine Type */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>🔧 Engine Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCar.engineTypes.map(engine => (
                    <button
                      key={engine.id}
                      onClick={() => setSelectedEngine(engine)}
                      className={`
                        p-3 rounded-xl border text-left transition-all text-xs
                        ${selectedEngine?.id === engine.id
                          ? c.selected
                          : `${c.innerBg} ${c.innerBorder}`
                        }
                      `}
                    >
                      <p className={`font-medium ${c.text}`}>{engine.name}</p>
                      {engine.priceMultiplier > 1 && (
                        <p className="text-yellow-500 text-[10px] mt-0.5">
                          +{Math.round((engine.priceMultiplier - 1) * 100)}% price
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Equipment */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>⚙️ Equipment</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCar.equipmentLevels.map(equip => (
                    <button
                      key={equip.id}
                      onClick={() => setSelectedEquipment(equip)}
                      className={`
                        p-3 rounded-xl border text-left transition-all text-xs
                        ${selectedEquipment?.id === equip.id
                          ? c.selected
                          : `${c.innerBg} ${c.innerBorder}`
                        }
                      `}
                    >
                      <p className={`font-medium ${c.text}`}>{equip.name}</p>
                      {equip.priceMultiplier > 1 && (
                        <p className="text-yellow-500 text-[10px] mt-0.5">
                          +{Math.round((equip.priceMultiplier - 1) * 100)}% price
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className={`${c.innerBg} rounded-2xl p-4 space-y-2`}>
                <h4 className={`text-sm font-bold ${c.text}`}>📋 Summary</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className={c.textSec}>Base Price</span>
                    <span className={c.text}>{formatCurrency(selectedCar.basePrice)}</span>
                  </div>
                  {selectedEngine && selectedEngine.priceMultiplier > 1 && (
                    <div className="flex justify-between text-xs">
                      <span className={c.textSec}>{selectedEngine.name}</span>
                      <span className="text-yellow-500">
                        +{formatCurrency(Math.round(selectedCar.basePrice * (selectedEngine.priceMultiplier - 1)))}
                      </span>
                    </div>
                  )}
                  {selectedEquipment && selectedEquipment.priceMultiplier > 1 && (
                    <div className="flex justify-between text-xs">
                      <span className={c.textSec}>{selectedEquipment.name}</span>
                      <span className="text-yellow-500">
                        +{formatCurrency(Math.round(selectedCar.basePrice * selectedEngine.priceMultiplier * (selectedEquipment.priceMultiplier - 1)))}
                      </span>
                    </div>
                  )}
                  <div className={`flex justify-between text-sm font-bold pt-2 border-t ${c.innerBorder}`}>
                    <span className={c.text}>Total</span>
                    <span className="text-green-500">{formatCurrency(calculatePrice(selectedCar))}</span>
                  </div>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={handleBuy}
                disabled={balance < calculatePrice(selectedCar)}
                className={`
                  w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2
                  transition-all duration-200
                  ${balance >= calculatePrice(selectedCar)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <ShoppingCart className="w-5 h-5" />
                {balance >= calculatePrice(selectedCar) ? 'Buy Now' : 'Insufficient Balance'}
              </button>

              {/* Success Message */}
              {showSuccess && (
                <div className="text-center py-3 bg-green-500/20 rounded-xl">
                  <p className="text-green-500 font-bold">✅ Car Purchased Successfully!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CarShowroom;