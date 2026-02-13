// src/components/investing/SellModal.jsx
import React, { useState } from 'react';
import { X, Plus, Minus, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { formatINR } from './investingData';

function SellModal({ item, owned, onSell, onClose, type = 'stock' }) {
  const { isDarkTheme } = useTheme();
  const { getStockPrice, getCryptoPrice } = useGame();
  const [quantity, setQuantity] = useState(1);

  // FIXED: Get fresh price instead of stale prop
  const currentPrice = type === 'crypto' 
    ? getCryptoPrice(item.id) || item.price 
    : getStockPrice(item.id) || item.price;

  const totalRevenue = quantity * currentPrice;
  const profitLoss = (currentPrice - owned.avgBuyPrice) * quantity;
  const isProfit = profitLoss >= 0;
  const plPercent = ((currentPrice - owned.avgBuyPrice) / owned.avgBuyPrice * 100).toFixed(1);

  const handleSell = () => {
    if (quantity > 0 && quantity <= owned.quantity) {
      onSell(type === 'crypto' ? owned.cryptoId : owned.stockId, quantity, currentPrice);
      onClose();
    }
  };

  // Quick quantity buttons
  const quickQty = [1, 5, 10, 25].filter(q => q <= owned.quantity);

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border rounded-2xl p-5 max-w-sm w-full`}>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.logo}</span>
            <div>
              <h3 className={`font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Sell {type === 'crypto' ? item.symbol : item.name}
              </h3>
              <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                Owned: {owned.quantity} units
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-full ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prices Comparison */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Your Avg Price</p>
            <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(owned.avgBuyPrice)}</p>
          </div>
          <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Current Price</p>
            <div className="flex items-center gap-1">
              <p className={`text-sm font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>{formatINR(currentPrice)}</p>
              {isProfit ? <TrendingUp className="w-3 h-3 text-green-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
            </div>
          </div>
        </div>

        {/* P/L Indicator */}
        <div className={`p-3 rounded-xl mb-4 flex items-center justify-between ${
          isProfit 
            ? isDarkTheme ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
            : isDarkTheme ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
        }`}>
          <span className={`text-xs ${isProfit ? (isDarkTheme ? 'text-green-400' : 'text-green-700') : (isDarkTheme ? 'text-red-400' : 'text-red-700')}`}>
            {isProfit ? '📈 In Profit' : '📉 In Loss'}
          </span>
          <span className={`text-sm font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            {isProfit ? '+' : ''}{plPercent}%
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="mb-4">
          <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>Sell Quantity</p>
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
                setQuantity(Math.min(Math.max(1, val), owned.quantity));
              }}
              className={`w-20 text-center py-2 rounded-xl font-bold text-lg border ${
                isDarkTheme ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
              }`}
            />
            <button
              onClick={() => setQuantity(Math.min(quantity + 1, owned.quantity))}
              className={`p-2 rounded-xl ${isDarkTheme ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Select Buttons */}
          <div className="flex gap-2 mt-2">
            {quickQty.map(q => (
              <button
                key={q}
                onClick={() => setQuantity(q)}
                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                  quantity === q ? 'bg-red-500 text-white' : isDarkTheme ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {q}
              </button>
            ))}
            <button
              onClick={() => setQuantity(owned.quantity)}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                quantity === owned.quantity ? 'bg-red-500 text-white' : isDarkTheme ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
              }`}
            >
              ALL
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className={`p-3 rounded-xl mb-4 border ${isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex justify-between mb-1">
            <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Price × Quantity</span>
            <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatINR(currentPrice)} × {quantity}
            </span>
          </div>
          <hr className={`my-2 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
          <div className="flex justify-between mb-1">
            <span className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>You'll Receive</span>
            <span className={`text-sm font-bold text-green-500`}>{formatINR(totalRevenue)}</span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Profit/Loss</span>
            <span className={`text-xs font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? '+' : ''}{formatINR(profitLoss)}
            </span>
          </div>
        </div>

        {/* Sell Button */}
        <button
          onClick={handleSell}
          disabled={quantity === 0}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            quantity > 0
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Sell {quantity} {quantity === owned.quantity ? '(All)' : ''} for {formatINR(totalRevenue)}
        </button>
      </div>
    </div>
  );
}

export default SellModal;