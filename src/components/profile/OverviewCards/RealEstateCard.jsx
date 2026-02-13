// src/components/profile/OverviewCards/RealEstateCard.jsx

import React from 'react';
import { Home, ChevronDown, ChevronUp } from 'lucide-react';
import { formatMoney } from '../profileTheme';

const RealEstateCard = ({ propertiesSummary, ownedProperties, expanded, onToggle, c }) => (
  <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl overflow-hidden`}>
    <button
      onClick={onToggle}
      className={`w-full p-4 flex items-center justify-between ${c.hoverBg} transition-colors`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
          <Home className="w-4 h-4 text-orange-500" />
        </div>
        <div className="text-left">
          <h3 className={`font-bold ${c.textPrimary} text-sm sm:text-base`}>Real Estate</h3>
          <p className={`text-xs ${c.textSecondary}`}>{propertiesSummary.count} properties</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-right">
          <span className={`font-bold ${c.textPrimary} text-sm block`}>
            {formatMoney(propertiesSummary.totalValue)}
          </span>
          <span className="text-xs font-medium text-green-500">
            +{formatMoney(propertiesSummary.rentalIncome)}/hr
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
        {ownedProperties.length === 0 ? (
          <p className={`text-center text-sm ${c.textMuted} py-4`}>No properties owned yet</p>
        ) : (
          ownedProperties.map(prop => {
            let rental = prop.rentalIncomePerHour || 0;
            if (prop.improvements) {
              prop.improvements.forEach(imp => { rental += imp.bonusIncome || 0; });
            }
            return (
              <div key={prop.ownId} className={`flex items-center justify-between p-2 ${c.innerBg} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className={`text-sm font-medium ${c.textPrimary}`}>{prop.name}</p>
                    <p className={`text-xs ${c.textMuted}`}>
                      {prop.location} • {prop.improvements?.length || 0} improvements
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${c.textPrimary}`}>{formatMoney(prop.price)}</p>
                  <p className="text-xs text-green-500">+{formatMoney(rental)}/hr</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    )}
  </div>
);

export default RealEstateCard;