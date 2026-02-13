// src/components/profile/OverviewCards/NetWorthBreakdown.jsx

import React from 'react';
import { Layers } from 'lucide-react';
import { formatMoney, formatMoneyFull } from '../profileTheme';

const BREAKDOWN_ITEMS = [
  { key: 'cash', label: 'Cash', color: 'bg-green-500', icon: '💵' },
  { key: 'stocks', label: 'Stocks', color: 'bg-emerald-500', icon: '📈' },
  { key: 'realEstate', label: 'Real Estate', color: 'bg-orange-500', icon: '🏠' },
  { key: 'crypto', label: 'Crypto', color: 'bg-yellow-500', icon: '₿' },
];

const NetWorthBreakdown = ({ balance, stocksValue, realEstateValue, cryptoValue, netWorth, c }) => {
  const values = {
    cash: balance,
    stocks: stocksValue,
    realEstate: realEstateValue,
    crypto: cryptoValue,
  };

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl p-4`}>
      <h3 className={`font-bold ${c.textPrimary} mb-3 flex items-center gap-2`}>
        <Layers className="w-4 h-4 text-purple-500" />
        Net Worth Breakdown
      </h3>

      <div className="space-y-2">
        {BREAKDOWN_ITEMS.map(item => {
          const value = values[item.key];
          const percentage = netWorth > 0 ? (value / netWorth) * 100 : 0;
          return (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs sm:text-sm ${c.textSecondary} flex items-center gap-1`}>
                  <span>{item.icon}</span> {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs sm:text-sm font-medium ${c.textPrimary}`}>
                    {formatMoney(value)}
                  </span>
                  <span className={`text-[10px] sm:text-xs ${c.textMuted}`}>
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className={`h-1.5 ${c.innerBg} rounded-full overflow-hidden`}>
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className={`flex items-center justify-between pt-2 mt-2 border-t ${c.innerBorder}`}>
          <span className={`text-sm font-bold ${c.textPrimary}`}>Total Net Worth</span>
          <span className={`text-sm sm:text-base font-bold ${c.textPrimary}`}>
            {formatMoneyFull(netWorth)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NetWorthBreakdown;