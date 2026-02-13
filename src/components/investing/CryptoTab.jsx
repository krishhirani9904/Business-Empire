// src/components/investing/CryptoTab.jsx
import React, { useState, useMemo } from 'react';
import { Wallet, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { CRYPTOCURRENCIES, formatINR, formatMarketCap } from './investingData';
import MiniChart from './MiniChart';
import CryptoDetailModal from './CryptoDetailModal';

const INITIAL_ITEMS = 5;

function CryptoTab() {
  const { isDarkTheme } = useTheme();
  const { ownedCrypto, getCryptoPrice } = useGame();
  const [filter, setFilter] = useState('hot');
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  
  // Show more states
  const [showAllCoins, setShowAllCoins] = useState(false);
  const [showAllMarket, setShowAllMarket] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  // Total crypto portfolio value
  const totalCryptoValue = useMemo(() => {
    return ownedCrypto.reduce((sum, owned) => {
      const currentPrice = getCryptoPrice(owned.cryptoId);
      return sum + (currentPrice * owned.quantity);
    }, 0);
  }, [ownedCrypto, getCryptoPrice]);

  const totalCryptoInvested = useMemo(() => {
    return ownedCrypto.reduce((sum, owned) => sum + (owned.avgBuyPrice * owned.quantity), 0);
  }, [ownedCrypto]);

  const cryptoPL = totalCryptoValue - totalCryptoInvested;
  const cryptoPLPercent = totalCryptoInvested > 0 ? ((cryptoPL / totalCryptoInvested) * 100).toFixed(2) : 0;

  const filters = [
    { id: 'hot', label: 'Hot', icon: '🔥' },
    { id: 'gainer', label: 'Gainers', icon: '📈' },
    { id: 'loser', label: 'Losers', icon: '📉' },
    { id: 'highCap', label: 'Highest Cap', icon: '💎' },
    { id: 'lowCap', label: 'Lowest Cap', icon: '🪙' },
    { id: 'highPrice', label: 'High Price', icon: '💰' },
    { id: 'lowPrice', label: 'Low Price', icon: '🏷️' }
  ];

  const filteredCrypto = useMemo(() => {
    let list = [...CRYPTOCURRENCIES];
    switch (filter) {
      case 'hot':
        list = list.filter(c => c.category === 'hot');
        break;
      case 'gainer':
        list = list.filter(c => c.category === 'gainer').sort((a, b) => b.change24h - a.change24h);
        break;
      case 'loser':
        list = list.filter(c => c.category === 'loser').sort((a, b) => a.change24h - b.change24h);
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
  }, [filter, getCryptoPrice]);

  const renderCryptoCard = (crypto) => {
    const currentPrice = getCryptoPrice(crypto.id) || crypto.price;
    const change = currentPrice - crypto.price;
    const changePercent = ((change / crypto.price) * 100).toFixed(1);
    const isUp = change >= 0;
    const owned = ownedCrypto.find(c => c.cryptoId === crypto.id);

    return (
      <button
        key={crypto.id}
        onClick={() => setSelectedCrypto(crypto)}
        className={`w-full p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] text-left ${
          isDarkTheme ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'
        } ${owned ? (isDarkTheme ? 'ring-1 ring-blue-800' : 'ring-1 ring-blue-300') : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{crypto.logo}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold truncate ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{crypto.name}</p>
                {owned && <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded-full font-medium">OWNED</span>}
              </div>
              <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{crypto.symbol}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <MiniChart basePrice={crypto.price} volatility={crypto.volatility} width={60} height={25} />
            <div className="text-right">
              <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(currentPrice)}</p>
              <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? '+' : ''}{changePercent}%
              </p>
            </div>
          </div>
        </div>
      </button>
    );
  };

  // View More Button Component
  const ViewMoreButton = ({ shown, total, isExpanded, onToggle }) => {
    if (total <= INITIAL_ITEMS) return null;
    
    return (
      <button
        onClick={onToggle}
        className={`w-full py-2.5 mt-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
          isDarkTheme 
            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
        }`}
      >
        <Eye className="w-4 h-4" />
        {isExpanded ? `Show Less` : `View All ${total} Items`}
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
    );
  };

  // Section Card
  const SectionCard = ({ id, icon: Icon, emoji, title, subtitle, accentColor, children }) => {
    const isExpanded = expandedSection === id;

    return (
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDarkTheme ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-4 flex items-center justify-between text-left transition-all hover:opacity-90"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              accentColor === 'blue' ? 'bg-blue-500/15' : 'bg-purple-500/15'
            }`}>
              {emoji ? <span className="text-xl">{emoji}</span> :
                <Icon className={`w-5 h-5 ${
                  accentColor === 'blue' ? 'text-blue-500' : 'text-purple-500'
                }`} />
              }
            </div>
            <div>
              <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{title}</p>
              <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{subtitle}</p>
            </div>
          </div>
          <div className={`p-1.5 rounded-full transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          } ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            <ChevronDown className="w-5 h-5" />
          </div>
        </button>

        {isExpanded && (
          <div className={`px-4 pb-4 border-t ${isDarkTheme ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="pt-3">{children}</div>
          </div>
        )}
      </div>
    );
  };

  // Get displayed items
  const displayedOwnedCoins = showAllCoins ? ownedCrypto : ownedCrypto.slice(0, INITIAL_ITEMS);
  const displayedMarketCrypto = showAllMarket ? filteredCrypto : filteredCrypto.slice(0, INITIAL_ITEMS);

  return (
    <div className="px-2 space-y-3">
      {/* Portfolio Summary */}
      <div className={`p-4 rounded-2xl border ${isDarkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-5 h-5 text-blue-500" />
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Total Cryptocurrency Value</p>
        </div>
        <p className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(totalCryptoValue)}</p>
        <p className={`text-sm font-medium mt-0.5 ${cryptoPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {cryptoPL >= 0 ? '+' : ''}{formatINR(cryptoPL)} ({cryptoPLPercent}%)
        </p>
      </div>

      {/* ====== My Coins Section ====== */}
      <SectionCard
        id="mycoins"
        emoji="🪙"
        title="My Coins"
        subtitle={`${ownedCrypto.length} coins · ${formatINR(totalCryptoValue)}`}
        accentColor="blue"
      >
        {ownedCrypto.length > 0 ? (
          <>
            <div className="space-y-2">
              {displayedOwnedCoins.map(owned => {
                const crypto = CRYPTOCURRENCIES.find(c => c.id === owned.cryptoId);
                if (!crypto) return null;
                const currentPrice = getCryptoPrice(owned.cryptoId) || crypto.price;
                const value = currentPrice * owned.quantity;
                const pl = (currentPrice - owned.avgBuyPrice) * owned.quantity;
                const isUp = pl >= 0;

                return (
                  <button
                    key={owned.cryptoId}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`w-full p-3 rounded-xl border text-left transition-all hover:scale-[1.01] ${
                      isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{crypto.logo}</span>
                        <div>
                          <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{crypto.symbol}</p>
                          <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{owned.quantity} units</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(value)}</p>
                        <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                          {isUp ? '+' : ''}{formatINR(pl)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <ViewMoreButton 
              shown={displayedOwnedCoins.length}
              total={ownedCrypto.length}
              isExpanded={showAllCoins}
              onToggle={() => setShowAllCoins(!showAllCoins)}
            />
          </>
        ) : (
          <div className={`text-center py-6 rounded-xl ${isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
            <p className="text-3xl mb-2">🪙</p>
            <p className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No coins owned yet</p>
            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`}>Explore Crypto Market below</p>
          </div>
        )}
      </SectionCard>

      {/* ====== Crypto Market Section ====== */}
      <SectionCard
        id="cryptomarket"
        emoji="📊"
        title="Crypto Market"
        subtitle={`${CRYPTOCURRENCIES.length} cryptocurrencies`}
        accentColor="purple"
      >
        {/* Filter Tabs */}
        <div className="flex flex-wrap lg:flex-nowrap gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => {
                setFilter(f.id);
                setShowAllMarket(false); // Reset when filter changes
              }}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-medium whitespace-nowrap transition-all flex-shrink-0 lg:flex-1 lg:justify-center ${
                filter === f.id
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : isDarkTheme ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* Crypto List */}
        <div className="space-y-2">
          {displayedMarketCrypto.map(crypto => renderCryptoCard(crypto))}
        </div>
        
        <ViewMoreButton 
          shown={displayedMarketCrypto.length}
          total={filteredCrypto.length}
          isExpanded={showAllMarket}
          onToggle={() => setShowAllMarket(!showAllMarket)}
        />
      </SectionCard>

      {/* Detail Modal */}
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