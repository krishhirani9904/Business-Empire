// src/components/investing/CryptoDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, RefreshCw, AlertTriangle } from 'lucide-react';
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
  const [refreshKey, setRefreshKey] = useState(0);

  // FIXED: Get current price using context (auto-updates)
  const currentPrice = getCryptoPrice(crypto.id) || crypto.price;
  const priceChange = currentPrice - crypto.price;
  const changePercent = ((priceChange / crypto.price) * 100).toFixed(2);
  const isUp = priceChange >= 0;

  const owned = ownedCrypto.find(c => c.cryptoId === crypto.id);

  // Refresh chart periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Volatility warning
  const isHighVolatility = crypto.volatility >= 9;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[90] flex items-end sm:items-center justify-center">
        <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>

          {/* Header */}
          <div className="sticky top-0 z-10 p-4 flex items-center justify-between border-b backdrop-blur-sm"
            style={{ borderColor: isDarkTheme ? '#374151' : '#e5e7eb', background: isDarkTheme ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{crypto.logo}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{crypto.name}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    crypto.category === 'hot' ? 'bg-orange-500/20 text-orange-500' :
                    crypto.category === 'gainer' ? 'bg-green-500/20 text-green-500' :
                    'bg-red-500/20 text-red-500'
                  }`}>
                    {crypto.category.toUpperCase()}
                  </span>
                </div>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{crypto.symbol}</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">

            {/* High Volatility Warning */}
            {isHighVolatility && (
              <div className={`p-3 rounded-xl flex items-center gap-2 ${
                isDarkTheme ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
              }`}>
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className={`text-[10px] ${isDarkTheme ? 'text-red-400' : 'text-red-600'}`}>
                  ⚠️ Extremely volatile asset! Price can change drastically. Invest with caution.
                </p>
              </div>
            )}

            {/* Price with Live Indicator */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <p className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(currentPrice)}</p>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                  isDarkTheme ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}>
                  <RefreshCw className="w-3 h-3" />
                  LIVE
                </div>
              </div>
              <div className={`flex items-center justify-center gap-1 mt-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {isUp ? '+' : ''}{formatINR(priceChange)} ({changePercent}%)
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <PriceChart key={refreshKey} basePrice={crypto.price} volatility={crypto.volatility} />
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Market Cap</p>
                <p className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatMarketCap(crypto.marketCap)}</p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>24h Change</p>
                <p className={`text-sm font-semibold ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                </p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Volatility</p>
                <div className="flex items-center gap-1">
                  <p className={`text-sm font-semibold ${crypto.volatility > 8 ? 'text-red-500' : crypto.volatility > 5 ? 'text-yellow-500' : 'text-green-500'}`}>
                    {crypto.volatility > 8 ? 'Very High' : crypto.volatility > 5 ? 'High' : 'Medium'}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    {crypto.volatility}/10
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Category</p>
                <p className={`text-sm font-semibold capitalize ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{crypto.category}</p>
              </div>
            </div>

            {/* Owned */}
            {owned && (
              <div className={`p-3 rounded-xl border ${isDarkTheme ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDarkTheme ? 'text-blue-400' : 'text-blue-700'}`}>🪙 Your Holdings</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Quantity</p>
                    <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{owned.quantity}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Avg Price</p>
                    <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(owned.avgBuyPrice)}</p>
                  </div>
                  <div>
                    <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>P&L</p>
                    <p className={`text-sm font-bold ${(currentPrice - owned.avgBuyPrice) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatINR((currentPrice - owned.avgBuyPrice) * owned.quantity)}
                    </p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-dashed" style={{ borderColor: isDarkTheme ? '#1e3a5f' : '#bfdbfe' }}>
                  <div className="flex justify-between">
                    <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Total Value</span>
                    <span className={`text-xs font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {formatINR(currentPrice * owned.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
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
          onSell={sellCrypto}
          onClose={() => setShowSell(false)}
          type="crypto"
        />
      )}
    </>
  );
}

export default CryptoDetailModal;