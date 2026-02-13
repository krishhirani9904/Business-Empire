// src/components/profile/OverviewCards/CryptoCard.jsx

import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatMoney } from '../profileTheme';
import { CRYPTOCURRENCIES } from '../../investing/investingData';

const CryptoCard = ({ cryptoSummary, ownedCrypto, cryptoPriceHistory, expanded, onToggle, c }) => (
  <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl overflow-hidden`}>
    <button
      onClick={onToggle}
      className={`w-full p-4 flex items-center justify-between ${c.hoverBg} transition-colors`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
          <span className="text-sm">₿</span>
        </div>
        <div className="text-left">
          <h3 className={`font-bold ${c.textPrimary} text-sm sm:text-base`}>Cryptocurrency</h3>
          <p className={`text-xs ${c.textSecondary}`}>{cryptoSummary.count} coins</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <span className={`font-bold ${c.textPrimary} text-sm block`}>
            {formatMoney(cryptoSummary.totalValue)}
          </span>
          <span className={`text-xs font-medium ${cryptoSummary.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {cryptoSummary.profitLoss >= 0 ? '+' : ''}{formatMoney(cryptoSummary.profitLoss)}
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
        {ownedCrypto.length === 0 ? (
          <p className={`text-center text-sm ${c.textMuted} py-4`}>No cryptocurrency owned yet</p>
        ) : (
          ownedCrypto.map(owned => {
            const crypto = CRYPTOCURRENCIES.find(cc => cc.id === owned.cryptoId);
            const currentPrice = cryptoPriceHistory[owned.cryptoId] || owned.avgBuyPrice;
            const currentValue = currentPrice * owned.quantity;
            const investedValue = owned.avgBuyPrice * owned.quantity;
            const pl = currentValue - investedValue;
            const plPercent = investedValue > 0 ? ((pl / investedValue) * 100).toFixed(1) : 0;

            return (
              <div key={owned.cryptoId} className={`flex items-center justify-between p-2 ${c.innerBg} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{crypto?.icon || '🪙'}</span>
                  <div>
                    <p className={`text-sm font-medium ${c.textPrimary}`}>
                      {crypto?.name || owned.cryptoId}
                    </p>
                    <p className={`text-xs ${c.textMuted}`}>
                      {owned.quantity} units • Avg ₹{owned.avgBuyPrice.toLocaleString('en-IN')}
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

export default CryptoCard;