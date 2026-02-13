// components/business/OwnedBusinessList.jsx
import React from 'react';
import { Briefcase, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BUSINESSES, formatCurrency } from './businessData';

function OwnedBusinessList({ ownedBusinesses, totalIncome, onSelectOwned }) {
  const { isDarkTheme } = useTheme();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800',
      innerBorder: 'border-gray-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      hoverBg: 'hover:bg-gray-750'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      innerBg: 'bg-gray-100',
      innerBorder: 'border-gray-300',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      hoverBg: 'hover:bg-gray-150'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-lg font-bold ${c.textPrimary}`}>
          Owned Businesses
        </h3>
        {ownedBusinesses.length > 0 && (
          <span className={`text-xs ${c.textSecondary} ${c.innerBg} px-2 py-1 rounded-full`}>
            {ownedBusinesses.length} owned
          </span>
        )}
      </div>
      
      {ownedBusinesses.length === 0 ? (
        <div className={`${c.innerBg} rounded-xl p-8 text-center`}>
          <AlertCircle className={`w-12 h-12 ${c.textSecondary} mx-auto mb-3 opacity-50`} />
          <p className={`${c.textSecondary} text-sm`}>
            You don't own any businesses yet.
          </p>
          <p className={`${c.textSecondary} text-xs mt-1`}>
            Click "Start Business" to begin your empire!
          </p>
        </div>
      ) : (
        <div>
          {/* Scrollable Business List - HIDDEN SCROLLBAR */}
          <div 
            className="max-h-[400px] overflow-y-auto space-y-2 pr-1"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {/* Hide webkit scrollbar */}
            <style>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {ownedBusinesses.map((owned, index) => {
              const business = BUSINESSES.find(b => b.id === owned.businessId);
              const Icon = business?.icon || Briefcase;
              const displayName = owned.customName || `${owned.sizeType} ${owned.businessName}`;
              
              return (
                <button
                  key={owned.id}
                  onClick={() => onSelectOwned && onSelectOwned(owned)}
                  className={`
                    w-full ${c.innerBg} border ${c.innerBorder} rounded-xl p-3
                    flex items-center justify-between
                    transition-all duration-200
                    hover:scale-[1.01] hover:border-blue-500/50
                    active:scale-[0.99]
                    cursor-pointer text-left
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 bg-gradient-to-r ${business?.color || 'from-gray-500 to-gray-600'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-sm font-medium ${c.textPrimary} truncate`}>
                        {displayName}
                      </h4>
                      <p className={`text-xs ${c.textSecondary}`}>
                        +{formatCurrency(owned.incomePerHour)}/hr
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <ChevronRight className={`w-4 h-4 ${c.textSecondary}`} />
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Total Summary - Always visible outside scroll */}
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