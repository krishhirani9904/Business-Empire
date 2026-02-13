// components/business/OwnedBusinessDetailModal.jsx
import React, { useState } from 'react';
import { 
  X, Edit3, Save, IndianRupee, Clock, TrendingUp, 
  AlertTriangle, DollarSign, Briefcase, Check 
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { BUSINESSES, formatCurrency } from './businessData';

function OwnedBusinessDetailModal({ 
  ownedBusiness, 
  onClose, 
  onUpdateName, 
  onSell 
}) {
  const { isDarkTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [showSellConfirm, setShowSellConfirm] = useState(false);

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
      overlayBg: 'bg-black/70',
      dangerBg: 'bg-red-900/30',
      dangerBorder: 'border-red-500/50'
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
      overlayBg: 'bg-black/60',
      dangerBg: 'bg-red-50',
      dangerBorder: 'border-red-200'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  if (!ownedBusiness) return null;

  const business = BUSINESSES.find(b => b.id === ownedBusiness.businessId);
  const Icon = business?.icon || Briefcase;
  const businessColor = business?.color || 'from-gray-500 to-gray-600';

  // Find original cost from business data
  const originalSize = business?.sizes.find(s => s.type === ownedBusiness.sizeType);
  const originalCost = originalSize?.cost || 0;

  // Calculate ownership duration
  const purchaseDate = new Date(ownedBusiness.purchasedAt);
  const now = new Date();
  const hoursOwned = Math.max(0, Math.floor((now - purchaseDate) / (1000 * 60 * 60)));
  const minutesOwned = Math.max(1, Math.floor((now - purchaseDate) / (1000 * 60)));

  // Calculate total earned (estimated)
  const totalEarned = Math.floor((minutesOwned / 60) * ownedBusiness.incomePerHour);

  // Sell price = 60% of original cost + earned profit
  const sellPrice = Math.floor(originalCost * 0.6);
  const totalProfit = totalEarned + sellPrice - originalCost;

  // Display name
  const displayName = ownedBusiness.customName || `${ownedBusiness.sizeType} ${ownedBusiness.businessName}`;

  // Handle edit
  const handleStartEdit = () => {
    setEditName(displayName);
    setIsEditing(true);
  };

  const handleSaveName = () => {
    const finalName = editName.trim() || `${ownedBusiness.sizeType} ${ownedBusiness.businessName}`;
    onUpdateName(ownedBusiness.id, finalName);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
  };

  // Handle sell
  const handleSellConfirm = () => {
    onSell(ownedBusiness.id, sellPrice);
    setShowSellConfirm(false);
    onClose();
  };

  // Format time
  const formatTime = (mins) => {
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remainMins = mins % 60;
    if (hrs < 24) return `${hrs}h ${remainMins}m`;
    const days = Math.floor(hrs / 24);
    const remainHrs = hrs % 24;
    return `${days}d ${remainHrs}h`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className={`${c.cardBg} rounded-2xl w-full max-w-sm shadow-2xl border ${c.cardBorder} mb-20 sm:mb-24 mt-5 max-h-[85vh] overflow-y-auto`}>
        
        {/* Header */}
        <div className={`sticky top-0 ${c.cardBg} border-b ${c.cardBorder} p-4 flex items-center gap-3 z-10`}>
          <div className={`w-12 h-12 bg-gradient-to-r ${businessColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={30}
                  autoFocus
                  className={`
                    flex-1 px-2 py-1 rounded-lg text-sm font-medium
                    ${c.inputBg} ${c.inputText} ${c.inputPlaceholder}
                    border ${c.inputBorder}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  placeholder={`${ownedBusiness.sizeType} ${ownedBusiness.businessName}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveName}
                  className="p-1.5 rounded-lg bg-green-500 text-white flex-shrink-0"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className={`p-1.5 rounded-lg ${c.innerBg} flex-shrink-0`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className={`font-bold ${c.textPrimary} text-base truncate`}>
                    {displayName}
                  </h3>
                  <p className={`text-xs ${c.textSecondary}`}>
                    {ownedBusiness.sizeType} • {ownedBusiness.businessName}
                  </p>
                </div>
                <button
                  onClick={handleStartEdit}
                  className={`p-1.5 rounded-lg ${c.innerBg} flex-shrink-0`}
                  title="Edit Name"
                >
                  <Edit3 className="w-4 h-4 text-blue-500" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${c.innerBg} flex-shrink-0`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">

          {/* Income Stats */}
          <div className={`${c.innerBg} border ${c.innerBorder} rounded-xl p-3 space-y-2.5`}>
            <h4 className={`text-xs font-medium ${c.textSecondary} uppercase tracking-wider`}>
              Income Details
            </h4>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className={`text-sm ${c.textSecondary}`}>Per Hour</span>
              </div>
              <span className="text-sm font-bold text-green-500">
                +{formatCurrency(ownedBusiness.incomePerHour)}/hr
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-green-500" />
                <span className={`text-sm ${c.textSecondary}`}>Per Day</span>
              </div>
              <span className="text-sm font-bold text-green-500">
                +{formatCurrency(ownedBusiness.incomePerHour * 24)}/day
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-500" />
                <span className={`text-sm ${c.textSecondary}`}>Per Month</span>
              </div>
              <span className="text-sm font-bold text-purple-500">
                +{formatCurrency(ownedBusiness.incomePerHour * 24 * 30)}/mo
              </span>
            </div>
          </div>

          {/* Ownership Stats */}
          <div className={`${c.innerBg} border ${c.innerBorder} rounded-xl p-3 space-y-2.5`}>
            <h4 className={`text-xs font-medium ${c.textSecondary} uppercase tracking-wider`}>
              Ownership Info
            </h4>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${c.textSecondary}`}>Purchase Cost</span>
              <span className={`text-sm font-medium ${c.textPrimary}`}>
                {formatCurrency(originalCost)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${c.textSecondary}`}>Owned Since</span>
              <span className={`text-sm font-medium ${c.textPrimary}`}>
                {formatTime(minutesOwned)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-sm ${c.textSecondary}`}>Est. Earned</span>
              <span className="text-sm font-bold text-green-500">
                +{formatCurrency(totalEarned)}
              </span>
            </div>
          </div>

          {/* Sell Section */}
          <div className={`${c.dangerBg} border ${c.dangerBorder} rounded-xl p-3`}>
            <h4 className={`text-xs font-medium text-red-500 uppercase tracking-wider mb-2`}>
              Sell Business
            </h4>

            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm ${c.textSecondary}`}>Sell Value (60%)</span>
                <span className="text-sm font-bold text-yellow-500">
                  {formatCurrency(sellPrice)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${c.textSecondary}`}>Est. Earned</span>
                <span className="text-sm font-bold text-green-500">
                  +{formatCurrency(totalEarned)}
                </span>
              </div>
              <div className={`border-t ${c.innerBorder} pt-2`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${c.textPrimary}`}>Net Profit/Loss</span>
                  <span className={`text-sm font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {totalProfit >= 0 ? '+' : ''}{formatCurrency(totalProfit)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSellConfirm(true)}
              className="
                w-full py-2.5 rounded-xl font-medium text-sm
                bg-red-500 hover:bg-red-600 text-white
                transition-all duration-300 flex items-center justify-center gap-2
              "
            >
              <DollarSign className="w-4 h-4" />
              Sell for {formatCurrency(sellPrice)}
            </button>
          </div>
        </div>
      </div>

      {/* ===== Sell Confirmation Popup ===== */}
      {showSellConfirm && (
        <div className={`fixed inset-0 ${c.overlayBg} z-[60] flex items-center justify-center p-4`}>
          <div className={`${c.cardBg} rounded-2xl w-full max-w-xs shadow-2xl border ${c.cardBorder}`}>
            
            <div className="p-5 text-center">
              <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              
              <h3 className={`font-bold ${c.textPrimary} text-lg mb-1`}>
                Sell Business?
              </h3>
              <p className={`text-sm ${c.textSecondary} mb-1`}>
                {displayName}
              </p>
              <p className={`text-xs ${c.textSecondary} mb-4`}>
                This action cannot be undone. You will receive{' '}
                <span className="text-yellow-500 font-bold">{formatCurrency(sellPrice)}</span>
              </p>

              {/* Profit/Loss Summary */}
              <div className={`${c.innerBg} rounded-xl p-3 mb-4 space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${c.textSecondary}`}>Sell Value</span>
                  <span className="text-xs font-bold text-yellow-500">
                    {formatCurrency(sellPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${c.textSecondary}`}>Original Cost</span>
                  <span className={`text-xs font-medium ${c.textPrimary}`}>
                    {formatCurrency(originalCost)}
                  </span>
                </div>
                <div className={`border-t ${c.innerBorder} pt-1.5`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${c.textPrimary}`}>Net Result</span>
                    <span className={`text-xs font-bold ${totalProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalProfit >= 0 ? 'Profit' : 'Loss'}: {totalProfit >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalProfit))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowSellConfirm(false)}
                  className={`
                    py-2.5 rounded-xl font-medium text-sm
                    ${c.innerBg} ${c.textPrimary} border ${c.innerBorder}
                    hover:opacity-80 transition-all duration-300
                  `}
                >
                  Keep It
                </button>
                <button
                  onClick={handleSellConfirm}
                  className="
                    py-2.5 rounded-xl font-bold text-sm
                    bg-red-500 hover:bg-red-600 text-white
                    transition-all duration-300
                  "
                >
                  Sell Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnedBusinessDetailModal;