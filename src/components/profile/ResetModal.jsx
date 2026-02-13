// src/components/profile/ResetModal.jsx

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { formatMoneyFull } from './profileTheme';

const ResetModal = ({ onClose, onReset, profileData, c }) => {
  const [confirmText, setConfirmText] = useState('');

  const {
    balance,
    ownedBusinesses,
    ownedStocks,
    ownedProperties,
    ownedCrypto,
    level,
    totalClicks,
  } = profileData;

  const handleReset = () => {
    if (confirmText === 'RESET') {
      onReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className={`${c.cardBg} border-2 border-red-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-red-500 font-bold text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Confirm Reset
          </h3>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full ${c.hoverBg}`}
          >
            <X className={`w-5 h-5 ${c.textSecondary}`} />
          </button>
        </div>

        {/* Loss Summary */}
        <div className={`${c.dangerBg} border ${c.dangerBorder} rounded-lg p-3 mb-4`}>
          <p className={`text-sm ${c.textPrimary} font-medium mb-2`}>You will lose:</p>
          <ul className={`text-xs ${c.textSecondary} space-y-1`}>
            <li>• 💰 {formatMoneyFull(balance)} cash balance</li>
            <li>• 🏢 {ownedBusinesses.length} businesses</li>
            <li>• 📈 {ownedStocks.length} stock holdings</li>
            <li>• 🏠 {ownedProperties.length} properties</li>
            <li>• ₿ {ownedCrypto.length} crypto holdings</li>
            <li>• ⭐ Level {level} progress</li>
            <li>• 👆 {totalClicks.toLocaleString('en-IN')} total clicks</li>
          </ul>
        </div>

        {/* Confirm Input */}
        <p className={`text-sm ${c.textSecondary} mb-2`}>
          Type <span className="font-bold text-red-500">RESET</span> to confirm:
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
          placeholder="Type RESET"
          className={`
            w-full px-4 py-2.5 rounded-lg border-2 text-sm font-mono
            ${c.inputBg} ${c.inputBorder} ${c.inputText}
            focus:outline-none focus:border-red-500
          `}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onClose}
            className={`flex-1 py-2.5 rounded-xl font-medium text-sm ${c.innerBg} border ${c.innerBorder} ${c.textPrimary} ${c.hoverBg} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={handleReset}
            disabled={confirmText !== 'RESET'}
            className={`
              flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors
              ${confirmText === 'RESET'
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-red-500/30 text-red-300 cursor-not-allowed'
              }
            `}
          >
            Reset Everything
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetModal;