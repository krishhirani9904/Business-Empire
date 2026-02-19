// ============================================
// 📄 FILE: src/components/investing/PropertyBuyModal.jsx
// 🎯 PURPOSE: Property buy confirmation modal
// 🔧 REACT CONCEPTS:
//    1. Confirmation modal pattern
//    2. Property details display
//    3. Affordability check
// ============================================

import React from 'react';
import { X, Home, MapPin, TrendingUp, Wrench } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatINR } from './investingData';

function PropertyBuyModal({ property, balance, onBuy, onClose }) {
  const { isDarkTheme } = useTheme();

  // 📖 Can user afford this property?
  const canAfford = balance >= property.price;

  // 📖 Calculate potential max income (base + all improvements)
  const maxPotentialIncome = property.rentalIncomePerHour +
    property.improvements.reduce((sum, imp) => sum + imp.bonusIncome, 0);

  // 📖 ROI calculation (yearly return percentage)
  const yearlyIncome = property.rentalIncomePerHour * 24 * 365;
  const roiPercent = ((yearlyIncome / property.price) * 100).toFixed(2);

  // 📖 Handle buy action
  const handleBuy = () => {
    if (canAfford) {
      onBuy(property);
      onClose();
    }
  };

  // ========== THEME COLORS ==========
  const c = isDarkTheme
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', inner: 'bg-gray-800' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', inner: 'bg-gray-50' };

  return (
    // 📖 Modal Overlay — z-[100] = Above other modals
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 max-w-sm w-full max-h-[85vh] overflow-y-auto`}>

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{property.image}</span>
            <div>
              <h3 className={`font-bold text-lg ${c.text}`}>{property.name}</h3>
              <p className={`text-xs ${c.textSec} flex items-center gap-1`}>
                <MapPin className="w-3 h-3" />
                {property.location}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== PROPERTY DETAILS ===== */}
        <div className="space-y-3 mb-4">
          {/* Price */}
          <div className={`p-3 rounded-xl ${c.inner}`}>
            <p className={`text-xs ${c.textSec}`}>Property Price</p>
            <p className={`text-2xl font-bold ${c.text}`}>{formatINR(property.price)}</p>
          </div>

          {/* Income Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-3 rounded-xl ${c.inner}`}>
              <p className={`text-[10px] ${c.textSec}`}>Base Rental Income</p>
              <p className="text-sm font-bold text-green-500">
                +{formatINR(property.rentalIncomePerHour)}/hr
              </p>
            </div>
            <div className={`p-3 rounded-xl ${c.inner}`}>
              <p className={`text-[10px] ${c.textSec}`}>Max Potential</p>
              <p className="text-sm font-bold text-emerald-500">
                +{formatINR(maxPotentialIncome)}/hr
              </p>
            </div>
            <div className={`p-3 rounded-xl ${c.inner}`}>
              <p className={`text-[10px] ${c.textSec}`}>Property Type</p>
              <p className={`text-sm font-semibold capitalize ${c.text}`}>{property.type}</p>
            </div>
            <div className={`p-3 rounded-xl ${c.inner}`}>
              <p className={`text-[10px] ${c.textSec}`}>Annual ROI</p>
              <p className="text-sm font-semibold text-blue-500">{roiPercent}%</p>
            </div>
          </div>

          {/* Improvements Available */}
          <div className={`p-3 rounded-xl ${c.inner}`}>
            <p className={`text-xs font-semibold mb-2 flex items-center gap-1 ${c.textSec}`}>
              <Wrench className="w-3.5 h-3.5" />
              Available Improvements ({property.improvements.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {property.improvements.map(imp => (
                <span
                  key={imp.id}
                  className={`text-[10px] px-2 py-1 rounded-full ${
                    isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {imp.name} (+{formatINR(imp.bonusIncome)}/hr)
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ===== BALANCE INFO ===== */}
        <div className={`p-3 rounded-xl mb-4 border ${c.inner} ${c.border}`}>
          <div className="flex justify-between mb-1">
            <span className={`text-xs ${c.textSec}`}>Property Price</span>
            <span className={`text-xs font-medium ${c.text}`}>{formatINR(property.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${c.textSec}`}>Your Balance</span>
            <span className={`text-xs font-medium ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
              {formatINR(balance)}
            </span>
          </div>
          <hr className={`my-2 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
          <div className="flex justify-between">
            <span className={`text-sm font-bold ${c.text}`}>After Purchase</span>
            <span className={`text-sm font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
              {formatINR(balance - property.price)}
            </span>
          </div>
        </div>

        {/* ===== BUY BUTTON ===== */}
        <button
          onClick={handleBuy}
          disabled={!canAfford}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            canAfford
              ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:scale-[1.02] active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Home className="w-4 h-4" />
          {canAfford ? `Buy ${property.name}` : 'Insufficient Balance'}
        </button>
      </div>
    </div>
  );
}

export default PropertyBuyModal;