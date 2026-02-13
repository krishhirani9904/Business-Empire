// src/components/profile/OverviewCards/BusinessCard.jsx

import React from 'react';
import { Building2, Factory, ChevronDown, ChevronUp } from 'lucide-react';
import { formatMoney } from '../profileTheme';

const BusinessCard = ({ businessSummary, ownedBusinesses, expanded, onToggle, c }) => (
  <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl overflow-hidden`}>
    <button
      onClick={onToggle}
      className={`w-full p-4 flex items-center justify-between ${c.hoverBg} transition-colors`}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Building2 className="w-4 h-4 text-blue-500" />
        </div>
        <div className="text-left">
          <h3 className={`font-bold ${c.textPrimary} text-sm sm:text-base`}>Businesses</h3>
          <p className={`text-xs ${c.textSecondary}`}>
            {businessSummary.count} owned • {businessSummary.mergers} mergers
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-blue-500 text-sm">
          {formatMoney(businessSummary.totalIncome)}/hr
        </span>
        {expanded
          ? <ChevronUp className={`w-4 h-4 ${c.textSecondary}`} />
          : <ChevronDown className={`w-4 h-4 ${c.textSecondary}`} />
        }
      </div>
    </button>

    {expanded && (
      <div className={`border-t ${c.innerBorder} p-3 space-y-2`}>
        {ownedBusinesses.length === 0 ? (
          <p className={`text-center text-sm ${c.textMuted} py-4`}>No businesses owned yet</p>
        ) : (
          [...new Set(ownedBusinesses.map(b => b.businessName))].map(name => {
            const items = ownedBusinesses.filter(b => b.businessName === name);
            const totalIncome = items.reduce((sum, b) => sum + b.incomePerHour, 0);
            return (
              <div key={name} className={`flex items-center justify-between p-2 ${c.innerBg} rounded-lg`}>
                <div className="flex items-center gap-2">
                  <Factory className={`w-4 h-4 ${c.textSecondary}`} />
                  <div>
                    <p className={`text-sm font-medium ${c.textPrimary}`}>{name}</p>
                    <p className={`text-xs ${c.textMuted}`}>
                      {items.length}x • {items.map(b => b.sizeType).join(', ')}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium text-green-500">
                  {formatMoney(totalIncome)}/hr
                </span>
              </div>
            );
          })
        )}
      </div>
    )}
  </div>
);

export default BusinessCard;