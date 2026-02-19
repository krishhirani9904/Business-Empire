import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { INSIGNIA, formatCurrency } from './itemsData';
import { STOCKS } from '../investing/investingData';
import { Award, Lock, Check } from 'lucide-react';

function InsigniaSection() {
  const { isDarkTheme } = useTheme();
  const { balance, ownedBusinesses, mergedBusinesses, ownedStocks, stockPriceHistory, addBonus } = useGame();
  const { earnedInsignia, earnInsignia, getItemCount } = useItems();
  // 🆕 Using getItemCount from context instead of local function

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700/50', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100' };

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
        return ownedBusinesses.length >= req.businessCount 
            && mergedBusinesses.length >= req.mergerCount;
            
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
        
      case 'item_count':
        // 🆕 Uses context function — works for ALL categories
        return getItemCount(req.category) >= req.count;
        
      default:
        return false;
    }
  };

  const handleClaim = (insignia) => {
    if (earnedInsignia.includes(insignia.id) || !checkRequirement(insignia)) return;
    addBonus(insignia.rewardAmount);
    earnInsignia(insignia.id);
  };

  return (
    <div className="mb-4 space-y-3">
      <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider px-1`}>
        🏆 Insignia
      </p>
      
      <div className="space-y-2">
        {INSIGNIA.map(insignia => {
          const isEarned = earnedInsignia.includes(insignia.id);
          const canClaim = checkRequirement(insignia) && !isEarned;

          return (
            <div key={insignia.id}
              className={`${c.cardBg} border ${c.border} rounded-2xl p-3 flex items-center gap-3
                ${isEarned ? 'border-yellow-500/30' : canClaim ? 'border-green-500/30' : ''}`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0
                ${isEarned 
                  ? 'bg-gradient-to-br from-yellow-400 to-amber-600'
                  : canClaim 
                    ? 'bg-gradient-to-br from-green-400 to-emerald-600'
                    : c.innerBg}`}
              >
                {isEarned || canClaim ? insignia.icon : '🔒'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className={`font-bold text-sm ${c.text} truncate`}>{insignia.name}</h4>
                  {isEarned && <Check className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                </div>
                <p className={`text-[10px] ${c.textSec} truncate`}>{insignia.description}</p>
                <p className="text-[10px] text-amber-500 font-medium mt-0.5">
                  Reward: {formatCurrency(insignia.rewardAmount)}
                </p>
              </div>
              
              {isEarned ? (
                <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-yellow-500/20 text-yellow-500 shrink-0">
                  Earned
                </span>
              ) : canClaim ? (
                <button onClick={() => handleClaim(insignia)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-gradient-to-r 
                    from-green-500 to-emerald-500 text-white active:scale-95 transition-all shrink-0">
                  Claim
                </button>
              ) : (
                <Lock className={`w-4 h-4 ${c.textSec} shrink-0`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InsigniaSection;