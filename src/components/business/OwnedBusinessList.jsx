import { useState } from 'react';
import { Briefcase, TrendingUp, AlertCircle, X, Trash2, Clock, IndianRupee, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BUSINESSES, formatCurrency, getSellPrice, SELL_PERCENTAGE } from './businessData';

function OwnedBusinessList({ ownedBusinesses, totalIncome, onSellBusiness }) {
  const { isDarkTheme } = useTheme();

  // Sell modal state
  const [selectedForSell, setSelectedForSell] = useState(null);

  const colors = {
    dark: {
      cardBg: 'bg-gray-900', cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
      textPrimary: 'text-white', textSecondary: 'text-gray-400',
      dangerBg: 'bg-red-900/30', dangerBorder: 'border-red-500/50'
    },
    light: {
      cardBg: 'bg-white', cardBorder: 'border-gray-300',
      innerBg: 'bg-gray-200', innerBorder: 'border-gray-300',
      textPrimary: 'text-gray-900', textSecondary: 'text-gray-600',
      dangerBg: 'bg-red-50', dangerBorder: 'border-red-200'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  const handleConfirmSell = () => {
    if (!selectedForSell) return;
    onSellBusiness(selectedForSell.id);
    setSelectedForSell(null);
  };

  return (
    <>
      <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-lg font-bold ${c.textPrimary}`}>
            Owned Businesses
          </h3>
          {/* CONCEPT: Item count badge — total ketla che te dekhay */}
          {ownedBusinesses.length > 0 && (
            <span className={`text-xs px-2 py-1 rounded-full 
              ${isDarkTheme ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              {ownedBusinesses.length} total
            </span>
          )}
        </div>

        {/* Empty State */}
        {ownedBusinesses.length === 0 ? (
          <div className={`${c.innerBg} rounded-xl p-6 text-center`}>
            <AlertCircle className={`w-12 h-12 ${c.textSecondary} mx-auto mb-3 opacity-50`} />
            <p className={`${c.textSecondary} text-sm`}>
              You don't own any businesses yet.
            </p>
            <p className={`${c.textSecondary} text-xs mt-1`}>
              Click "Start Business" to begin your empire!
            </p>
          </div>
        ) : (
          <>
            <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto space-y-2 pr-1">
              {ownedBusinesses.map(owned => {
                const business = BUSINESSES.find(b => b.id === owned.businessId);
                const Icon = business?.icon || Briefcase;

                return (
                  <button
                    key={owned.id}
                    onClick={() => setSelectedForSell(owned)}
                    className={`
                      w-full text-left
                      ${c.innerBg} border ${c.innerBorder} rounded-xl p-3
                      flex items-center justify-between
                      hover:scale-[1.01] active:scale-[0.99]
                      transition-all duration-200 cursor-pointer
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`w-10 h-10 bg-gradient-to-r 
                        ${business?.color || 'from-gray-500 to-gray-600'} 
                        rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-sm font-medium ${c.textPrimary} truncate`}>
                          {owned.customName || `${owned.sizeType} ${owned.businessName}`}
                        </h4>
                        <p className={`text-xs ${c.textSecondary}`}>
                          {owned.sizeType} • +{formatCurrency(owned.incomePerHour)}/hr
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className={`text-[10px] ${c.textSecondary}`}>Tap →</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* CONCEPT: Scroll Hint — 5 thi vadhu items hoy to hint dekhay */}
            {ownedBusinesses.length > 4 && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <ChevronDown className={`w-3.5 h-3.5 ${c.textSecondary} animate-bounce`} />
                <span className={`text-[10px] ${c.textSecondary}`}>
                  Scroll for more
                </span>
                <ChevronDown className={`w-3.5 h-3.5 ${c.textSecondary} animate-bounce`} />
              </div>
            )}

            {/* Summary Card — always visible, scroll ni bahar */}
            <div className={`${isDarkTheme ? 'bg-green-500/10' : 'bg-green-50'} 
              border border-green-500/30 rounded-xl p-3 mt-3`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${c.textSecondary}`}>
                  Total: {ownedBusinesses.length} businesses
                </span>
                <span className="text-green-500 font-bold">
                  {formatCurrency(totalIncome)}/hr
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* SELL CONFIRMATION MODAL*/}
      {selectedForSell && (() => {
        const business = BUSINESSES.find(b => b.id === selectedForSell.businessId);
        const Icon = business?.icon || Briefcase;
        const sellPrice = getSellPrice(selectedForSell);
        const displayName = selectedForSell.customName || `${selectedForSell.sizeType} ${selectedForSell.businessName}`;

        return (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className={`
              ${c.cardBg} rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md
              max-h-[80vh] overflow-y-auto
            `}>

              {/* Modal Header */}
              <div className={`sticky top-0 ${c.cardBg} border-b ${c.cardBorder} p-4 
                flex items-center justify-between z-10`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r 
                    ${business?.color || 'from-gray-500 to-gray-600'} 
                    rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${c.textPrimary}`}>
                      Business Details
                    </h3>
                    <p className={`text-xs ${c.textSecondary}`}>
                      Manage your business
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedForSell(null)}
                  className={`p-2 rounded-full ${c.innerBg} hover:opacity-80 transition-opacity`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Business Details */}
              <div className="p-4 space-y-4">

                {/* Info Card */}
                <div className={`${c.innerBg} border ${c.innerBorder} rounded-xl p-4`}>
                  <h4 className={`font-bold text-base ${c.textPrimary} mb-3`}>
                    {displayName}
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${c.textSecondary}`}>Type</span>
                      <span className={`text-sm font-medium ${c.textPrimary}`}>
                        {selectedForSell.businessName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${c.textSecondary}`}>Size</span>
                      <span className={`text-sm font-medium ${c.textPrimary}`}>
                        {selectedForSell.sizeType}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        <span className={`text-sm ${c.textSecondary}`}>Income</span>
                      </div>
                      <span className="text-sm font-bold text-green-500">
                        +{formatCurrency(selectedForSell.incomePerHour)}/hr
                      </span>
                    </div>

                    {selectedForSell.purchaseCost && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <IndianRupee className="w-3.5 h-3.5 text-blue-500" />
                          <span className={`text-sm ${c.textSecondary}`}>Bought for</span>
                        </div>
                        <span className={`text-sm font-medium ${c.textPrimary}`}>
                          {formatCurrency(selectedForSell.purchaseCost)}
                        </span>
                      </div>
                    )}

                    {selectedForSell.purchasedAt && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className={`text-sm ${c.textSecondary}`}>Purchased</span>
                        </div>
                        <span className={`text-xs ${c.textSecondary}`}>
                          {new Date(selectedForSell.purchasedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sell Section */}
                <div className={`${c.dangerBg} border ${c.dangerBorder} rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    <h4 className="text-red-500 font-bold text-sm">
                      Sell Business
                    </h4>
                  </div>

                  <p className={`text-xs ${c.textSecondary} mb-3`}>
                    Selling returns {Math.round(SELL_PERCENTAGE * 100)}% of purchase price.
                    This action cannot be undone.
                  </p>

                  <div className={`${c.innerBg} rounded-lg p-3 mb-3`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${c.textSecondary}`}>You will receive</span>
                      <span className="text-xl font-bold text-green-500">
                        +{formatCurrency(sellPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedForSell(null)}
                      className={`
                        flex-1 py-3 rounded-xl font-medium text-sm
                        border-2 ${c.cardBorder} ${c.textPrimary}
                        hover:opacity-80 transition-all duration-300
                      `}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleConfirmSell}
                      className="
                        flex-1 py-3 rounded-xl font-bold text-sm
                        bg-red-500 hover:bg-red-600 text-white
                        flex items-center justify-center gap-2
                        hover:scale-[1.02] active:scale-[0.98]
                        transition-all duration-300
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      Sell {formatCurrency(sellPrice)}
                    </button>
                  </div>
                </div>

                <div className="h-4 sm:h-0" />
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}

export default OwnedBusinessList;