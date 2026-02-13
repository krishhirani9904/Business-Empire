// src/components/items/IslandsSection.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { ISLANDS, formatCurrency } from './itemsData';
import { TreePalm, ShoppingCart, X, MapPin, Maximize, Package } from 'lucide-react';

function IslandsSection() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem, isOwned, ownedIslands } = useItems();
  const [activeView, setActiveView] = useState('offers');
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
        overlay: 'bg-black/70'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
        overlay: 'bg-black/50'
      };

  const handleBuy = () => {
    if (!selectedIsland || balance < selectedIsland.price || isOwned('Islands', selectedIsland.id)) return;
    addBonus(-selectedIsland.price);
    buyItem('Islands', selectedIsland, selectedIsland.price);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedIsland(null);
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
        <TreePalm className="w-5 h-5" /> Islands
      </h3>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveView('offers')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5
            ${activeView === 'offers' ? 'bg-emerald-500 text-white' : `${c.innerBg} ${c.textSec}`}`}
        >
          <ShoppingCart className="w-4 h-4" /> Offers
        </button>
        <button
          onClick={() => setActiveView('owned')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5
            ${activeView === 'owned' ? 'bg-emerald-500 text-white' : `${c.innerBg} ${c.textSec}`}`}
        >
          <Package className="w-4 h-4" /> My Islands ({ownedIslands.length})
        </button>
      </div>

      {/* Offers */}
      {activeView === 'offers' && (
        <div className="grid gap-3">
          {ISLANDS.map(island => {
            const owned = isOwned('Islands', island.id);
            return (
              <button
                key={island.id}
                onClick={() => !owned && setSelectedIsland(island)}
                disabled={owned}
                className={`${c.cardBg} border ${c.border} rounded-2xl p-4 w-full text-left transition-all
                  ${owned ? 'opacity-60' : 'hover:scale-[1.01] active:scale-95'}
                  ${owned ? 'ring-2 ring-green-500/30' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{island.image}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold ${c.text}`}>{island.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs ${c.textSec} flex items-center gap-1`}>
                        <MapPin className="w-3 h-3" /> {island.location}
                      </span>
                      <span className={`text-xs ${c.textSec} flex items-center gap-1`}>
                        <Maximize className="w-3 h-3" /> {island.size}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-green-500 mt-1">{formatCurrency(island.price)}</p>
                  </div>
                  {owned && (
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-lg font-medium">Owned</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* My Islands */}
      {activeView === 'owned' && (
        <div>
          {ownedIslands.length === 0 ? (
            <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
              <TreePalm className={`w-12 h-12 mx-auto mb-3 ${c.textSec}`} />
              <p className={`${c.textSec} text-sm`}>You don't own any islands yet.</p>
              <p className={`${c.textSec} text-xs mt-1`}>Check out the offers!</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {ownedIslands.map(island => (
                <div
                  key={island.ownId}
                  className={`${c.cardBg} border ${c.border} rounded-2xl p-4 border-green-500/30`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{island.image}</div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${c.text}`}>{island.name}</h4>
                      <p className={`text-xs ${c.textSec} flex items-center gap-1`}>
                        <MapPin className="w-3 h-3" /> {island.location} • {island.size}
                      </p>
                      <p className="text-sm font-bold text-green-500 mt-1">{formatCurrency(island.purchasePrice)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Island Detail Modal */}
      {selectedIsland && (
        <div className={`fixed inset-0 ${c.overlay} z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4`}>
          <div className={`${c.cardBg} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-700/30">
              <h3 className={`text-lg font-bold ${c.text}`}>{selectedIsland.name}</h3>
              <button onClick={() => setSelectedIsland(null)} className={`p-2 rounded-full ${c.innerBg}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className={`${c.innerBg} rounded-2xl p-8 text-center`}>
                <div className="text-8xl mb-3">{selectedIsland.image}</div>
                <p className={`text-sm font-bold ${c.text}`}>{selectedIsland.name}</p>
              </div>

              <div className={`${c.innerBg} rounded-xl p-4 space-y-2`}>
                <p className={`text-sm ${c.text} leading-relaxed`}>{selectedIsland.description}</p>
              </div>

              <div className={`${c.innerBg} rounded-xl p-4 space-y-2`}>
                <div className="flex justify-between text-xs">
                  <span className={c.textSec}>Location</span>
                  <span className={`${c.text} flex items-center gap-1`}>
                    <MapPin className="w-3 h-3" /> {selectedIsland.location}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={c.textSec}>Size</span>
                  <span className={`${c.text} flex items-center gap-1`}>
                    <Maximize className="w-3 h-3" /> {selectedIsland.size}
                  </span>
                </div>
                <div className={`flex justify-between text-sm font-bold pt-2 border-t ${c.innerBorder}`}>
                  <span className={c.text}>Price</span>
                  <span className="text-green-500">{formatCurrency(selectedIsland.price)}</span>
                </div>
              </div>

              <button
                onClick={handleBuy}
                disabled={balance < selectedIsland.price}
                className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2
                  ${balance >= selectedIsland.price
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {balance >= selectedIsland.price ? 'Buy Island' : 'Insufficient Balance'}
              </button>

              {showSuccess && (
                <div className="text-center py-3 bg-green-500/20 rounded-xl">
                  <p className="text-green-500 font-bold">✅ Island Purchased!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IslandsSection;