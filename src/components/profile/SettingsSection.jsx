// src/components/profile/SettingsSection.jsx

import React, { useState } from 'react';
import { Globe, AlertTriangle, RotateCcw } from 'lucide-react';
import ResetModal from './ResetModal';

const GAME_INFO = [
  { label: 'Game', value: 'Business Samrajya' },
  { label: 'Version', value: 'v1.0.0' },
  { label: 'Save Data', value: 'Local Storage' },
  { label: 'Auto-Save', value: 'Enabled' },
];

const SettingsSection = ({ c, profileData }) => {
  const [showResetModal, setShowResetModal] = useState(false);

  return (
    <div className="space-y-3">
      {/* Game Info */}
      <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl p-4`}>
        <h3 className={`font-bold ${c.textPrimary} mb-3 flex items-center gap-2`}>
          <Globe className="w-5 h-5 text-blue-500" />
          Game Info
        </h3>
        <div className="space-y-2">
          {GAME_INFO.map(info => (
            <div key={info.label} className={`flex items-center justify-between p-2 ${c.innerBg} rounded-lg`}>
              <span className={`text-sm ${c.textSecondary}`}>{info.label}</span>
              <span className={`text-sm font-medium ${c.textPrimary}`}>{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className={`${c.dangerBg} border-2 ${c.dangerBorder} rounded-xl p-4`}>
        <h3 className="font-bold text-red-500 mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h3>
        <p className={`text-sm ${c.textSecondary} mb-4`}>
          This action is irreversible. All your progress, businesses, investments, and items will be permanently deleted.
        </p>
        <button
          onClick={() => setShowResetModal(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Progress
        </button>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <ResetModal
          onClose={() => setShowResetModal(false)}
          onReset={profileData.resetGame}
          profileData={profileData}
          c={c}
        />
      )}
    </div>
  );
};

export default SettingsSection;