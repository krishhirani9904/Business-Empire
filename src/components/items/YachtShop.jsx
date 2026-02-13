// src/components/items/YachtShop.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { YACHTS, formatCurrency } from './itemsData';
import { Ship, X, ChevronRight, ShoppingCart, Users, MapPin } from 'lucide-react';

function YachtShop() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem } = useItems();
  const [selectedYacht, setSelectedYacht] = useState(null);
  const [hireTeam, setHireTeam] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
        selected: 'border-cyan-500 bg-cyan-500/10', overlay: 'bg-black/70'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
        selected: 'border-cyan-500 bg-cyan-50', overlay: 'bg-black/50'
      };

  const calculatePrice = (yacht) => {
    let price = yacht.basePrice;
    if (hireTeam) price *= yacht.hireTeam.priceMultiplier;
    if (selectedDesign) price *= selectedDesign.priceMultiplier;
    return Math.round(price);
  };

  const handleSelect = (yacht) => {
    setSelectedYacht(yacht);
    setHireTeam(false);
    setSelectedDesign(yacht.designLevels[0]);
    setSelectedLocation(yacht.locations[0]);
  };

  const handleBuy = () => {
    if (!selectedYacht) return;
    const totalPrice = calculatePrice(selectedYacht);
    if (balance < totalPrice) return;

    addBonus(-totalPrice);
    buyItem('Yachts', selectedYacht, totalPrice, {
      hasTeam: hireTeam,
      selectedDesign,
      selectedLocation
    });

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedYacht(null);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
        <Ship className="w-5 h-5" /> Yacht Shop
      </h3>

      <div className="grid gap-3">
        {YACHTS.map(yacht => (
          <button
            key={yacht.id}
            onClick={() => handleSelect(yacht)}
            className={`${c.cardBg} border ${c.border} rounded-2xl p-4 flex items-center gap-4 w-full text-left transition-all hover:scale-[1.01] active:scale-95`}
          >
            <div className="text-4xl">{yacht.image}</div>
            <div className="flex-1 min-w-0">
              <h4 className={`font-bold ${c.text} truncate`}>{yacht.name}</h4>
              <p className={`text-xs ${c.textSec}`}>{yacht.type}</p>
              <p className="text-sm font-bold text-green-500 mt-1">
                {formatCurrency(yacht.basePrice)}
              </p>
            </div>
            <ChevronRight className={`w-5 h-5 ${c.textSec}`} />
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedYacht && (
        <div className={`fixed inset-0 ${c.overlay} z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4`}>
          <div className={`${c.cardBg} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-700/30">
              <h3 className={`text-lg font-bold ${c.text}`}>{selectedYacht.name}</h3>
              <button onClick={() => setSelectedYacht(null)} className={`p-2 rounded-full ${c.innerBg}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className={`${c.innerBg} rounded-2xl p-8 text-center`}>
                <div className="text-7xl mb-2">{selectedYacht.image}</div>
                <p className={`text-sm font-medium ${c.textSec}`}>{selectedYacht.type}</p>
              </div>

              {/* Hire Team */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>👨‍✈️ Hire a Team</h4>
                <button
                  onClick={() => setHireTeam(!hireTeam)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center gap-3
                    ${hireTeam ? c.selected : `${c.innerBg} ${c.innerBorder}`}`}
                >
                  <Users className={`w-5 h-5 ${hireTeam ? 'text-cyan-500' : c.textSec}`} />
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${c.text}`}>{selectedYacht.hireTeam.name}</p>
                    <p className="text-yellow-500 text-xs">
                      +{Math.round((selectedYacht.hireTeam.priceMultiplier - 1) * 100)}% price
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${hireTeam ? 'border-cyan-500 bg-cyan-500' : c.innerBorder}`}>
                    {hireTeam && <span className="text-white text-xs">✓</span>}
                  </div>
                </button>
              </div>

              {/* Design */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>🎨 Design</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedYacht.designLevels.map(design => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`p-3 rounded-xl border text-left transition-all text-xs
                        ${selectedDesign?.id === design.id ? c.selected : `${c.innerBg} ${c.innerBorder}`}`}
                    >
                      <p className={`font-medium ${c.text}`}>{design.name}</p>
                      {design.priceMultiplier > 1 && (
                        <p className="text-yellow-500 text-[10px] mt-0.5">
                          +{Math.round((design.priceMultiplier - 1) * 100)}% price
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>📍 Yacht Location</h4>
                <div className="grid gap-2">
                  {selectedYacht.locations.map(loc => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 text-xs
                        ${selectedLocation === loc ? c.selected : `${c.innerBg} ${c.innerBorder}`}`}
                    >
                      <MapPin className={`w-4 h-4 ${selectedLocation === loc ? 'text-cyan-500' : c.textSec}`} />
                      <span className={`font-medium ${c.text}`}>{loc}</span>
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
                    <span className={c.text}>{formatCurrency(selectedYacht.basePrice)}</span>
                  </div>
                  {hireTeam && (
                    <div className="flex justify-between text-xs">
                      <span className={c.textSec}>{selectedYacht.hireTeam.name}</span>
                      <span className="text-yellow-500">+{formatCurrency(Math.round(selectedYacht.basePrice * (selectedYacht.hireTeam.priceMultiplier - 1)))}</span>
                    </div>
                  )}
                  {selectedDesign && selectedDesign.priceMultiplier > 1 && (
                    <div className="flex justify-between text-xs">
                      <span className={c.textSec}>{selectedDesign.name}</span>
                      <span className="text-yellow-500">+{formatCurrency(Math.round(selectedYacht.basePrice * (hireTeam ? selectedYacht.hireTeam.priceMultiplier : 1) * (selectedDesign.priceMultiplier - 1)))}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span className={c.textSec}>Location</span>
                    <span className={c.text}>{selectedLocation}</span>
                  </div>
                  <div className={`flex justify-between text-sm font-bold pt-2 border-t ${c.innerBorder}`}>
                    <span className={c.text}>Total</span>
                    <span className="text-green-500">{formatCurrency(calculatePrice(selectedYacht))}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={balance < calculatePrice(selectedYacht)}
                className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2
                  ${balance >= calculatePrice(selectedYacht)
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {balance >= calculatePrice(selectedYacht) ? 'Buy Now' : 'Insufficient Balance'}
              </button>

              {showSuccess && (
                <div className="text-center py-3 bg-green-500/20 rounded-xl">
                  <p className="text-green-500 font-bold">✅ Yacht Purchased!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YachtShop;