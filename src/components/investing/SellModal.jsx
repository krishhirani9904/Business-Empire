// ============================================
// 📄 FILE: src/components/investing/SellModal.jsx
// 🎯 PURPOSE: Generic sell modal for stocks & crypto
// 🔧 FIXES:
//    1. Quick-select buttons (1,5,10,ALL) — properly select thay
//    2. Input field — custom quantity type kari sakay
//    3. Profit/Loss calculation correct
//    4. Quantity validation against owned amount
// 🔧 REACT CONCEPTS:
//    1. Profit/Loss calculation
//    2. Quantity validation against owned
//    3. Same pattern as BuyModal but for selling
// ============================================

import React, { useState } from 'react';
import { X, Plus, Minus, DollarSign } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatINR } from './investingData';

function SellModal({ item, owned, currentPrice, onSell, onClose, type = 'stock' }) {
  // 📖 owned = { stockId/cryptoId, quantity, avgBuyPrice }
  const { isDarkTheme } = useTheme();
  const [quantity, setQuantity] = useState(1);

  // 📖 Maximum sellable = owned quantity
  const maxSellQty = owned.quantity;

  // 📖 Profit/Loss Calculation
  const totalRevenue = quantity * currentPrice;
  const profitLoss = (currentPrice - owned.avgBuyPrice) * quantity;
  const isProfit = profitLoss >= 0;

  // 📖 Sell handler
  const handleSell = () => {
    if (quantity > 0 && quantity <= maxSellQty) {
      // 📖 onSell expects: (stockId/cryptoId, quantity, pricePerUnit)
      const itemId = type === 'crypto' ? owned.cryptoId : owned.stockId;
      onSell(itemId, quantity, currentPrice);
      onClose();
    }
  };

  // 📖 Safe quantity setter — always within 1 to maxSellQty
  const setValidQuantity = (val) => {
    if (maxSellQty <= 0) {
      setQuantity(0);
      return;
    }
    setQuantity(Math.min(Math.max(1, val), maxSellQty));
  };

  // ========== THEME COLORS ==========
  const c = isDarkTheme
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', inner: 'bg-gray-800' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', inner: 'bg-gray-50' };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 max-w-sm w-full`}>

        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.logo}</span>
            <div>
              <h3 className={`font-bold ${c.text}`}>
                Sell {type === 'crypto' ? item.symbol : item.name}
              </h3>
              <p className={`text-xs ${c.textSec}`}>
                Owned: {owned.quantity} units
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-full hover:opacity-80 ${c.inner}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===== PRICE COMPARISON ===== */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`p-3 rounded-xl ${c.inner}`}>
            <p className={`text-[10px] ${c.textSec}`}>Avg Buy Price</p>
            <p className={`text-sm font-bold ${c.text}`}>{formatINR(owned.avgBuyPrice)}</p>
          </div>
          <div className={`p-3 rounded-xl ${c.inner}`}>
            <p className={`text-[10px] ${c.textSec}`}>Current Price</p>
            <p className={`text-sm font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {formatINR(currentPrice)}
            </p>
          </div>
        </div>

        {/* ===== QUANTITY SELECTOR ===== */}
        <div className="mb-4">
          <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
            Sell Quantity
          </p>
          <div className="flex items-center gap-3">
            {/* Minus Button */}
            <button
              onClick={() => setValidQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className={`p-2 rounded-xl ${c.inner}
                ${quantity <= 1 ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* 📖 Controlled Input
                🔧 FIXED: Same fix as BuyModal — typing friendly */}
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '' || raw === '0') {
                  setQuantity(0);
                  return;
                }
                const val = parseInt(raw);
                if (!isNaN(val)) {
                  // 📖 Upper bound = owned quantity
                  setQuantity(Math.min(val, maxSellQty));
                }
              }}
              onBlur={() => {
                // 📖 Focus chhode tyaare minimum 1 enforce karo
                if (quantity < 1) setQuantity(1);
              }}
              min={1}
              max={maxSellQty}
              className={`w-20 text-center py-2 rounded-xl font-bold text-lg border ${c.inner} ${c.border} ${c.text}
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />

            {/* Plus Button */}
            <button
              onClick={() => setValidQuantity(quantity + 1)}
              disabled={quantity >= maxSellQty}
              className={`p-2 rounded-xl ${c.inner}
                ${quantity >= maxSellQty ? 'opacity-40 cursor-not-allowed' : 'hover:opacity-80'}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* 📖 Quick Select Buttons
              🔧 FIXED: Each button sets EXACT value, disabled if > owned */}
          <div className="flex gap-2 mt-2">
            {[1, 5, 10].map(q => {
              const isAvailable = q <= maxSellQty;
              const isSelected = quantity === q;

              return (
                <button
                  key={q}
                  onClick={() => {
                    if (isAvailable) setQuantity(q);
                  }}
                  disabled={!isAvailable}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors
                    ${isSelected
                      ? 'bg-red-500 text-white'
                      : isAvailable
                        ? `${c.inner} ${c.textSec} hover:opacity-80`
                        : `${c.inner} opacity-30 cursor-not-allowed ${c.textSec}`
                    }`}
                >
                  {q}
                </button>
              );
            })}
            {/* ALL Button */}
            <button
              onClick={() => setQuantity(maxSellQty)}
              disabled={maxSellQty <= 0}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors
                ${quantity === maxSellQty && maxSellQty > 0
                  ? 'bg-red-500 text-white'
                  : maxSellQty > 0
                    ? `${c.inner} ${c.textSec} hover:opacity-80`
                    : `${c.inner} opacity-30 cursor-not-allowed ${c.textSec}`
                }`}
            >
              ALL
            </button>
          </div>
        </div>

        {/* ===== SUMMARY ===== */}
        <div className={`p-3 rounded-xl mb-4 border ${c.inner} ${c.border}`}>
          <div className="flex justify-between mb-1">
            <span className={`text-xs ${c.textSec}`}>Revenue</span>
            <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatINR(totalRevenue)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-xs ${c.textSec}`}>Profit/Loss</span>
            <span className={`text-xs font-bold ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
              {isProfit ? '+' : ''}{formatINR(profitLoss)}
            </span>
          </div>
        </div>

        {/* ===== SELL BUTTON ===== */}
        <button
          onClick={handleSell}
          disabled={quantity <= 0}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            quantity > 0
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Sell {quantity} units
        </button>
      </div>
    </div>
  );
}

export default SellModal;