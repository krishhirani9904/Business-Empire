// src/components/profile/StatisticsSection.jsx

import React from 'react';
import {
  BarChart3, MousePointerClick, Star, Zap, TrendingUp, Clock,
  Building2, Layers, Globe, IndianRupee, Home, Award, Check,
  DollarSign
} from 'lucide-react';
import { formatMoney } from './profileTheme';
import { WEALTH_MILESTONES } from './profileData';

const StatisticsSection = ({ c, profileData, isDarkTheme }) => {
  const {
    totalClicks,
    level,
    baseClickRate,
    upgradeCost,
    isBoostActive,
    totalIncomePerHour,
    businessSummary,
    stocksSummary,
    propertiesSummary,
    cryptoSummary,
    netWorth,
  } = profileData;

  return (
    <div className="space-y-3">
      {/* General Stats */}
      <StatsGroup
        title="General Statistics"
        icon={<BarChart3 className="w-5 h-5 text-blue-500" />}
        c={c}
        stats={[
          { label: 'Total Clicks', value: totalClicks.toLocaleString('en-IN'), icon: MousePointerClick, color: 'text-blue-500' },
          { label: 'Player Level', value: level, icon: Star, color: 'text-yellow-500' },
          { label: 'Click Rate', value: `₹${baseClickRate}/click`, icon: Zap, color: 'text-orange-500' },
          { label: 'Upgrade Cost', value: formatMoney(upgradeCost), icon: TrendingUp, color: 'text-purple-500' },
          { label: 'Boost Active', value: isBoostActive ? 'Yes (2x)' : 'No', icon: Zap, color: isBoostActive ? 'text-green-500' : 'text-red-500' },
          { label: 'Income/Hour', value: formatMoney(totalIncomePerHour), icon: Clock, color: 'text-green-500' },
        ]}
      />

      {/* Business Stats */}
      <StatsGroup
        title="Business Statistics"
        icon={<Building2 className="w-5 h-5 text-blue-500" />}
        c={c}
        stats={[
          { label: 'Total Businesses', value: businessSummary.count, icon: Building2, color: 'text-blue-500' },
          { label: 'Business Types', value: businessSummary.uniqueTypes, icon: Layers, color: 'text-indigo-500' },
          { label: 'Active Mergers', value: businessSummary.mergers, icon: Globe, color: 'text-teal-500' },
          { label: 'Business Income', value: `${formatMoney(businessSummary.totalIncome)}/hr`, icon: IndianRupee, color: 'text-green-500' },
        ]}
      />

      {/* Investment Stats */}
      <StatsGroup
        title="Investment Statistics"
        icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        c={c}
        stats={[
          { label: 'Stock Holdings', value: stocksSummary.count, icon: TrendingUp, color: 'text-emerald-500' },
          { label: 'Stock Value', value: formatMoney(stocksSummary.totalValue), icon: DollarSign, color: 'text-green-500' },
          { label: 'Stock P&L', value: `${stocksSummary.profitLoss >= 0 ? '+' : ''}${formatMoney(stocksSummary.profitLoss)}`, icon: BarChart3, color: stocksSummary.profitLoss >= 0 ? 'text-green-500' : 'text-red-500' },
          { label: 'Properties', value: propertiesSummary.count, icon: Home, color: 'text-orange-500' },
          { label: 'Property Value', value: formatMoney(propertiesSummary.totalValue), icon: Home, color: 'text-orange-500' },
          { label: 'Rental Income', value: `${formatMoney(propertiesSummary.rentalIncome)}/hr`, icon: IndianRupee, color: 'text-green-500' },
          { label: 'Crypto Holdings', value: cryptoSummary.count, icon: DollarSign, color: 'text-yellow-500' },
          { label: 'Crypto Value', value: formatMoney(cryptoSummary.totalValue), icon: DollarSign, color: 'text-yellow-500' },
        ]}
      />

      {/* Wealth Milestones */}
      <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl p-4`}>
        <h3 className={`font-bold ${c.textPrimary} mb-3 flex items-center gap-2`}>
          <Award className="w-5 h-5 text-yellow-500" />
          Wealth Milestones
        </h3>
        <div className="space-y-2">
          {WEALTH_MILESTONES.map(milestone => {
            const achieved = netWorth >= milestone.target;
            const progress = Math.min(100, (netWorth / milestone.target) * 100);
            return (
              <div key={milestone.label} className={`flex items-center gap-3 p-2 ${c.innerBg} rounded-lg`}>
                <span className="text-lg">{milestone.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs sm:text-sm font-medium ${achieved ? 'text-green-500' : c.textPrimary}`}>
                      {milestone.label}
                    </span>
                    {achieved ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <span className={`text-[10px] sm:text-xs ${c.textMuted}`}>
                        {progress.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className={`h-1 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${achieved ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const StatsGroup = ({ title, icon, stats, c }) => (
  <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl p-4`}>
    <h3 className={`font-bold ${c.textPrimary} mb-3 flex items-center gap-2`}>
      {icon}
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className={`${c.innerBg} rounded-lg p-3`}>
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
              <span className={`text-xs ${c.textMuted}`}>{stat.label}</span>
            </div>
            <p className={`text-sm font-bold ${c.textPrimary}`}>{stat.value}</p>
          </div>
        );
      })}
    </div>
  </div>
);

export default StatisticsSection;