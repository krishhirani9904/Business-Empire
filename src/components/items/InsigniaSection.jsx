// src/components/items/InsigniaSection.jsx
import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { INSIGNIA } from './itemsData';
import { Award, Lock, Check } from 'lucide-react';
import { STOCKS } from '../investing/investingData';

function InsigniaSection() {
  const { isDarkTheme } = useTheme();
  const {
    balance, ownedBusinesses, mergedBusinesses, ownedStocks,
    stockPriceHistory, addBonus
  } = useGame();
  const { earnedInsignia, earnInsignia } = useItems();

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', innerBg: 'bg-gray-800' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', innerBg: 'bg-gray-100' };

  const checkRequirement = (insignia) => {
    const req = insignia.requirement;
    switch (req.type) {
      case 'business_count':
        return ownedBusinesses.length >= req.count;
      case 'same_business_count': {
        const counts = {};
        ownedBusinesses.forEach(b => {
          counts[b.businessId] = (counts[b.businessId] || 0) + 1;
        });
        return Object.values(counts).some(count => count >= req.count);
      }
      case 'empire':
        return ownedBusinesses.length >= req.businessCount && mergedBusinesses.length >= req.mergerCount;
      case 'stock_value': {
        let totalValue = 0;
        ownedStocks.forEach(owned => {
          const stock = STOCKS.find(s => s.id === owned.stockId);
          if (stock) {
            const price = stockPriceHistory[stock.id] || stock.price;
            totalValue += price * owned.quantity;
          }
        });
        return totalValue >= req.value;
      }
      case 'balance':
        return balance >= req.value;
      default:
        return false;
    }
  };

  const handleClaim = (insignia) => {
    if (earnedInsignia.includes(insignia.id)) return;
    if (!checkRequirement(insignia)) return;

    const rewardAmount = parseInt(insignia.reward.replace(/[^0-9]/g, ''));
    addBonus(rewardAmount);
    earnInsignia(insignia.id);
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
        <Award className="w-5 h-5" /> Insignia
      </h3>
      <p className={`text-xs ${c.textSec}`}>Complete achievements to earn badges and bonuses</p>

      <div className="grid gap-3">
        {INSIGNIA.map(insignia => {
          const isEarned = earnedInsignia.includes(insignia.id);
          const canClaim = checkRequirement(insignia) && !isEarned;

          return (
            <div
              key={insignia.id}
              className={`${c.cardBg} border ${c.border} rounded-2xl p-4 transition-all
                ${isEarned ? 'border-yellow-500/50' : canClaim ? 'border-green-500/50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl
                  ${isEarned
                    ? 'bg-gradient-to-br from-yellow-400 to-amber-600'
                    : canClaim
                      ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                      : c.innerBg
                  }`}
                >
                  {isEarned ? insignia.icon : canClaim ? insignia.icon : '🔒'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-bold ${c.text}`}>{insignia.name}</h4>
                    {isEarned && <Check className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <p className={`text-xs ${c.textSec} mt-0.5`}>{insignia.description}</p>
                  <p className="text-xs text-amber-500 font-medium mt-1">
                    Reward: {insignia.reward}
                  </p>
                </div>
                {isEarned ? (
                  <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-500/20 text-yellow-500">
                    Earned
                  </div>
                ) : canClaim ? (
                  <button
                    onClick={() => handleClaim(insignia)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 active:scale-95 transition-transform"
                  >
                    Claim
                  </button>
                ) : (
                  <div className="flex items-center">
                    <Lock className={`w-5 h-5 ${c.textSec}`} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InsigniaSection;