// src/components/items/Collections.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import {
  COINS_COLLECTION, PAINTINGS_COLLECTION, UNIQUE_ITEMS,
  RETRO_CARS, JEWELS_COLLECTION, STAMPS_COLLECTION, formatCurrency
} from './itemsData';
import { Lock, ShoppingCart, X, Eye, Package } from 'lucide-react';

function Collections() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem, isOwned } = useItems();
  const [activeTab, setActiveTab] = useState('coins');
  const [viewMode, setViewMode] = useState('market'); // market or collection
  const [selectedRetro, setSelectedRetro] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const c = isDarkTheme
    ? {
        cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white',
        textSec: 'text-gray-400', innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
        tabActive: 'bg-amber-600 text-white', tabInactive: 'text-gray-400 hover:bg-gray-700',
        overlay: 'bg-black/70', locked: 'bg-gray-800/80'
      }
    : {
        cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900',
        textSec: 'text-gray-500', innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
        tabActive: 'bg-amber-500 text-white', tabInactive: 'text-gray-600 hover:bg-gray-200',
        overlay: 'bg-black/50', locked: 'bg-gray-200/80'
      };

  const collectionTabs = [
    { id: 'coins', label: '🪙 Coins' },
    { id: 'paintings', label: '🖼️ Paintings' },
    { id: 'unique', label: '⚔️ Unique' },
    { id: 'retro', label: '🚗 Retro Cars' },
    { id: 'jewels', label: '💎 Jewels' },
    { id: 'stamps', label: '📮 Stamps' }
  ];

  const getCollectionData = () => {
    switch (activeTab) {
      case 'coins': return { items: COINS_COLLECTION, category: 'Coins' };
      case 'paintings': return { items: PAINTINGS_COLLECTION, category: 'Paintings' };
      case 'unique': return { items: UNIQUE_ITEMS, category: 'UniqueItems' };
      case 'retro': return { items: RETRO_CARS, category: 'RetroCars' };
      case 'jewels': return { items: JEWELS_COLLECTION, category: 'Jewels' };
      case 'stamps': return { items: STAMPS_COLLECTION, category: 'Stamps' };
      default: return { items: [], category: '' };
    }
  };

  const { items, category } = getCollectionData();

  const getOwnedItems = () => {
    return items.filter(item => isOwned(category, item.id));
  };

  const handleBuySimple = (item) => {
    if (balance < item.price || isOwned(category, item.id)) return;
    addBonus(-item.price);
    buyItem(category, item, item.price);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleBuyRetro = () => {
    if (!selectedRetro || balance < selectedRetro.price || isOwned('RetroCars', selectedRetro.id)) return;
    addBonus(-selectedRetro.price);
    buyItem('RetroCars', selectedRetro, selectedRetro.price);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedRetro(null);
    }, 1500);
  };

  const ownedItems = getOwnedItems();

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${c.text}`}>🎨 Collections</h3>

      {/* Collection Type Tabs */}
      <div className={`${c.innerBg} rounded-xl p-1.5 overflow-x-auto`}>
        <div className="flex gap-1 min-w-max">
          {collectionTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setViewMode('market'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap
                ${activeTab === tab.id ? c.tabActive : c.tabInactive}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Market / My Collection Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setViewMode('market')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5
            ${viewMode === 'market' ? 'bg-amber-500 text-white' : `${c.innerBg} ${c.textSec}`}`}
        >
          <ShoppingCart className="w-4 h-4" /> Market
        </button>
        <button
          onClick={() => setViewMode('collection')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5
            ${viewMode === 'collection' ? 'bg-amber-500 text-white' : `${c.innerBg} ${c.textSec}`}`}
        >
          <Package className="w-4 h-4" /> My Collection ({ownedItems.length})
        </button>
      </div>

      {/* Success */}
      {showSuccess && (
        <div className="text-center py-2 bg-green-500/20 rounded-xl">
          <p className="text-green-500 font-bold text-sm">✅ Added to Collection!</p>
        </div>
      )}

      {/* Market View */}
      {viewMode === 'market' && (
        <div>
          {activeTab === 'retro' ? (
            /* Retro Cars Market */
            <div className="grid gap-3">
              {items.map(item => {
                const owned = isOwned('RetroCars', item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => !owned && setSelectedRetro(item)}
                    disabled={owned}
                    className={`${c.cardBg} border ${c.border} rounded-2xl p-4 flex items-center gap-4 w-full text-left transition-all
                      ${owned ? 'opacity-60' : 'hover:scale-[1.01] active:scale-95'}`}
                  >
                    <div className="text-4xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className={`font-bold text-sm ${c.text}`}>{item.name}</h4>
                      <p className={`text-xs ${c.textSec}`}>Year: {item.year}</p>
                      <p className="text-sm font-bold text-green-500">{formatCurrency(item.price)}</p>
                    </div>
                    {owned && (
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-lg font-medium">Owned</span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            /* Other Collections Market (Locked style) */
            <div className="grid grid-cols-2 gap-3">
              {items.map(item => {
                const owned = isOwned(category, item.id);
                return (
                  <div
                    key={item.id}
                    className={`${c.cardBg} border ${c.border} rounded-2xl overflow-hidden`}
                  >
                    <div className="relative p-6 text-center">
                      <div className="text-5xl mb-1">
                        {owned ? item.image : '🔒'}
                      </div>
                      {!owned && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-gray-500/30" />
                        </div>
                      )}
                    </div>
                    <div className="px-3 pb-3 text-center">
                      <p className={`text-xs font-medium ${c.text} truncate`}>
                        {owned ? item.name : '???'}
                      </p>
                      <p className="text-xs font-bold text-green-500 mt-0.5">
                        {formatCurrency(item.price)}
                      </p>
                      {!owned ? (
                        <button
                          onClick={() => handleBuySimple(item)}
                          disabled={balance < item.price}
                          className={`w-full mt-2 py-1.5 rounded-lg text-xs font-bold transition-all
                            ${balance >= item.price
                              ? 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
                              : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                        >
                          {balance >= item.price ? 'Buy' : 'Locked'}
                        </button>
                      ) : (
                        <div className="w-full mt-2 py-1.5 rounded-lg text-xs font-bold bg-green-500/20 text-green-500">
                          ✓ Owned
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* My Collection View */}
      {viewMode === 'collection' && (
        <div>
          {ownedItems.length === 0 ? (
            <div className={`${c.cardBg} border ${c.border} rounded-2xl p-8 text-center`}>
              <Package className={`w-12 h-12 mx-auto mb-3 ${c.textSec}`} />
              <p className={`${c.textSec} text-sm`}>No items in this collection yet.</p>
              <p className={`${c.textSec} text-xs mt-1`}>Visit the market to buy!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {ownedItems.map(item => (
                <div
                  key={item.id}
                  className={`${c.cardBg} border ${c.border} rounded-2xl p-4 text-center`}
                >
                  <div className="text-5xl mb-2">{item.image}</div>
                  <p className={`text-xs font-bold ${c.text} truncate`}>{item.name}</p>
                  {item.year && <p className={`text-[10px] ${c.textSec}`}>Year: {item.year}</p>}
                  <p className="text-xs font-bold text-green-500 mt-1">{formatCurrency(item.price)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Retro Car Detail Modal */}
      {selectedRetro && (
        <div className={`fixed inset-0 ${c.overlay} z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4`}>
          <div className={`${c.cardBg} w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl max-h-[85vh] overflow-y-auto`}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-700/30">
              <h3 className={`text-lg font-bold ${c.text}`}>{selectedRetro.name}</h3>
              <button onClick={() => setSelectedRetro(null)} className={`p-2 rounded-full ${c.innerBg}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className={`${c.innerBg} rounded-2xl p-8 text-center`}>
                <div className="text-8xl mb-3">{selectedRetro.image}</div>
                <p className={`text-sm font-bold ${c.text}`}>{selectedRetro.name}</p>
                <p className={`text-xs ${c.textSec} mt-1`}>Year: {selectedRetro.year}</p>
              </div>

              <div className={`${c.innerBg} rounded-xl p-4`}>
                <p className={`text-sm ${c.text}`}>{selectedRetro.description}</p>
              </div>

              <div className={`flex justify-between items-center ${c.innerBg} rounded-xl p-4`}>
                <span className={`text-sm font-medium ${c.textSec}`}>Price</span>
                <span className="text-lg font-bold text-green-500">{formatCurrency(selectedRetro.price)}</span>
              </div>

              <button
                onClick={handleBuyRetro}
                disabled={balance < selectedRetro.price || isOwned('RetroCars', selectedRetro.id)}
                className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2
                  ${balance >= selectedRetro.price && !isOwned('RetroCars', selectedRetro.id)
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isOwned('RetroCars', selectedRetro.id) ? 'Already Owned' : balance >= selectedRetro.price ? 'Buy Now' : 'Insufficient Balance'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;