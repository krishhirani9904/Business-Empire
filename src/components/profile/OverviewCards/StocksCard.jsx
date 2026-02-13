// src/components/profile/OverviewCards/StocksCard.jsx

import React from 'react';
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react';
import { formatMoney } from '../profileTheme';
import { STOCKS } from '../../investing/investingData';

const StocksCard = ({ stocksSummary, ownedStocks, stockPriceHistory, expanded, onToggle, c }) => (
  <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl overflow-hidden`}>
    <button
      onClick={onToggle}
      className={`w-full p-4 flex items-center justify-between ${c.hoverBg} transition-colors`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-left">
          <h3 className={`font-bold ${c.textPrimary} text-sm sm:text-base`}>Stocks</h3>
          <p className={`text-xs ${c.textSecondary}`}>{stocksSummary.count} holdings</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <span className={`font-bold ${c.textPrimary} text-sm block`}>
            {formatMoney(stocksSummary.totalValue)}
          </span>
          <span className={`text-xs font-medium ${stocksSummary.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {stocksSummary.profitLoss >= 0 ? '+' : ''}{formatMoney(stocksSummary.profitLoss)}
          </span>
        </div>
        {expanded
          ? <ChevronUp className={`w-4 h-4 ${c.textSecondary}`} />
          : <ChevronDown className={`w-4 h-4 ${c.textSecondary}`} />
        }
      </div>
    </button>

    {expanded && (
      <div className={`border-t ${c.innerBorder} p-3 space-y-2`}>
        {ownedStocks.length === 0 ? (
          <p className={`text-center text-sm ${c.textMuted} py-4`}>No stocks owned yet</p>
        ) : (
          ownedStocks.map(owned => {
            const stock = STOCKS.find(s => s.id === owned.stockId);
            const currentPrice = stockPriceHistory[owned.stockId] || owned.avgBuyPrice;
            const currentValue = currentPrice * owned.quantity;
            const investedValue = owned.avgBuyPrice * owned.quantity;
            const pl = currentValue - investedValue;
            const plPercent = investedValue > 0 ? ((pl / investedValue) * 100).toFixed(1) : 0;

            return (
              <div key={owned.stockId} className={`flex items-center justify-between p-2 ${c.innerBg} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-4 h-4 ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                  <div>
                    <p className={`text-sm font-medium ${c.textPrimary}`}>
                      {stock?.name || owned.stockId}
                    </p>
                    <p className={`text-xs ${c.textMuted}`}>
                      {owned.quantity} shares • Avg ₹{owned.avgBuyPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${c.textPrimary}`}>{formatMoney(currentValue)}</p>
                  <p className={`text-xs font-medium ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {pl >= 0 ? '+' : ''}{formatMoney(pl)} ({plPercent}%)
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    )}
  </div>
);

export default StocksCard;