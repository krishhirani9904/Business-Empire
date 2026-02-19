// ============================================
// 📄 FILE: src/components/investing/SharesTab.jsx
// 🎯 PURPOSE: Shares portfolio and market
// 🔧 FIX Bug #7: MiniChart uses currentPrice and refresh key
// ============================================

import React, { useState, useMemo } from 'react';
import {
  Briefcase, BarChart3, TrendingUp, Sparkles,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { STOCKS, formatINR, formatMarketCap } from './investingData';
import MiniChart from './MiniChart';
import StockDetailModal from './StockDetailModal';

function SharesTab() {
  const { isDarkTheme } = useTheme();
  const { ownedStocks, getStockPrice } = useGame();

  const [expandedCard, setExpandedCard] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [marketSort, setMarketSort] = useState('default');
  const [portfolioSort, setPortfolioSort] = useState('value');
  const [stableSort, setStableSort] = useState('highDividend');
  const [growthSort, setGrowthSort] = useState('default');

  // 🔧 FIX Bug #7: Refresh key for charts — updates every 30 seconds
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  // Update charts every 30 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setChartRefreshKey(prev => prev + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleCard = (cardId) => {
    setExpandedCard(prev => prev === cardId ? null : cardId);
  };

  // Calculations
  const portfolioValue = useMemo(() => {
    return ownedStocks.reduce((sum, owned) => {
      const currentPrice = getStockPrice(owned.stockId);
      return sum + (currentPrice * owned.quantity);
    }, 0);
  }, [ownedStocks, getStockPrice]);

  const totalInvested = useMemo(() => {
    return ownedStocks.reduce(
      (sum, owned) => sum + (owned.avgBuyPrice * owned.quantity),
      0
    );
  }, [ownedStocks]);

  const totalPL = portfolioValue - totalInvested;
  const totalPLPercent = totalInvested > 0
    ? ((totalPL / totalInvested) * 100).toFixed(2)
    : 0;

  const estimatedYield = useMemo(() => {
    return ownedStocks.reduce((sum, owned) => {
      const stock = STOCKS.find(s => s.id === owned.stockId);
      if (!stock) return sum;
      const currentPrice = getStockPrice(owned.stockId);
      const annualDividend = currentPrice * owned.quantity * (stock.dividendYield / 100);
      return sum + (annualDividend / 8760);
    }, 0);
  }, [ownedStocks, getStockPrice]);

  // Sorted lists
  const sortedMarketStocks = useMemo(() => {
    let sorted = [...STOCKS];
    switch (marketSort) {
      case 'highDividend':
        sorted.sort((a, b) => b.dividendYield - a.dividendYield);
        break;
      case 'lowDividend':
        sorted.sort((a, b) => a.dividendYield - b.dividendYield);
        break;
      case 'cheapFirst':
        sorted.sort((a, b) => (getStockPrice(a.id) || a.price) - (getStockPrice(b.id) || b.price));
        break;
      case 'expensiveFirst':
        sorted.sort((a, b) => (getStockPrice(b.id) || b.price) - (getStockPrice(a.id) || a.price));
        break;
      case 'highCap':
        sorted.sort((a, b) => b.capitalization - a.capitalization);
        break;
      case 'lowCap':
        sorted.sort((a, b) => a.capitalization - b.capitalization);
        break;
      default:
        break;
    }
    return sorted;
  }, [marketSort, getStockPrice]);

  const sortedPortfolio = useMemo(() => {
    if (ownedStocks.length === 0) return [];

    let sorted = ownedStocks.map(owned => {
      const stock = STOCKS.find(s => s.id === owned.stockId);
      const currentPrice = getStockPrice(owned.stockId);
      const value = currentPrice * owned.quantity;
      const pl = (currentPrice - owned.avgBuyPrice) * owned.quantity;
      const plPercent = owned.avgBuyPrice > 0
        ? ((pl / (owned.avgBuyPrice * owned.quantity)) * 100)
        : 0;
      return { ...owned, stock, currentPrice, value, pl, plPercent };
    }).filter(item => item.stock);

    switch (portfolioSort) {
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
  }, [ownedStocks, getStockPrice, portfolioSort]);

  const sortedStableStocks = useMemo(() => {
    let list = STOCKS.filter(s => s.category.includes('dividend'));
    switch (stableSort) {
      case 'highDividend':
        list.sort((a, b) => b.dividendYield - a.dividendYield);
        break;
      case 'lowDividend':
        list.sort((a, b) => a.dividendYield - b.dividendYield);
        break;
      case 'cheapFirst':
        list.sort((a, b) => (getStockPrice(a.id) || a.price) - (getStockPrice(b.id) || b.price));
        break;
      case 'expensiveFirst':
        list.sort((a, b) => (getStockPrice(b.id) || b.price) - (getStockPrice(a.id) || a.price));
        break;
      default:
        break;
    }
    return list;
  }, [stableSort, getStockPrice]);

  const sortedGrowthStocks = useMemo(() => {
    let list = STOCKS.filter(s => s.category.includes('growth'));
    switch (growthSort) {
      case 'cheapFirst':
        list.sort((a, b) => (getStockPrice(a.id) || a.price) - (getStockPrice(b.id) || b.price));
        break;
      case 'expensiveFirst':
        list.sort((a, b) => (getStockPrice(b.id) || b.price) - (getStockPrice(a.id) || a.price));
        break;
      case 'highVolatility':
        list.sort((a, b) => b.volatility - a.volatility);
        break;
      case 'lowVolatility':
        list.sort((a, b) => a.volatility - b.volatility);
        break;
      case 'highCap':
        list.sort((a, b) => b.capitalization - a.capitalization);
        break;
      case 'lowCap':
        list.sort((a, b) => a.capitalization - b.capitalization);
        break;
      default:
        break;
    }
    return list;
  }, [growthSort, getStockPrice]);

  // Theme colors
  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-800/50', border: 'border-gray-700',
        text: 'text-white', textSec: 'text-gray-400',
        inner: 'bg-gray-800', hover: 'hover:bg-gray-750'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200',
        text: 'text-gray-900', textSec: 'text-gray-500',
        inner: 'bg-gray-50', hover: 'hover:bg-gray-100'
      };

  // Sort chips renderer
  const renderSortChips = (options, currentSort, setSortFn, accentColor = 'green') => {
    const colorMap = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500'
    };

    return (
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-hide">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => setSortFn(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
              currentSort === opt.value
                ? `${colorMap[accentColor]} text-white shadow-sm`
                : isDarkTheme ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  };

  // 🔧 FIX Bug #7: Stock card with refreshing chart
  const renderStockCard = (stock) => {
    const currentPrice = getStockPrice(stock.id) || stock.price;
    const change = currentPrice - stock.price;
    const changePercent = ((change / stock.price) * 100).toFixed(1);
    const isUp = change >= 0;
    const owned = ownedStocks.find(s => s.stockId === stock.id);

    return (
      <button
        key={stock.id}
        onClick={() => setSelectedStock(stock)}
        className={`w-full p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] text-left
          ${c.cardBg} ${c.border}
          ${owned ? (isDarkTheme ? 'ring-1 ring-green-800' : 'ring-1 ring-green-300') : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{stock.logo}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold truncate ${c.text}`}>{stock.name}</p>
                {owned && (
                  <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full font-medium">
                    OWNED
                  </span>
                )}
              </div>
              <p className={`text-[10px] truncate ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                {stock.sector}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* 🔧 FIX Bug #7: MiniChart with currentPrice and refresh key */}
            <MiniChart 
              basePrice={currentPrice} 
              volatility={stock.volatility} 
              width={60} 
              height={25}
              key={`${stock.id}-${chartRefreshKey}`}
            />
            <div className="text-right">
              <p className={`text-sm font-bold ${c.text}`}>{formatINR(currentPrice)}</p>
              <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? '+' : ''}{changePercent}%
              </p>
            </div>
          </div>
        </div>

        {stock.dividendYield > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              isDarkTheme ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
            }`}>
              Dividend: {stock.dividendYield}%
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              isDarkTheme ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
            }`}>
              Cap: {formatMarketCap(stock.capitalization)}
            </span>
          </div>
        )}
      </button>
    );
  };

  // Expandable card component
  const ExpandableCard = ({ id, icon: Icon, title, subtitle, color, badge, children }) => {
    const isExpanded = expandedCard === id;

    return (
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${c.cardBg} ${c.border}`}>
        <button
          onClick={() => toggleCard(id)}
          className={`w-full p-4 flex items-center justify-between text-left transition-all ${c.hover}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-sm font-bold ${c.text}`}>{title}</h3>
                {badge && (
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                    isDarkTheme ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                  }`}>
                    {badge}
                  </span>
                )}
              </div>
              <p className={`text-[11px] ${c.textSec}`}>{subtitle}</p>
            </div>
          </div>

          <div className={`p-1.5 rounded-full transition-all ${
            isExpanded ? (isDarkTheme ? 'bg-gray-700' : 'bg-gray-200') : ''
          }`}>
            {isExpanded
              ? <ChevronUp className={`w-5 h-5 ${c.textSec}`} />
              : <ChevronDown className={`w-5 h-5 ${c.textSec}`} />
            }
          </div>
        </button>

        {isExpanded && (
          <div className={`px-4 pb-4 pt-1 border-t ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`}>
            {children}
          </div>
        )}
      </div>
    );
  };

  // Sort options
  const marketSortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'highDividend', label: 'High Dividend' },
    { value: 'lowDividend', label: 'Low Dividend' },
    { value: 'cheapFirst', label: 'Cheap First' },
    { value: 'expensiveFirst', label: 'Expensive First' },
    { value: 'highCap', label: 'Highest Cap' },
    { value: 'lowCap', label: 'Lowest Cap' }
  ];

  const portfolioSortOptions = [
    { value: 'value', label: 'By Value' },
    { value: 'profitFirst', label: 'Profit First' },
    { value: 'lossFirst', label: 'Loss First' },
    { value: 'quantityHigh', label: 'Most Shares' },
    { value: 'quantityLow', label: 'Least Shares' }
  ];

  const stableSortOptions = [
    { value: 'highDividend', label: 'High Dividend' },
    { value: 'lowDividend', label: 'Low Dividend' },
    { value: 'cheapFirst', label: 'Cheap First' },
    { value: 'expensiveFirst', label: 'Expensive First' }
  ];

  const growthSortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'cheapFirst', label: 'Cheap First' },
    { value: 'expensiveFirst', label: 'Expensive First' },
    { value: 'highVolatility', label: 'High Risk' },
    { value: 'lowVolatility', label: 'Low Risk' },
    { value: 'highCap', label: 'Highest Cap' },
    { value: 'lowCap', label: 'Lowest Cap' }
  ];

  return (
    <div className="px-2 space-y-3">

      {/* CARD 1: STOCK PORTFOLIO */}
      <ExpandableCard
        id="portfolio"
        icon={Briefcase}
        title="Stock Portfolio"
        subtitle={portfolioValue > 0
          ? `Value: ${formatINR(portfolioValue)}`
          : "Click to see your holdings"
        }
        color="bg-gradient-to-br from-green-500 to-emerald-600"
        badge={ownedStocks.length > 0 ? `${ownedStocks.length} stocks` : null}
      >
        {ownedStocks.length > 0 && (
          <div className={`p-3 rounded-xl mb-3 ${
            isDarkTheme
              ? 'bg-gradient-to-br from-gray-700/50 to-gray-800/50'
              : 'bg-gradient-to-br from-green-50 to-emerald-50'
          }`}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className={`text-[10px] ${c.textSec}`}>Value</p>
                <p className={`text-sm font-bold ${c.text}`}>{formatINR(portfolioValue)}</p>
              </div>
              <div>
                <p className={`text-[10px] ${c.textSec}`}>P&L</p>
                <p className={`text-sm font-bold ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalPL >= 0 ? '+' : ''}{formatINR(totalPL)} ({totalPLPercent}%)
                </p>
              </div>
              <div>
                <p className={`text-[10px] ${c.textSec}`}>Yield/Hr</p>
                <p className="text-sm font-bold text-green-500">{formatINR(estimatedYield)}</p>
              </div>
            </div>
          </div>
        )}

        {ownedStocks.length > 1 && renderSortChips(portfolioSortOptions, portfolioSort, setPortfolioSort, 'green')}

        {sortedPortfolio.length > 0 ? (
          <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide pr-1">
            {sortedPortfolio.map(item => {
              const isUp = item.pl >= 0;

              return (
                <button
                  key={item.stockId}
                  onClick={() => setSelectedStock(item.stock)}
                  className={`w-full p-3 rounded-xl border text-left transition-all hover:scale-[1.01]
                    ${c.cardBg} ${c.border}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.stock.logo}</span>
                      <div>
                        <p className={`text-sm font-bold ${c.text}`}>{item.stock.name}</p>
                        <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                          {item.quantity} shares @ {formatINR(item.avgBuyPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${c.text}`}>{formatINR(item.value)}</p>
                      <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                        {isUp ? '+' : ''}{formatINR(item.pl)} ({item.plPercent.toFixed(1)}%)
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className={`text-center py-6 rounded-xl ${
            isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'
          }`}>
            <BarChart3 className={`w-10 h-10 mx-auto mb-2 ${isDarkTheme ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-sm font-medium ${c.textSec}`}>No stocks owned yet</p>
            <p className={`text-[11px] mt-1 ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`}>
              Go to Stock Market to buy shares
            </p>
          </div>
        )}
      </ExpandableCard>

      {/* CARD 2: STOCK MARKET */}
      <ExpandableCard
        id="market"
        icon={BarChart3}
        title="Stock Market"
        subtitle="Browse & buy all available stocks"
        color="bg-gradient-to-br from-blue-500 to-indigo-600"
        badge={`${STOCKS.length} stocks`}
      >
        {renderSortChips(marketSortOptions, marketSort, setMarketSort, 'blue')}
        
        <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide pr-1">
          {sortedMarketStocks.map(stock => renderStockCard(stock))}
        </div>
      </ExpandableCard>

      {/* CARD 3: STABLE INCOME */}
      <ExpandableCard
        id="stable"
        icon={TrendingUp}
        title="Stable Income"
        subtitle="High dividend stocks for passive income"
        color="bg-gradient-to-br from-yellow-500 to-orange-500"
        badge={`${sortedStableStocks.length} stocks`}
      >
        <div className={`p-2.5 rounded-xl mb-3 ${
          isDarkTheme ? 'bg-yellow-900/20 border border-yellow-800/50' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className={`text-[11px] font-medium ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-700'}`}>
            💰 These stocks pay regular dividends — earn passive income!
          </p>
        </div>

        {renderSortChips(stableSortOptions, stableSort, setStableSort, 'yellow')}

        <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
          {sortedStableStocks.map(stock => renderStockCard(stock))}
        </div>
      </ExpandableCard>

      {/* CARD 4: GROWTH STOCKS */}
      <ExpandableCard
        id="growth"
        icon={Sparkles}
        title="Growth Stocks"
        subtitle="Higher risk, higher potential returns"
        color="bg-gradient-to-br from-purple-500 to-pink-500"
        badge={`${sortedGrowthStocks.length} stocks`}
      >
        <div className={`p-2.5 rounded-xl mb-3 ${
          isDarkTheme ? 'bg-purple-900/20 border border-purple-800/50' : 'bg-purple-50 border border-purple-200'
        }`}>
          <p className={`text-[11px] font-medium ${isDarkTheme ? 'text-purple-400' : 'text-purple-700'}`}>
            🚀 Growth stocks — volatile but high growth potential!
          </p>
        </div>

        {renderSortChips(growthSortOptions, growthSort, setGrowthSort, 'purple')}

        <div className="space-y-2 max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
          {sortedGrowthStocks.map(stock => renderStockCard(stock))}
        </div>
      </ExpandableCard>

      {/* STOCK DETAIL MODAL */}
      {selectedStock && (
        <StockDetailModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
}

export default SharesTab;