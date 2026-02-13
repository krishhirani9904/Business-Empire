// src/components/items/NFTSection.jsx
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGame } from '../../context/GameContext';
import { useItems } from '../../context/ItemsContext';
import { NFTS, formatCurrency } from './itemsData';
import { Hexagon, ShoppingCart, Package } from 'lucide-react';

function NFTSection() {
  const { isDarkTheme } = useTheme();
  const { balance, addBonus } = useGame();
  const { buyItem, isOwned, ownedNFTs } = useItems();
  const [showSuccess, setShowSuccess] = useState(false);

  const c = isDarkTheme
    ? { cardBg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', innerBg: 'bg-gray-800' }
    : { cardBg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', innerBg: 'bg-gray-100' };

  const rarityColors = {
    Common: 'text-gray-400 bg-gray-500/20',
    Rare: 'text-blue-400 bg-blue-500/20',
    Epic: 'text-purple-400 bg-purple-500/20',
    Legendary: 'text-yellow-400 bg-yellow-500/20'
  };

  const handleBuy = (nft) => {
    if (balance < nft.price || isOwned('NFTs', nft.id)) return;
    addBonus(-nft.price);
    buyItem('NFTs', nft, nft.price);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  return (
    <div className="space-y-3">
      <h3 className={`text-lg font-bold ${c.text} flex items-center gap-2`}>
        <Hexagon className="w-5 h-5" /> NFT Collection
      </h3>

      {/* Owned NFTs Summary */}
      {ownedNFTs.length > 0 && (
        <div className={`${c.cardBg} border ${c.border} rounded-2xl p-4`}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-purple-500" />
            <span className={`text-sm font-bold ${c.text}`}>My NFTs ({ownedNFTs.length})</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ownedNFTs.map(nft => (
              <div key={nft.ownId} className={`${c.innerBg} rounded-xl p-3 text-center min-w-[80px] flex-shrink-0`}>
                <div className="text-3xl mb-1">{nft.image}</div>
                <p className={`text-[10px] font-medium ${c.text} truncate`}>{nft.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="text-center py-2 bg-green-500/20 rounded-xl">
          <p className="text-green-500 font-bold text-sm">✅ NFT Purchased!</p>
        </div>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-2 gap-3">
        {NFTS.map(nft => {
          const owned = isOwned('NFTs', nft.id);
          return (
            <div
              key={nft.id}
              className={`${c.cardBg} border ${c.border} rounded-2xl overflow-hidden
                ${owned ? 'ring-2 ring-purple-500/50' : ''}`}
            >
              <div className={`${c.innerBg} p-6 text-center relative`}>
                <div className="text-5xl">{nft.image}</div>
                <span className={`absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${rarityColors[nft.rarity]}`}>
                  {nft.rarity}
                </span>
              </div>
              <div className="p-3">
                <p className={`text-xs font-bold ${c.text} truncate`}>{nft.name}</p>
                <p className={`text-[10px] ${c.textSec}`}>{nft.collection}</p>
                <p className="text-sm font-bold text-green-500 mt-1">{formatCurrency(nft.price)}</p>
                {owned ? (
                  <div className="w-full mt-2 py-1.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-500 text-center">
                    ✓ Owned
                  </div>
                ) : (
                  <button
                    onClick={() => handleBuy(nft)}
                    disabled={balance < nft.price}
                    className={`w-full mt-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1
                      ${balance >= nft.price
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-[1.02] active:scale-95'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Buy
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NFTSection;