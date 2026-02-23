import React, { useState, useMemo, useEffect } from 'react';
import { Wallet, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { CRYPTOCURRENCIES, formatINR } from './investingData';
import MiniChart from './MiniChart';
import CryptoDetailModal from './CryptoDetailModal';

function CryptoTab() {
  const { isDarkTheme } = useTheme();
  const { ownedCrypto, getCryptoPrice } = useGame();

  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [showBuyList, setShowBuyList] = useState(false);
  const [cryptoFilter, setCryptoFilter] = useState('all');
  const [ownedCryptoSort, setOwnedCryptoSort] = useState('value');
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // CALCULATIONS
  const totalCryptoValue = useMemo(() => {
    return ownedCrypto.reduce((sum, owned) => {
      const currentPrice = getCryptoPrice(owned.cryptoId);
      return sum + (currentPrice * owned.quantity);
    }, 0);
  }, [ownedCrypto, getCryptoPrice]);

  const totalCryptoInvested = useMemo(() => {
    return ownedCrypto.reduce(
      (sum, owned) => sum + (owned.avgBuyPrice * owned.quantity),
      0
    );
  }, [ownedCrypto]);

  const cryptoPL = totalCryptoValue - totalCryptoInvested;
  const cryptoPLPercent = totalCryptoInvested > 0
    ? ((cryptoPL / totalCryptoInvested) * 100).toFixed(2)
    : 0;

  // FILTERED CRYPTO
  const filteredCrypto = useMemo(() => {
    let list = [...CRYPTOCURRENCIES];
    switch (cryptoFilter) {
      case 'hot':
        list = list.filter(cr => cr.category === 'hot');
        break;
      case 'gainer':
        list = list.filter(cr => cr.category === 'gainer').sort((a, b) => b.change24h - a.change24h);
        break;
      case 'loser':
        list = list.filter(cr => cr.category === 'loser').sort((a, b) => a.change24h - b.change24h);
        break;
      case 'highCap':
        list.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case 'lowCap':
        list.sort((a, b) => a.marketCap - b.marketCap);
        break;
      case 'highPrice':
        list.sort((a, b) => (getCryptoPrice(b.id) || b.price) - (getCryptoPrice(a.id) || a.price));
        break;
      case 'lowPrice':
        list.sort((a, b) => (getCryptoPrice(a.id) || a.price) - (getCryptoPrice(b.id) || b.price));
        break;
      default:
        break;
    }
    return list;
  }, [cryptoFilter, getCryptoPrice]);

  // SORTED OWNED
  const sortedOwnedCrypto = useMemo(() => {
    if (ownedCrypto.length === 0) return [];

    let sorted = ownedCrypto.map(owned => {
      const crypto = CRYPTOCURRENCIES.find(cr => cr.id === owned.cryptoId);
      const currentPrice = getCryptoPrice(owned.cryptoId);
      const value = currentPrice * owned.quantity;
      const pl = (currentPrice - owned.avgBuyPrice) * owned.quantity;
      const plPercent = owned.avgBuyPrice > 0
        ? ((pl / (owned.avgBuyPrice * owned.quantity)) * 100)
        : 0;
      return { ...owned, crypto, currentPrice, value, pl, plPercent };
    }).filter(item => item.crypto);

    switch (ownedCryptoSort) {
      case 'value':
        sorted.sort((a, b) => b.value - a.value);
        break;
      case 'profitFirst':
        sorted.sort((a, b) => b.pl - a.pl);
        break;
      case 'lossFirst':
        sorted.sort((a, b) => a.pl - b.pl);
        break;
      case 'quantityHigh':
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'quantityLow':
        sorted.sort((a, b) => a.quantity - b.quantity);
        break;
      default:
        break;
    }
    return sorted;
  }, [ownedCrypto, getCryptoPrice, ownedCryptoSort]);

  const colors = isDarkTheme
    ? {
        cardBg: 'bg-gray-800/50', border: 'border-gray-700',
        text: 'text-white', textSec: 'text-gray-400',
        inner: 'bg-gray-800'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200',
        text: 'text-gray-900', textSec: 'text-gray-500',
        inner: 'bg-gray-50'
      };

  // OPTIONS
  const cryptoFilterOptions = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'hot', label: 'Hot', icon: '🔥' },
    { id: 'gainer', label: 'Gainers', icon: '📈' },
    { id: 'loser', label: 'Losers', icon: '📉' },
    { id: 'highCap', label: 'Highest Cap', icon: '💎' },
    { id: 'lowCap', label: 'Lowest Cap', icon: '🪙' },
    { id: 'highPrice', label: 'High Price', icon: '💰' },
    { id: 'lowPrice', label: 'Low Price', icon: '🏷️' }
  ];

  const ownedSortOptions = [
    { value: 'value', label: 'By Value' },
    { value: 'profitFirst', label: 'Profit First' },
    { value: 'lossFirst', label: 'Loss First' },
    { value: 'quantityHigh', label: 'Most Coins' },
    { value: 'quantityLow', label: 'Least Coins' }
  ];

  return (
    <div className="px-2 space-y-4">

      {/* PORTFOLIO CARD */}
      <div className={`p-4 rounded-2xl border ${
        isDarkTheme
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-5 h-5 text-blue-500" />
          <p className={`text-xs ${colors.textSec}`}>Crypto Portfolio</p>
        </div>
        <p className={`text-2xl font-bold ${colors.text}`}>{formatINR(totalCryptoValue)}</p>

        <div className="flex items-center gap-3 mt-1">
          <span className={`text-sm font-medium ${cryptoPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {cryptoPL >= 0 ? '+' : ''}{formatINR(cryptoPL)} ({cryptoPLPercent}%)
          </span>
          <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
            Total P&L
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className={`p-2 rounded-lg ${colors.inner}`}>
            <p className={`text-[10px] ${colors.textSec}`}>Invested</p>
            <p className={`text-xs font-bold ${colors.text}`}>{formatINR(totalCryptoInvested)}</p>
          </div>
          <div className={`p-2 rounded-lg ${colors.inner}`}>
            <p className={`text-[10px] ${colors.textSec}`}>Coins Owned</p>
            <p className={`text-xs font-bold ${colors.text}`}>{ownedCrypto.length}</p>
          </div>
        </div>
      </div>

      {/* BUY CRYPTO SECTION */}
      <div>
        <button
          onClick={() => setShowBuyList(prev => !prev)}
          className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all
            hover:scale-[1.01] active:scale-[0.99] ${colors.cardBg} ${colors.border}`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h3 className={`text-sm font-bold ${colors.text}`}>Buy Cryptocurrency</h3>
              <p className={`text-[11px] ${colors.textSec}`}>
                {CRYPTOCURRENCIES.length} coins available
              </p>
            </div>
          </div>
          <span className={`text-lg ${colors.textSec}`}>
            {showBuyList ? '▲' : '▼'}
          </span>
        </button>

        {showBuyList && (
          <div className="mt-3">
            {/* Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {cryptoFilterOptions.map(f => (
                <button
                  key={f.id}
                  onClick={() => setCryptoFilter(f.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition-all ${
                    cryptoFilter === f.id
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                      : isDarkTheme
                        ? 'bg-gray-700 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Scrollable Buy List */}
            <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
              {filteredCrypto.map(crypto => {
                const currentPrice = getCryptoPrice(crypto.id) || crypto.price;
                const change = currentPrice - crypto.price;
                const changePercent = ((change / crypto.price) * 100).toFixed(1);
                const isUp = change >= 0;
                const ownedCoin = ownedCrypto.find(oc => oc.cryptoId === crypto.id);

                return (
                  <button
                    key={crypto.id}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`w-full p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] text-left
                      ${colors.cardBg} ${colors.border}
                      ${ownedCoin ? (isDarkTheme ? 'ring-1 ring-blue-800' : 'ring-1 ring-blue-300') : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">{crypto.logo}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold truncate ${colors.text}`}>{crypto.name}</p>
                            {ownedCoin && (
                              <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded-full font-medium">
                                OWNED
                              </span>
                            )}
                          </div>
                          <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                            {crypto.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <MiniChart
                          basePrice={currentPrice}
                          volatility={crypto.volatility}
                          width={60}
                          height={25}
                          key={`${crypto.id}-${chartRefreshKey}`}
                        />
                        <div className="text-right">
                          <p className={`text-sm font-bold ${colors.text}`}>{formatINR(currentPrice)}</p>
                          <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                            {isUp ? '+' : ''}{changePercent}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}

              {filteredCrypto.length === 0 && (
                <div className={`text-center py-6 rounded-xl ${
                  isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'
                }`}>
                  <p className={`text-sm ${colors.textSec}`}>No coins match this filter</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MY COINS SECTION */}
      <div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
            <Wallet className="w-4 h-4 text-white" />
          </div>
        </div>

        {ownedCrypto.length > 1 && (
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {ownedSortOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setOwnedCryptoSort(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                  ownedCryptoSort === opt.value
                    ? 'bg-blue-500 text-white shadow-sm'
                    : isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {sortedOwnedCrypto.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
            {sortedOwnedCrypto.map(item => {
              const isUp = item.pl >= 0;

              return (
                <button
                  key={item.cryptoId}
                  onClick={() => setSelectedCrypto(item.crypto)}
                  className={`w-full p-3 rounded-xl border text-left transition-all hover:scale-[1.01]
                    ${colors.cardBg} ${colors.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.crypto.logo}</span>
                      <div>
                        <p className={`text-sm font-bold ${colors.text}`}>{item.crypto.name}</p>
                        <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                          {item.quantity} {item.crypto.symbol} @ {formatINR(item.avgBuyPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${colors.text}`}>{formatINR(item.value)}</p>
                      <div className="flex items-center justify-end gap-1">
                        {isUp
                          ? <TrendingUp className="w-3 h-3 text-green-500" />
                          : <TrendingDown className="w-3 h-3 text-red-500" />
                        }
                        <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                          {isUp ? '+' : ''}{formatINR(item.pl)} ({item.plPercent.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-8 rounded-2xl border ${
            isDarkTheme ? 'bg-gray-800/30 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <Wallet className={`w-12 h-12 mx-auto mb-2 ${isDarkTheme ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm font-medium ${colors.textSec}`}>No crypto owned yet</p>
            <p className={`text-xs ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`}>
              Buy cryptocurrency from the list above
            </p>
          </div>
        )}
      </div>

      {/* CRYPTO DETAIL MODAL */}
      {selectedCrypto && (
        <CryptoDetailModal
          crypto={selectedCrypto}
          onClose={() => setSelectedCrypto(null)}
        />
      )}
    </div>
  );
}

export default CryptoTab;