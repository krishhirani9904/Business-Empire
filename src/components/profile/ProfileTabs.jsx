// src/components/profile/ProfileTabs.jsx

import React from 'react';
import { PieChart, Trophy, BarChart3, RotateCcw } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', shortLabel: 'Over', icon: PieChart },
  { id: 'forbes', label: 'Forbes', shortLabel: 'Forb', icon: Trophy },
  { id: 'statistics', label: 'Stats', shortLabel: 'Stat', icon: BarChart3 },
  { id: 'settings', label: 'Settings', shortLabel: 'Sett', icon: RotateCcw },
];

const ProfileTabs = ({ activeSection, setActiveSection, c }) => {
  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl p-1 mb-4 flex gap-1`}>
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = activeSection === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1 sm:gap-2
              py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-blue-500 text-white shadow-md'
                : `${c.textSecondary} ${c.hoverBg}`
              }
            `}
          >
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProfileTabs;