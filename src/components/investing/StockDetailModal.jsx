// src/components/investing/StockDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { formatINR, formatMarketCap } from './investingData';
import PriceChart from './PriceChart';
import BuyModal from './BuyModal';
import SellModal from './SellModal';

function StockDetailModal({ stock, onClose }) {
  const { isDarkTheme } = useTheme();
  const { balance, ownedStocks, getStockPrice, buyStock, sellStock } = useGame();
  const [showBuy, setShowBuy] = useState(false);
  const [showSell, setShowSell] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // FIXED: Get current price using context (auto-updates)
  const currentPrice = getStockPrice(stock.id) || stock.price;
  const priceChange = currentPrice - stock.price;
  const changePercent = ((priceChange / stock.price) * 100).toFixed(2);
  const isUp = priceChange >= 0;

  const owned = ownedStocks.find(s => s.stockId === stock.id);

  // Refresh chart periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-[90] flex items-end sm:items-center justify-center">
        <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>

          {/* Header */}
          <div className="sticky top-0 z-10 p-4 flex items-center justify-between border-b backdrop-blur-sm"
            style={{ borderColor: isDarkTheme ? '#374151' : '#e5e7eb', background: isDarkTheme ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.95)' }}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{stock.logo}</span>
              <div>
                <h3 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stock.name}</h3>
                <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{stock.fullName}</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full ${isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">

            {/* Price with Live Indicator */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <p className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(currentPrice)}</p>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] ${
                  isDarkTheme ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
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
              <PriceChart key={refreshKey} basePrice={stock.price} volatility={stock.volatility} />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Sector</p>
                <p className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stock.sector}</p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Dividend Yield</p>
                <p className={`text-sm font-semibold text-green-500`}>{stock.dividendYield}%</p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Market Cap</p>
                <p className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatMarketCap(stock.capitalization)}</p>
              </div>
              <div className={`p-3 rounded-xl ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Volatility</p>
                <p className={`text-sm font-semibold ${stock.volatility > 7 ? 'text-red-500' : stock.volatility > 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                  {stock.volatility > 7 ? 'High' : stock.volatility > 4 ? 'Medium' : 'Low'}
                </p>
              </div>
            </div>

            {/* Estimated Dividend */}
            {stock.dividendYield > 0 && (
              <div className={`p-3 rounded-xl border ${isDarkTheme ? 'bg-yellow-900/10 border-yellow-800' : 'bg-yellow-50 border-yellow-200'}`}>
                <p className={`text-xs font-semibold mb-1 ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-700'}`}>💰 Estimated Dividend Income</p>
                <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                  Per share/year: {formatINR(currentPrice * stock.dividendYield / 100)}
                </p>
              </div>
            )}

            {/* Owned Info */}
            {owned && (
              <div className={`p-3 rounded-xl border ${isDarkTheme ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                <p className={`text-xs font-semibold mb-2 ${isDarkTheme ? 'text-green-400' : 'text-green-700'}`}>📊 Your Holdings</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className={`text-[10px] ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Shares</p>
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
                <div className="mt-2 pt-2 border-t border-dashed" style={{ borderColor: isDarkTheme ? '#374151' : '#d1fae5' }}>
                  <div className="flex justify-between">
                    <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Total Value</span>
                    <span className={`text-xs font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {formatINR(currentPrice * owned.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
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
          item={stock}
          currentPrice={currentPrice}
          balance={balance}
          onBuy={buyStock}
          onClose={() => setShowBuy(false)}
          type="stock"
        />
      )}

      {showSell && owned && (
        <SellModal
          item={stock}
          owned={owned}
          onSell={sellStock}
          onClose={() => setShowSell(false)}
          type="stock"
        />
      )}
    </>
  );
}

export default StockDetailModal;