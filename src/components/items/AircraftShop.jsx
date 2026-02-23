import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { AIRCRAFT, formatCurrency } from './itemsData';
import { X, ShoppingCart, ChevronRight, Check } from 'lucide-react';

function AircraftShop() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem } = useItems();

  const [selected, setSelected] = useState(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [hireTeam, setHireTeam] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const buyingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-800', border: 'border-gray-700', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-700', innerBorder: 'border-gray-600',
        selected: 'border-blue-500 bg-blue-500/10', overlay: 'bg-black/70' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
        selected: 'border-blue-500 bg-blue-50', overlay: 'bg-black/50' };

  const calculatePrice = (aircraft) => {
    let price = aircraft.basePrice;
    if (selectedDesign) price *= selectedDesign.priceMultiplier;
    if (hireTeam && aircraft.hireTeam) price *= aircraft.hireTeam.priceMultiplier;
    return Math.round(price);
  };

  const handleSelect = (aircraft) => {
    setSelected(aircraft);
    setSelectedDesign(aircraft.designLevels[0]);
    setHireTeam(false);
    setShowSuccess(false);
  };

  const handleBuy = () => {
    if (!selected || buyingRef.current) return;
    const totalPrice = calculatePrice(selected);
    if (balance < totalPrice) return;

    buyingRef.current = true;

    const success = buyItem('Aircraft', selected, totalPrice, {
      selectedDesign,
      hasTeam: hireTeam,
      type: selected.type
    });

    if (success) {
      addBonus(-totalPrice);
      setShowSuccess(true);
    }

    setTimeout(() => {
      if (mountedRef.current) {
        setShowSuccess(false);
        setSelected(null);
      }
      buyingRef.current = false;
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        {AIRCRAFT.map(item => (
          <button
            key={item.id}
            onClick={() => handleSelect(item)}
            className={`${c.cardBg} border ${c.border} rounded-2xl p-3 text-left transition-all hover:scale-[1.02] active:scale-95`}
          >
            <div className="text-3xl text-center mb-1.5">{item.image}</div>
            <h4 className={`font-bold text-xs ${c.text} truncate`}>{item.name}</h4>
            <p className={`text-[10px] ${c.textSec}`}>{item.type}</p>
            <p className="text-xs font-bold text-green-500 mt-1">{formatCurrency(item.basePrice)}</p>
            <div className="flex items-center justify-end mt-0.5">
              <ChevronRight className={`w-3.5 h-3.5 ${c.textSec}`} />
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className={`fixed inset-0 ${c.overlay} z-[100] flex items-end sm:items-center justify-center`}>
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${c.border} ${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-t-3xl sm:rounded-t-2xl`}>
              <h3 className={`text-lg font-bold ${c.text}`}>{selected.name}</h3>
              <button onClick={() => { setSelected(null); setShowSuccess(false); }} className={`p-2 rounded-full ${c.innerBg}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className={`${c.innerBg} rounded-2xl p-6 text-center`}>
                <div className="text-6xl mb-2">{selected.image}</div>
                <p className={`text-sm font-medium ${c.textSec}`}>{selected.type}</p>
                <p className={`text-xs ${c.textSec} mt-1`}>{selected.description}</p>
              </div>

              {/* Design Selection */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>🎨 Interior Design</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selected.designLevels.map(design => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`p-2.5 rounded-xl border text-left transition-all text-xs
                        ${selectedDesign?.id === design.id ? c.selected : `${c.innerBg} border ${c.innerBorder}`}`}
                    >
                      <p className={`font-medium ${c.text} text-[11px]`}>{design.name}</p>
                      {design.priceMultiplier > 1 && (
                        <p className="text-yellow-500 text-[10px] mt-0.5">+{Math.round((design.priceMultiplier - 1) * 100)}%</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hire Team Toggle */}
              <div>
                <h4 className={`text-sm font-bold ${c.text} mb-2`}>👥 Crew</h4>
                <button
                  onClick={() => setHireTeam(!hireTeam)}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between
                    ${hireTeam ? c.selected : `${c.innerBg} border ${c.innerBorder}`}`}
                >
                  <div>
                    <p className={`font-medium text-xs ${c.text}`}>{selected.hireTeam.name}</p>
                    <p className="text-yellow-500 text-[10px] mt-0.5">
                      +{Math.round((selected.hireTeam.priceMultiplier - 1) * 100)}%
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center
                    ${hireTeam ? 'bg-blue-500 border-blue-500' : `${c.innerBorder}`}`}>
                    {hireTeam && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              </div>

              {/* Price Summary */}
              <div className={`${c.innerBg} rounded-2xl p-3.5 space-y-1.5`}>
                <h4 className={`text-sm font-bold ${c.text}`}>📋 Summary</h4>
                <div className="flex justify-between text-xs">
                  <span className={c.textSec}>Base Price</span>
                  <span className={c.text}>{formatCurrency(selected.basePrice)}</span>
                </div>
                {selectedDesign && selectedDesign.priceMultiplier > 1 && (
                  <div className="flex justify-between text-xs">
                    <span className={c.textSec}>{selectedDesign.name}</span>
                    <span className="text-yellow-500">+{formatCurrency(Math.round(selected.basePrice * (selectedDesign.priceMultiplier - 1)))}</span>
                  </div>
                )}
                {hireTeam && (
                  <div className="flex justify-between text-xs">
                    <span className={c.textSec}>{selected.hireTeam.name}</span>
                    <span className="text-yellow-500">+{formatCurrency(Math.round(selected.basePrice * (selectedDesign?.priceMultiplier || 1) * (selected.hireTeam.priceMultiplier - 1)))}</span>
                  </div>
                )}
                <div className={`flex justify-between text-sm font-bold pt-1.5 border-t ${c.innerBorder}`}>
                  <span className={c.text}>Total</span>
                  <span className="text-green-500">{formatCurrency(calculatePrice(selected))}</span>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={balance < calculatePrice(selected) || showSuccess}
                className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                  ${showSuccess ? 'bg-green-500 text-white' : balance >= calculatePrice(selected)
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
              >
                {showSuccess ? <><Check className="w-5 h-5" /> Purchased!</> : <><ShoppingCart className="w-5 h-5" /> {balance >= calculatePrice(selected) ? 'Buy Now' : 'Insufficient Balance'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AircraftShop;