// src/components/profile/ProfileHeader.jsx

import React from 'react';
import { Wallet, Clock, MousePointerClick } from 'lucide-react';
import { formatMoney } from './profileTheme';

const ProfileHeader = ({ c, profileData }) => {
  const {
    currentBadge,
    nextBadge,
    badgeProgress,
    netWorth,
    level,
    balance,
    totalIncomePerHour,
    baseClickRate,
  } = profileData;

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4 sm:p-6 mb-4`}>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${currentBadge.color} flex items-center justify-center text-3xl sm:text-4xl shadow-lg`}
        >
          {currentBadge.icon}
        </div>

        <div className="flex-1 min-w-0">
          {/* Badge & Level */}
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${currentBadge.color} text-white`}
            >
              {currentBadge.name}
            </span>
            <span className={`text-xs ${c.textMuted}`}>Lvl {level}</span>
          </div>

          {/* Net Worth */}
          <h2 className={`text-xl sm:text-2xl font-bold ${c.textPrimary} truncate`}>
            {formatMoney(netWorth)}
          </h2>
          <p className={`text-xs sm:text-sm ${c.textSecondary}`}>Total Net Worth</p>

          {/* Badge Progress */}
          {nextBadge ? (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] sm:text-xs ${c.textMuted}`}>
                  Next: {nextBadge.name} {nextBadge.icon}
                </span>
                <span className={`text-[10px] sm:text-xs ${c.textMuted}`}>
                  {badgeProgress.toFixed(1)}%
                </span>
              </div>
              <div className={`h-1.5 ${c.innerBg} rounded-full overflow-hidden`}>
                <div
                  className={`h-full bg-gradient-to-r ${nextBadge.color} rounded-full transition-all duration-500`}
                  style={{ width: `${badgeProgress}%` }}
                />
              </div>
              <p className={`text-[10px] ${c.textMuted} mt-0.5`}>
                Need {formatMoney(nextBadge.minWealth - netWorth)} more
              </p>
            </div>
          ) : (
            <p className="text-xs text-yellow-500 font-medium mt-1">
              🏆 Maximum Badge Achieved!
            </p>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className={`grid grid-cols-3 gap-2 mt-4 pt-4 border-t ${c.innerBorder}`}>
        <QuickStat
          icon={<Wallet className={`w-3.5 h-3.5 ${c.textSecondary}`} />}
          value={formatMoney(balance)}
          label="Cash"
          valueColor={c.textPrimary}
          c={c}
        />
        <QuickStat
          icon={<Clock className="w-3.5 h-3.5 text-green-500" />}
          value={formatMoney(totalIncomePerHour)}
          label="Per Hour"
          valueColor="text-green-500"
          c={c}
        />
        <QuickStat
          icon={<MousePointerClick className="w-3.5 h-3.5 text-blue-500" />}
          value={`₹${baseClickRate}`}
          label="Per Click"
          valueColor="text-blue-500"
          c={c}
        />
      </div>
    </div>
  );
};

const QuickStat = ({ icon, value, label, valueColor, c }) => (
  <div className="text-center">
    <div className="flex items-center justify-center gap-1 mb-1">{icon}</div>
    <p className={`text-sm sm:text-base font-bold ${valueColor}`}>{value}</p>
    <p className={`text-[10px] sm:text-xs ${c.textMuted}`}>{label}</p>
  </div>
);

export default ProfileHeader;