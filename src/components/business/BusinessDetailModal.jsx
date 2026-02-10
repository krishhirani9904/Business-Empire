// components/business/BusinessDetailModal.jsx
import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from './businessData';

function BusinessDetailModal({ 
  business, 
  balance, 
  ownedCount, 
  onBuy, 
  onClose 
}) {
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

  if (!business) return null;

  const Icon = business.icon;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className={`${c.cardBg} rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto`}>
        {/* Header */}
        <div className={`sticky top-0 ${c.cardBg} border-b ${c.cardBorder} p-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${business.color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${c.textPrimary}`}>
                {business.name}
              </h3>
              <p className={`text-xs ${c.textSecondary}`}>
                Owned: {ownedCount}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${c.innerBg}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Size Options */}
        <div className="p-4 space-y-3">
          <h4 className={`text-sm font-medium ${c.textSecondary} mb-2`}>
            Choose Size
          </h4>
          
          {business.sizes.map((size) => {
            const canAfford = balance >= size.cost;
            
            return (
              <div
                key={size.type}
                className={`
                  ${c.innerBg} border ${c.innerBorder} rounded-xl p-4
                  ${!canAfford && 'opacity-50'}
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className={`font-medium ${c.textPrimary}`}>
                      {size.type} {business.name}
                    </h5>
                    <p className={`text-xs ${c.textSecondary}`}>
                      +{formatCurrency(size.incomePerHour)}/hr income
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(size.cost)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => onBuy(business, size)}
                  disabled={!canAfford}
                  className={`
                    w-full py-2 rounded-lg font-medium text-sm
                    transition-all duration-300
                    ${canAfford
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {canAfford ? 'Purchase' : 'Not Enough Funds'}
                </button>
              </div>
            );
          })}

          {/* Balance Display */}
          <div className={`${c.innerBg} rounded-xl p-3 mt-4`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${c.textSecondary}`}>Your Balance</span>
              <span className={`font-bold ${c.textPrimary}`}>{formatCurrency(balance)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessDetailModal;