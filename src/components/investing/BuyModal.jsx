// src/components/investing/BuyModal.jsx
import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatINR } from './investingData';

function BuyModal({ item, currentPrice, balance, onBuy, onClose, type = 'stock' }) {
  const { isDarkTheme } = useTheme();
  const [quantity, setQuantity] = useState(1);

  const totalCost = quantity * currentPrice;
  const canAfford = balance >= totalCost;
  // FIXED: Cap maxQty to prevent extreme numbers
  const maxQty = Math.min(Math.floor(balance / currentPrice), 999999);

  const handleBuy = () => {
    if (canAfford && quantity > 0) {
      onBuy(item.id, quantity, currentPrice);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-5 max-w-sm w-full`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.logo}</span>
            <div>
              <h3 className={`font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                {type === 'crypto' ? item.symbol : item.name}
              </h3>
              <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.fullName || item.name}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-full ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Price */}
        <div className={`p-3 rounded-xl mb-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Current Price</p>
          <p className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            {formatINR(currentPrice)}
          </p>
        </div>

        {/* FIXED: Show message if can't afford even 1 */}
        {maxQty === 0 ? (
          <div className={`p-4 rounded-xl mb-4 text-center ${isDarkTheme ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-medium ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>Insufficient Balance</p>
            <p className={`text-[10px] mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              You need at least {formatINR(currentPrice)} to buy 1 unit
            </p>
          </div>
        ) : (
          <>
            {/* Quantity Selector */}
            <div className="mb-4">
              <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`p-2 rounded-xl ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setQuantity(Math.min(Math.max(1, val), maxQty));
                  }}
                  className={`w-20 text-center py-2 rounded-xl font-bold text-lg border ${
                    isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                  }`}
                />
                <button
                  onClick={() => setQuantity(Math.min(quantity + 1, maxQty))}
                  className={`p-2 rounded-xl ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {[1, 5, 10, 50].filter(q => q <= maxQty).map(q => (
                  <button
                    key={q}
                    onClick={() => setQuantity(q)}
                    className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                      quantity === q
                        ? 'bg-green-500 text-white'
                        : isDarkTheme ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
                <button
                  onClick={() => setQuantity(maxQty)}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                    quantity === maxQty
                      ? 'bg-green-500 text-white'
                      : isDarkTheme ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className={`p-3 rounded-xl mb-4 border ${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-green-50 border-green-200'}`}>
              <div className="flex justify-between mb-1">
                <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Price per unit</span>
                <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>{formatINR(currentPrice)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Quantity</span>
                <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>x{quantity}</span>
              </div>
              <hr className={`my-2 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
              <div className="flex justify-between">
                <span className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>Total Cost</span>
                <span className={`text-sm font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
                  {formatINR(totalCost)}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Available</span>
                <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{formatINR(balance)}</span>
              </div>
            </div>
          </>
        )}

        {/* Buy Button */}
        <button
          onClick={handleBuy}
          disabled={!canAfford || quantity === 0 || maxQty === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            canAfford && quantity > 0 && maxQty > 0
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02] active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {maxQty === 0 ? 'Insufficient Balance' : canAfford ? `Buy ${quantity} ${type === 'crypto' ? item.symbol : item.name}` : 'Insufficient Balance'}
        </button>
      </div>
    </div>
  );
}

export default BuyModal;