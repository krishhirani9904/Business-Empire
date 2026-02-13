// components/business/BusinessDetailModal.jsx
import React, { useState } from 'react';
import { X, Briefcase } from 'lucide-react';
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
  
  // Confirmation popup state
  const [confirmData, setConfirmData] = useState(null);
  const [customName, setCustomName] = useState('');

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800',
      innerBorder: 'border-gray-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      inputBg: 'bg-gray-700',
      inputBorder: 'border-gray-600',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-gray-500',
      overlayBg: 'bg-black/70'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      innerBg: 'bg-gray-100',
      innerBorder: 'border-gray-300',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      inputBg: 'bg-white',
      inputBorder: 'border-gray-300',
      inputText: 'text-gray-900',
      inputPlaceholder: 'placeholder-gray-400',
      overlayBg: 'bg-black/60'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  if (!business) return null;

  const Icon = business.icon;

  const handlePurchaseClick = (size) => {
    setConfirmData(size);
    setCustomName('');
  };

  const handleConfirmPurchase = () => {
    if (confirmData) {
      const finalName = customName.trim() || `${confirmData.type} ${business.name}`;
      onBuy(business, confirmData, finalName);
      setConfirmData(null);
      setCustomName('');
    }
  };

  const handleCancelConfirm = () => {
    setConfirmData(null);
    setCustomName('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className={`${c.cardBg} rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto mb-20 sm:mb-24`}>
        {/* Header */}
        <div className={`sticky top-0 ${c.cardBg} border-b ${c.cardBorder} p-4 flex items-center justify-between z-10`}>
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
                  onClick={() => handlePurchaseClick(size)}
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

      {/* ===== Confirmation Popup ===== */}
      {confirmData && (
        <div className={`fixed inset-0 ${c.overlayBg} z-[60] flex items-center justify-center p-4`}>
          <div className={`${c.cardBg} rounded-2xl w-full max-w-sm mb-24 shadow-2xl border ${c.cardBorder}`}>
            
            {/* Confirm Header */}
            <div className={`p-4 border-b ${c.cardBorder} flex items-center gap-3`}>
              <div className={`w-10 h-10 bg-gradient-to-r ${business.color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className={`font-bold ${c.textPrimary} text-base`}>
                  Confirm Purchase
                </h3>
                <p className={`text-xs ${c.textSecondary}`}>
                  {confirmData.type} {business.name}
                </p>
              </div>
              <button
                onClick={handleCancelConfirm}
                className={`p-1.5 rounded-full ${c.innerBg}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Confirm Body */}
            <div className="p-4 space-y-4">
              
              {/* Purchase Summary */}
              <div className={`${c.innerBg} border ${c.innerBorder} rounded-xl p-3 space-y-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${c.textSecondary}`}>Business</span>
                  <span className={`text-sm font-medium ${c.textPrimary}`}>
                    {confirmData.type} {business.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${c.textSecondary}`}>Cost</span>
                  <span className="text-sm font-bold text-red-500">
                    -{formatCurrency(confirmData.cost)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${c.textSecondary}`}>Income</span>
                  <span className="text-sm font-bold text-green-500">
                    +{formatCurrency(confirmData.incomePerHour)}/hr
                  </span>
                </div>
              </div>

              {/* Custom Name Input - EMPTY by default, placeholder shows default */}
              <div>
                <label className={`block text-xs font-medium ${c.textSecondary} mb-1.5`}>
                  Name Your Business (Optional)
                </label>
                <div className="relative">
                  <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${c.textSecondary}`} />
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`${confirmData.type} ${business.name}`}
                    maxLength={30}
                    className={`
                      w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium
                      ${c.inputBg} ${c.inputText} ${c.inputPlaceholder}
                      border ${c.inputBorder}
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-colors duration-200
                    `}
                  />
                </div>
                <p className={`text-[10px] ${c.textSecondary} mt-1`}>
                  Leave empty to use default name
                </p>
              </div>

              {/* After Purchase Balance */}
              <div className={`${c.innerBg} rounded-xl p-2.5 flex items-center justify-between`}>
                <span className={`text-xs ${c.textSecondary}`}>Balance After</span>
                <span className={`text-sm font-bold ${c.textPrimary}`}>
                  {formatCurrency(balance - confirmData.cost)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className={`
                    py-2.5 rounded-xl font-medium text-sm
                    ${c.innerBg} ${c.textPrimary} border ${c.innerBorder}
                    hover:opacity-80 transition-all duration-300
                  `}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  className="
                    py-2.5 rounded-xl font-bold text-sm
                    bg-green-500 hover:bg-green-600 text-white
                    transition-all duration-300 flex items-center justify-center gap-1.5
                    shadow-lg shadow-green-500/25
                  "
                >
                  <Briefcase className="w-4 h-4" />
                  Start Business
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessDetailModal;