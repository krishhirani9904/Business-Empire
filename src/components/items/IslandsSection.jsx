import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { ISLANDS, formatCurrency } from './itemsData';
import { X, ShoppingCart, Trash2, MapPin, Maximize } from 'lucide-react';

function IslandsSection() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem, sellItem, isOwned, ownedIslands } = useItems();

  const [viewMode, setViewMode] = useState('offers');
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sellConfirm, setSellConfirm] = useState(null);
  const buyingRef = useRef(false);

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700/50', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800', overlay: 'bg-black/70' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', overlay: 'bg-black/50' };

  const handleBuy = (island) => {
    if (buyingRef.current || balance < island.price) return;
    buyingRef.current = true;

    const success = buyItem('Islands', island, island.price);
    if (success) {
      addBonus(-island.price);
    }

    setShowSuccess(true);
    setSelectedIsland(null);
    setTimeout(() => { setShowSuccess(false); buyingRef.current = false; }, 1500);
  };

  const handleSell = (island) => {
    const identifier = island.ownId || island.id;
    const price = sellItem('Islands', identifier);
    if (price > 0) addBonus(price);
    setSellConfirm(null);
  };

  return (
    <div className="mb-4 space-y-3">
      <p className={`text-xs font-bold ${c.textSec} uppercase tracking-wider px-1`}>
        🏝️ Private Islands
      </p>

      {/* Toggle */}
      <div className="flex gap-2">
        <button onClick={() => setViewMode('offers')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5
            ${viewMode === 'offers' ? 'bg-emerald-500 text-white' : `${c.innerBg} ${c.textSec}`}`}>
          <ShoppingCart className="w-3.5 h-3.5" /> Offers
        </button>
        <button onClick={() => setViewMode('owned')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5
            ${viewMode === 'owned' ? 'bg-emerald-500 text-white' : `${c.innerBg} ${c.textSec}`}`}>
          🏝️ My Islands ({ownedIslands.length})
        </button>
      </div>

      {showSuccess && (
        <div className="text-center py-2 bg-green-500/20 rounded-xl">
          <p className="text-green-500 font-bold text-sm">✅ Island Purchased!</p>
        </div>
      )}

      {/* Offers */}
      {viewMode === 'offers' && (
        <div className="space-y-2">
          {ISLANDS.map(island => {
            const owned = isOwned('Islands', island.id);
            return (
              <button
                key={island.id}
                onClick={() => !owned && setSelectedIsland(island)}
                disabled={owned}
                className={`w-full ${c.cardBg} border ${c.border} rounded-2xl p-3
                  flex items-center gap-3 text-left transition-all
                  ${owned ? 'opacity-60' : 'hover:scale-[1.01] active:scale-[0.99]'}`}
              >
                <div className="text-3xl w-10 text-center">{island.image}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-bold ${c.text} truncate`}>{island.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] ${c.textSec} flex items-center gap-0.5`}>
                      <Maximize className="w-2.5 h-2.5" /> {island.size}
                    </span>
                    <span className={`text-[10px] ${c.textSec} flex items-center gap-0.5`}>
                      <MapPin className="w-2.5 h-2.5" /> {island.location}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-green-500 mt-0.5">{formatCurrency(island.price)}</p>
                </div>
                {owned ? (
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-lg shrink-0">
                    ✓ Owned
                  </span>
                ) : (
                  <ShoppingCart className={`w-4 h-4 ${c.textSec} shrink-0`} />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Owned */}
      {viewMode === 'owned' && (
        <div>
          {ownedIslands.length === 0 ? (
            <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
              <p className="text-3xl mb-2">🏝️</p>
              <p className={`${c.textSec} text-sm`}>No islands yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {ownedIslands.map(island => (
                <div key={island.ownId}
                  className={`${c.cardBg} border ${c.border} rounded-2xl p-3 flex items-center gap-3`}>
                  <div className="text-3xl">{island.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold ${c.text} truncate`}>{island.name}</p>
                    <p className={`text-[10px] ${c.textSec}`}>{island.size} • {island.location}</p>
                    <p className="text-xs font-bold text-green-500">{formatCurrency(island.purchasePrice)}</p>
                  </div>
                  <button onClick={() => setSellConfirm(island)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Buy Popup */}
      {selectedIsland && (
        <div className={`fixed inset-0 ${c.overlay} z-[100] flex items-center justify-center p-4`}>
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-5 max-w-sm w-full space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Buy Island</h4>
              <button onClick={() => setSelectedIsland(null)} className={`p-1.5 rounded-full ${c.innerBg}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-3">{selectedIsland.image}</div>
              <p className={`font-bold text-lg ${c.text}`}>{selectedIsland.name}</p>
              <div className="flex items-center justify-center gap-3 mt-1">
                <span className={`text-xs ${c.textSec} flex items-center gap-1`}>
                  <Maximize className="w-3 h-3" /> {selectedIsland.size}
                </span>
                <span className={`text-xs ${c.textSec} flex items-center gap-1`}>
                  <MapPin className="w-3 h-3" /> {selectedIsland.location}
                </span>
              </div>
              <p className={`text-xs ${c.textSec} mt-2`}>{selectedIsland.description}</p>
              <p className="text-2xl font-bold text-green-500 mt-3">{formatCurrency(selectedIsland.price)}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSelectedIsland(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${c.innerBg} ${c.text}`}>
                Cancel
              </button>
              <button onClick={() => handleBuy(selectedIsland)}
                disabled={balance < selectedIsland.price}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${balance >= selectedIsland.price
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
                {balance >= selectedIsland.price ? 'Buy Now' : 'No Balance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Popup */}
      {sellConfirm && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-white'} rounded-2xl p-5 max-w-sm w-full space-y-4`}>
            <div className="flex items-center justify-between">
              <h4 className={`font-bold ${c.text}`}>Sell Island?</h4>
              <button onClick={() => setSellConfirm(null)} className={`p-1.5 rounded-full ${c.innerBg}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{sellConfirm.image}</div>
              <p className={`font-bold ${c.text}`}>{sellConfirm.name}</p>
              <p className="text-lg font-bold text-green-500 mt-2">
                Sell for {formatCurrency(Math.floor((sellConfirm.purchasePrice || sellConfirm.price) * 0.7))}
              </p>
              <p className={`text-[10px] ${c.textSec}`}>(70% of value)</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setSellConfirm(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium ${c.innerBg} ${c.text}`}>
                Cancel
              </button>
              <button onClick={() => handleSell(sellConfirm)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white active:scale-95 transition-all">
                Sell
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IslandsSection;