import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatINR } from './investingData';

function BuyModal({ item, currentPrice, balance, onBuy, onClose, type = 'stock' }) {
  const { isDarkTheme } = useTheme();

  // Local Form State — quantity track kare
  const [quantity, setQuantity] = useState(1);

  // Computed Values
  // currentPrice 0 hoy to maxQty Infinity na aave
  const safePricePerUnit = currentPrice > 0 ? currentPrice : 1;
  const maxQty = Math.max(0, Math.floor(balance / safePricePerUnit));
  const totalCost = quantity * currentPrice;
  const canAfford = balance >= totalCost && quantity > 0 && maxQty > 0;

  // Handle buy action
  const handleBuy = () => {
    if (canAfford && quantity > 0) {
      onBuy(item.id, quantity, currentPrice);
      onClose();
    }
  };

  // Safe quantity setter — always within valid range
  // Minimum 1, Maximum maxQty, edge cases handle
  const setValidQuantity = (val) => {
    if (maxQty <= 0) {
      setQuantity(0);
      return;
    }
    // Clamp between 1 and maxQty
    setQuantity(Math.min(Math.max(1, val), maxQty));
  };

  const c = isDarkTheme
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', inner: 'bg-gray-800' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', inner: 'bg-gray-50' };

  return (
    // Modal Overlay — z-[100] = Above detail modals (z-[90])
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 max-w-sm w-full`}>

        {/* HEADER*/}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{item.logo}</span>
            <div>
              <h3 className={`font-bold ${c.text}`}>
                {type === 'crypto' ? item.symbol : item.name}
              </h3>
              <p className={`text-xs ${c.textSec}`}>
                {item.fullName || item.name}
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

        {/* CURRENT PRICE */}
        <div className={`p-3 rounded-xl mb-4 ${c.inner}`}>
          <p className={`text-xs ${c.textSec}`}>Current Price</p>
          <p className={`text-xl font-bold ${c.text}`}>{formatINR(currentPrice)}</p>
        </div>

        {/* QUANTITY SELECTOR */}
        <div className="mb-4">
          <p className={`text-sm mb-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
            Quantity
          </p>
          <div className="flex items-center gap-3">
            {/* Minus Button */}
            <button
              onClick={() => setValidQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className={`p-2 rounded-xl ${c.inner} hover:opacity-80 
                ${quantity <= 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Controlled Input
                onChange ma direct value set kare
                onBlur ma validation kare (min 1) — typing friendly */}
            <input
              type="number"
              value={quantity}
              onChange={(e) => {
                // Typing kare tyaare raw value set kare
                // Empty string hoy to 0 set kare
                const raw = e.target.value;
                if (raw === '' || raw === '0') {
                  setQuantity(0);
                  return;
                }
                const val = parseInt(raw);
                if (!isNaN(val)) {
                  // Upper bound check karo but lower bound nai
                  setQuantity(Math.min(val, maxQty));
                }
              }}
              onBlur={() => {
                // Focus chhode tyaare minimum 1 enforce karo
                // Typing kare tyaare 0 allow, blur par 1 enforce
                if (quantity < 1) setQuantity(1);
              }}
              min={1}
              max={maxQty}
              className={`w-20 text-center py-2 rounded-xl font-bold text-lg border
                ${c.inner} ${c.border} ${c.text}
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
            />

            {/* Plus Button */}
            <button
              onClick={() => setValidQuantity(quantity + 1)}
              disabled={quantity >= maxQty}
              className={`p-2 rounded-xl ${c.inner} hover:opacity-80
                ${quantity >= maxQty ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Select Buttons
              Button click par correct quantity set thay */}
          <div className="flex gap-2 mt-2">
            {[1, 5, 10, 50].map(q => {
              // Button affordable che ke nahi check karo
              const isAffordable = q <= maxQty;
              // Exact match check — highlight mate
              const isSelected = quantity === q;

              return (
                <button
                  key={q}
                  onClick={() => {
                    if (isAffordable) {
                      // Exact value set kare — no clamping needed
                      setQuantity(q);
                    }
                  }}
                  disabled={!isAffordable}
                  className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-green-500 text-white'
                      : isAffordable
                        ? `${c.inner} ${c.textSec} hover:opacity-80`
                        : `${c.inner} opacity-30 cursor-not-allowed ${c.textSec}`
                  }`}
                >
                  {q}
                </button>
              );
            })}
            {/* MAX Button */}
            <button
              onClick={() => {
                if (maxQty > 0) setQuantity(maxQty);
              }}
              disabled={maxQty <= 0}
              className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                quantity === maxQty && maxQty > 0
                  ? 'bg-green-500 text-white'
                  : maxQty > 0
                    ? `${c.inner} ${c.textSec} hover:opacity-80`
                    : `${c.inner} opacity-30 cursor-not-allowed ${c.textSec}`
              }`}
            >
              MAX
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className={`p-3 rounded-xl mb-4 border ${c.inner} ${c.border}`}>
          <div className="flex justify-between mb-1">
            <span className={`text-xs ${c.textSec}`}>Price per unit</span>
            <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              {formatINR(currentPrice)}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className={`text-xs ${c.textSec}`}>Quantity</span>
            <span className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
              x{quantity}
            </span>
          </div>
          <hr className={`my-2 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
          <div className="flex justify-between">
            <span className={`text-sm font-bold ${c.text}`}>Total Cost</span>
            <span className={`text-sm font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
              {formatINR(totalCost)}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              Available
            </span>
            <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              {formatINR(balance)}
            </span>
          </div>
        </div>

        {/* BUY BUTTON */}
        <button
          onClick={handleBuy}
          disabled={!canAfford || quantity <= 0}
          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            canAfford && quantity > 0
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02] active:scale-95'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {canAfford ? `Buy ${quantity} ${type === 'crypto' ? item.symbol : item.name}` : 'Insufficient Balance'}
        </button>
      </div>
    </div>
  );
}

export default BuyModal;