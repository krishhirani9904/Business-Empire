// src/components/profile/OverviewCards/CashCard.jsx

import React from 'react';
import { IndianRupee } from 'lucide-react';
import { formatMoneyFull } from '../profileTheme';

const CashCard = ({ balance, c }) => (
  <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl overflow-hidden`}>
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
          <IndianRupee className="w-4 h-4 text-green-500" />
        </div>
        <div>
          <h3 className={`font-bold ${c.textPrimary} text-sm sm:text-base`}>Cash Balance</h3>
          <p className={`text-xs ${c.textSecondary}`}>Available funds</p>
        </div>
        <div className="ml-auto text-right">
          <p className={`font-bold ${c.textPrimary} text-sm sm:text-base`}>
            {formatMoneyFull(balance)}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default CashCard;