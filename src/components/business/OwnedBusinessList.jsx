// components/business/OwnedBusinessList.jsx
import React from 'react';
import { Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BUSINESSES, formatCurrency } from './businessData';

function OwnedBusinessList({ ownedBusinesses, totalIncome }) {
  const { isDarkTheme } = useTheme();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800',
      innerBorder: 'border-gray-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      innerBg: 'bg-gray-100',
      innerBorder: 'border-gray-300',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4`}>
      <h3 className={`text-lg font-bold ${c.textPrimary} mb-3`}>
        Owned Businesses
      </h3>
      
      {ownedBusinesses.length === 0 ? (
        <div className={`${c.innerBg} rounded-xl p-26 text-center`}>
          <AlertCircle className={`w-12 h-12 ${c.textSecondary} mx-auto mb-3 opacity-50`} />
          <p className={`${c.textSecondary} text-sm`}>
            You don't own any businesses yet.
          </p>
          <p className={`${c.textSecondary} text-xs mt-1`}>
            Click "Start Business" to begin your empire!
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {ownedBusinesses.map(owned => {
            const business = BUSINESSES.find(b => b.id === owned.businessId);
            const Icon = business?.icon || Briefcase;
            
            return (
              <div
                key={owned.id}
                className={`
                  ${c.innerBg} border ${c.innerBorder} rounded-xl p-3
                  flex items-center justify-between
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${business?.color || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-medium ${c.textPrimary}`}>
                      {owned.sizeType} {owned.businessName}
                    </h4>
                    <p className={`text-xs ${c.textSecondary}`}>
                      +{formatCurrency(owned.incomePerHour)}/hr
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
              </div>
            );
          })}
          
          {/* Total Summary */}
          <div className={`${isDarkTheme ? 'bg-green-500/10' : 'bg-green-50'} border border-green-500/30 rounded-xl p-3 mt-3`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${c.textSecondary}`}>
                Total Businesses: {ownedBusinesses.length}
              </span>
              <span className="text-green-500 font-bold">
                {formatCurrency(totalIncome)}/hr
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnedBusinessList;