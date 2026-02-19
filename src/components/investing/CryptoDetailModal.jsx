// ============================================
// 📄 FILE: src/components/investing/CryptoDetailModal.jsx
// 🎯 PURPOSE: Crypto details, chart, buy/sell
// 🔧 REACT CONCEPTS: Same as StockDetailModal but for crypto
// ============================================

import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { formatINR, formatMarketCap } from './investingData';
import PriceChart from './PriceChart';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

function CryptoDetailModal({ crypto, onClose }) {
  const { isDarkTheme } = useTheme();
  const { balance, ownedCrypto, getCryptoPrice, buyCrypto, sellCrypto } = useGame();

  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);

  const currentPrice = getCryptoPrice(crypto.id) || crypto.price;
  const priceChange = currentPrice - crypto.price;
  const changePercent = ((priceChange / crypto.price) * 100).toFixed(2);
  const isUp = priceChange >= 0;

  // 📖 FIXED: 'oc' naam use karyu — 'c' (theme colors) sathe shadow avoid
  const owned = ownedCrypto.find(oc => oc.cryptoId === crypto.id);

  // ========== THEME COLORS ==========
  const c = isDarkTheme
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', inner: 'bg-gray-800' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', inner: 'bg-gray-50' };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[90] flex items-end sm:items-center justify-center">
        <div className={`${c.bg} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>

          {/* 📖 Header */}
          <div
            className="sticky top-0 z-10 p-4 flex items-center justify-between border-b backdrop-blur-sm"
            style={{
              borderColor: isDarkTheme ? '#374151' : '#e5e7eb',
              background: isDarkTheme ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)'
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{crypto.logo}</span>
              <div>
                <h3 className={`text-lg font-bold ${c.text}`}>{crypto.name}</h3>
                <p className={`text-xs ${c.textSec}`}>{crypto.symbol}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-full ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* 📖 Price */}
            <div className="text-center">
              <p className={`text-3xl font-bold ${c.text}`}>{formatINR(currentPrice)}</p>
              <div className={`flex items-center justify-center gap-1 mt-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isUp ? '+' : ''}{formatINR(priceChange)} ({changePercent}%)
                </span>
              </div>
            </div>

            {/* 📖 Chart */}
            <div className={`p-3 rounded-xl ${c.inner}`}>
              <PriceChart basePrice={crypto.price} volatility={crypto.volatility} />
            </div>

            {/* 📖 Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-xl ${c.inner}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Market Cap</p>
                <p className={`text-sm font-semibold ${c.text}`}>{formatMarketCap(crypto.marketCap)}</p>
              </div>
              <div className={`p-3 rounded-xl ${c.inner}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>24h Change</p>
                <p className={`text-sm font-semibold ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                </p>
              </div>
              <div className={`p-3 rounded-xl ${c.inner}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Volatility</p>
                <p className={`text-sm font-semibold ${
                  crypto.volatility > 8 ? 'text-red-500' : crypto.volatility > 5 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {crypto.volatility > 8 ? 'Very High' : crypto.volatility > 5 ? 'High' : 'Medium'}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${c.inner}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Category</p>
                <p className={`text-sm font-semibold capitalize ${c.text}`}>{crypto.category}</p>
              </div>
            </div>

            {/* 📖 Holdings */}
            {owned && (
              <div className={`p-3 rounded-xl border ${isDarkTheme ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDarkTheme ? 'text-blue-400' : 'text-blue-700'}`}>
                  Your Holdings
                </p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className={`text-[10px] ${c.textSec}`}>Quantity</p>
                    <p className={`text-sm font-bold ${c.text}`}>{owned.quantity}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${c.textSec}`}>Avg Price</p>
                    <p className={`text-sm font-bold ${c.text}`}>{formatINR(owned.avgBuyPrice)}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${c.textSec}`}>P&L</p>
                    <p className={`text-sm font-bold ${
                      (currentPrice - owned.avgBuyPrice) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatINR((currentPrice - owned.avgBuyPrice) * owned.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 📖 Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBuy(true)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-[1.02] active:scale-95 transition-all"
              >
                Buy
              </button>
              {owned && (
                <button
                  onClick={() => setShowSell(true)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Sell
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📖 Nested Modals */}
      {showBuy && (
        <BuyModal
          item={crypto}
          currentPrice={currentPrice}
          balance={balance}
          onBuy={buyCrypto}
          onClose={() => setShowBuy(false)}
          type="crypto"
        />
      )}

      {showSell && owned && (
        <SellModal
          item={crypto}
          owned={owned}
          currentPrice={currentPrice}
          onSell={sellCrypto}
          onClose={() => setShowSell(false)}
          type="crypto"
        />
      )}
    </>
  );
}

export default CryptoDetailModal;