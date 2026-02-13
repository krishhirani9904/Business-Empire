// src/components/investing/SharesTab.jsx
import React, { useState, useMemo } from 'react';
import { Briefcase, BarChart3, TrendingUp, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { STOCKS, formatINR, formatMarketCap } from './investingData';
import MiniChart from './MiniChart';
import StockDetailModal from './StockDetailModal';

const INITIAL_ITEMS = 5;

function SharesTab() {
  const { isDarkTheme } = useTheme();
  const { ownedStocks, getStockPrice } = useGame();
  const [expandedSection, setExpandedSection] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [selectedStock, setSelectedStock] = useState(null);
  
  // Show more states for each section
  const [showAllPortfolio, setShowAllPortfolio] = useState(false);
  const [showAllMarket, setShowAllMarket] = useState(false);
  const [showAllStable, setShowAllStable] = useState(false);
  const [showAllGrowth, setShowAllGrowth] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  // Calculate portfolio value
  const portfolioValue = useMemo(() => {
    return ownedStocks.reduce((sum, owned) => {
      const currentPrice = getStockPrice(owned.stockId);
      return sum + (currentPrice * owned.quantity);
    }, 0);
  }, [ownedStocks, getStockPrice]);

  const totalInvested = useMemo(() => {
    return ownedStocks.reduce((sum, owned) => sum + (owned.avgBuyPrice * owned.quantity), 0);
  }, [ownedStocks]);

  const totalPL = portfolioValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? ((totalPL / totalInvested) * 100).toFixed(2) : 0;

  const estimatedYield = useMemo(() => {
    return ownedStocks.reduce((sum, owned) => {
      const stock = STOCKS.find(s => s.id === owned.stockId);
      if (!stock) return sum;
      const currentPrice = getStockPrice(owned.stockId);
      const annualDividend = currentPrice * owned.quantity * (stock.dividendYield / 100);
      return sum + (annualDividend / 8760);
    }, 0);
  }, [ownedStocks, getStockPrice]);

  const sortedStocks = useMemo(() => {
    let sorted = [...STOCKS];
    switch (sortBy) {
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
  }, [sortBy, getStockPrice]);

  const stableDividendStocks = useMemo(() => {
    return STOCKS.filter(s => s.category.includes('dividend')).sort((a, b) => b.dividendYield - a.dividendYield);
  }, []);

  const growthStocks = useMemo(() => {
    return STOCKS.filter(s => s.category.includes('growth'));
  }, []);

  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'highDividend', label: 'Higher Dividend' },
    { value: 'lowDividend', label: 'Lowest Dividend' },
    { value: 'cheapFirst', label: 'Cheap First' },
    { value: 'expensiveFirst', label: 'Expensive First' },
    { value: 'highCap', label: 'Highest Cap' },
    { value: 'lowCap', label: 'Lowest Cap' }
  ];

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
        className={`w-full p-3 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] text-left ${
          isDarkTheme ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' : 'bg-white border-gray-200 hover:bg-gray-50'
        } ${owned ? (isDarkTheme ? 'ring-1 ring-green-800' : 'ring-1 ring-green-300') : ''}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-2xl flex-shrink-0">{stock.logo}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold truncate ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stock.name}</p>
                {owned && <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded-full font-medium">OWNED</span>}
              </div>
              <p className={`text-[10px] truncate ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{stock.sector}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <MiniChart basePrice={stock.price} volatility={stock.volatility} width={60} height={25} />
            <div className="text-right">
              <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(currentPrice)}</p>
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

  // Section Card Component
  const SectionCard = ({ id, icon: Icon, emoji, title, subtitle, accentColor, children }) => {
    const isExpanded = expandedSection === id;

    return (
      <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
        isDarkTheme ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <button
          onClick={() => toggleSection(id)}
          className={`w-full p-4 flex items-center justify-between text-left transition-all hover:opacity-90`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              accentColor === 'green' ? 'bg-green-500/15' :
              accentColor === 'blue' ? 'bg-blue-500/15' :
              accentColor === 'yellow' ? 'bg-yellow-500/15' :
              'bg-purple-500/15'
            }`}>
              {emoji ? <span className="text-xl">{emoji}</span> :
                <Icon className={`w-5 h-5 ${
                  accentColor === 'green' ? 'text-green-500' :
                  accentColor === 'blue' ? 'text-blue-500' :
                  accentColor === 'yellow' ? 'text-yellow-500' :
                  'text-purple-500'
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
            <div className="pt-3">
              {children}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get display items based on show all state
  const displayedPortfolioStocks = showAllPortfolio ? ownedStocks : ownedStocks.slice(0, INITIAL_ITEMS);
  const displayedMarketStocks = showAllMarket ? sortedStocks : sortedStocks.slice(0, INITIAL_ITEMS);
  const displayedStableStocks = showAllStable ? stableDividendStocks : stableDividendStocks.slice(0, INITIAL_ITEMS);
  const displayedGrowthStocks = showAllGrowth ? growthStocks : growthStocks.slice(0, INITIAL_ITEMS);

  return (
    <div className="px-2 space-y-3">

      {/* ====== CARD 1: My Portfolio ====== */}
      <SectionCard
        id="portfolio"
        icon={Briefcase}
        title="My Portfolio"
        subtitle={`${ownedStocks.length} stocks · ${formatINR(portfolioValue)}`}
        accentColor="green"
      >
        {/* Portfolio Summary */}
        <div className={`p-4 rounded-xl mb-3 ${
          isDarkTheme ? 'bg-gradient-to-br from-gray-800 to-gray-800/50' : 'bg-gradient-to-br from-green-50 to-emerald-50'
        }`}>
          <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Stock Portfolio Value</p>
          <p className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(portfolioValue)}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium ${totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPL >= 0 ? '+' : ''}{formatINR(totalPL)} ({totalPLPercent}%)
            </span>
            <span className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>All Time</span>
          </div>
          <div className={`mt-2 pt-2 border-t ${isDarkTheme ? 'border-gray-700' : 'border-green-200'}`}>
            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>Estimated Yield/Hour</p>
            <p className="text-sm font-bold text-green-500">{formatINR(estimatedYield)}/hr</p>
          </div>
        </div>

        {/* Owned Stocks List */}
        {ownedStocks.length > 0 ? (
          <>
            <div className="space-y-2">
              {displayedPortfolioStocks.map(owned => {
                const stock = STOCKS.find(s => s.id === owned.stockId);
                if (!stock) return null;
                const currentPrice = getStockPrice(owned.stockId);
                const value = currentPrice * owned.quantity;
                const pl = (currentPrice - owned.avgBuyPrice) * owned.quantity;
                const plPercent = ((pl / (owned.avgBuyPrice * owned.quantity)) * 100).toFixed(1);
                const isUp = pl >= 0;

                return (
                  <button
                    key={owned.stockId}
                    onClick={() => setSelectedStock(stock)}
                    className={`w-full p-3 rounded-xl border text-left transition-all hover:scale-[1.01] ${
                      isDarkTheme ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{stock.logo}</span>
                        <div>
                          <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{stock.name}</p>
                          <p className={`text-[10px] ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>{owned.quantity} shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>{formatINR(value)}</p>
                        <p className={`text-[10px] font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                          {isUp ? '+' : ''}{formatINR(pl)} ({plPercent}%)
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <ViewMoreButton 
              shown={displayedPortfolioStocks.length}
              total={ownedStocks.length}
              isExpanded={showAllPortfolio}
              onToggle={() => setShowAllPortfolio(!showAllPortfolio)}
            />
          </>
        ) : (
          <div className={`text-center py-6 rounded-xl ${isDarkTheme ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
            <BarChart3 className={`w-10 h-10 mx-auto mb-2 ${isDarkTheme ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`text-xs font-medium ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>No stocks owned yet</p>
            <p className={`text-[10px] ${isDarkTheme ? 'text-gray-600' : 'text-gray-400'}`}>Explore Stock Market below</p>
          </div>
        )}
      </SectionCard>

      {/* ====== CARD 2: Stock Market ====== */}
      <SectionCard
        id="market"
        icon={BarChart3}
        title="Stock Market"
        subtitle={`${STOCKS.length} stocks available`}
        accentColor="blue"
      >
        {/* Sort Options */}
        <div className="flex flex-wrap lg:flex-nowrap gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {sortOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all flex-shrink-0 lg:flex-1 lg:text-center ${
                sortBy === opt.value
                  ? 'bg-green-500 text-white'
                  : isDarkTheme ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {displayedMarketStocks.map(stock => renderStockCard(stock))}
        </div>
        
        <ViewMoreButton 
          shown={displayedMarketStocks.length}
          total={sortedStocks.length}
          isExpanded={showAllMarket}
          onToggle={() => setShowAllMarket(!showAllMarket)}
        />
      </SectionCard>

      {/* ====== CARD 3: Stable Income ====== */}
      <SectionCard
        id="stable"
        emoji="💰"
        title="Stable Income"
        subtitle={`${stableDividendStocks.length} high dividend stocks`}
        accentColor="yellow"
      >
        <div className={`p-3 rounded-xl mb-3 ${isDarkTheme ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className={`text-xs font-medium ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-700'}`}>
            💰 High Dividend Stocks — Earn passive income from dividends
          </p>
        </div>
        <div className="space-y-2">
          {displayedStableStocks.map(stock => renderStockCard(stock))}
        </div>
        
        <ViewMoreButton 
          shown={displayedStableStocks.length}
          total={stableDividendStocks.length}
          isExpanded={showAllStable}
          onToggle={() => setShowAllStable(!showAllStable)}
        />
      </SectionCard>

      {/* ====== CARD 4: Growth ====== */}
      <SectionCard
        id="growth"
        icon={Sparkles}
        title="Growth Stocks"
        subtitle={`${growthStocks.length} high potential stocks`}
        accentColor="purple"
      >
        <div className={`p-3 rounded-xl mb-3 ${isDarkTheme ? 'bg-purple-900/20 border border-purple-800' : 'bg-purple-50 border border-purple-200'}`}>
          <p className={`text-xs font-medium ${isDarkTheme ? 'text-purple-400' : 'text-purple-700'}`}>
            🚀 Growth Stocks — Higher risk, higher potential returns
          </p>
        </div>
        <div className="space-y-2">
          {displayedGrowthStocks.map(stock => renderStockCard(stock))}
        </div>
        
        <ViewMoreButton 
          shown={displayedGrowthStocks.length}
          total={growthStocks.length}
          isExpanded={showAllGrowth}
          onToggle={() => setShowAllGrowth(!showAllGrowth)}
        />
      </SectionCard>

      {/* Stock Detail Modal */}
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