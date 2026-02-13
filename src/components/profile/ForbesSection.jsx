// src/components/profile/ForbesSection.jsx

import React, { useState } from 'react';
import { Crown, Trophy, Eye, EyeOff } from 'lucide-react';
import { FORBES_LIST } from './profileData';
import { formatMoney } from './profileTheme';

const ForbesSection = ({ c, profileData }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { currentBadge, netWorth, forbesRank } = profileData;

  return (
    <div className="space-y-3">
      {/* Player Forbes Card */}
      <div className={`${c.cardBg} border-2 border-yellow-500/50 rounded-xl p-4 sm:p-5`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center shadow-lg">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={`font-bold ${c.textPrimary} text-lg`}>You</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${currentBadge.color} text-white`}>
                {currentBadge.name}
              </span>
            </div>
            <p className={`text-sm ${c.textSecondary}`}>Business Samrajya Player</p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${forbesRank <= 10 ? 'text-yellow-500' : c.textPrimary}`}>
              #{forbesRank}
            </p>
            <p className={`text-xs ${c.textMuted}`}>Rank</p>
          </div>
        </div>

        <div className={`${c.innerBg} rounded-lg p-3`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${c.textSecondary}`}>Your Wealth</span>
            <span className={`text-lg font-bold ${c.textPrimary}`}>{formatMoney(netWorth)}</span>
          </div>
          {forbesRank > 1 && (
            <div className="flex items-center justify-between mt-1">
              <span className={`text-xs ${c.textMuted}`}>To reach #{forbesRank - 1}</span>
              <span className="text-xs text-yellow-500 font-medium">Keep growing!</span>
            </div>
          )}
        </div>
      </div>

      {/* Forbes List */}
      <div className={`${c.cardBg} border ${c.cardBorder} rounded-xl overflow-hidden`}>
        <div className="p-4 flex items-center justify-between">
          <h3 className={`font-bold ${c.textPrimary} flex items-center gap-2`}>
            <Trophy className="w-5 h-5 text-yellow-500" />
            Rich List
          </h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`text-xs ${c.textSecondary} flex items-center gap-1`}
          >
            {showDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showDetails ? 'Less' : 'More'}
          </button>
        </div>

        <div className={`divide-y ${c.divider}`}>
          {FORBES_LIST.map((person, index) => {
            const isPlayerAbove = forbesRank <= person.rank;
            return (
              <ForbesRow
                key={person.rank}
                person={person}
                index={index}
                isPlayerAbove={isPlayerAbove}
                showDetails={showDetails}
                c={c}
              />
            );
          })}

          {/* Player Entry if ranked beyond list */}
          {forbesRank > 10 && (
            <>
              <div className={`px-4 py-2 text-center ${c.textMuted} text-xs`}>• • •</div>
              <div className="px-4 py-3 flex items-center gap-3 bg-yellow-500/10 border-l-4 border-yellow-500">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 text-sm font-bold text-white">
                  {forbesRank}
                </div>
                <span className="text-2xl flex-shrink-0">{currentBadge.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${c.textPrimary}`}>You</p>
                  {showDetails && (
                    <p className={`text-xs ${c.textMuted}`}>Business Samrajya</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-yellow-500">{formatMoney(netWorth)}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ForbesRow = ({ person, index, isPlayerAbove, showDetails, c }) => (
  <div
    className={`
      px-4 py-3 flex items-center gap-3 transition-colors
      ${isPlayerAbove ? 'opacity-60' : ''}
      ${c.hoverBg}
    `}
  >
    <div
      className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
        ${index === 0 ? 'bg-yellow-500 text-white' :
          index === 1 ? 'bg-gray-400 text-white' :
          index === 2 ? 'bg-orange-600 text-white' :
          `${c.innerBg} ${c.textSecondary}`
        }
      `}
    >
      {person.rank}
    </div>
    <span className="text-2xl flex-shrink-0">{person.avatar}</span>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${c.textPrimary} truncate`}>{person.name}</p>
      {showDetails && <p className={`text-xs ${c.textMuted}`}>{person.industry}</p>}
    </div>
    <div className="text-right flex-shrink-0">
      <p className={`text-sm font-bold ${c.textPrimary}`}>{person.wealth}</p>
    </div>
  </div>
);

export default ForbesSection;