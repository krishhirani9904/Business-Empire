import React from 'react';
import { X, Home, MapPin, DollarSign, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatINR, PROPERTIES } from './investingData';

function PropertySellModal({ property, onSell, onClose }) {
  const { isDarkTheme } = useTheme();

  // Get original property data for full improvements list
  const originalProp = PROPERTIES.find(p => p.id === property.id);
  const baseSellPrice = (property.price || 0) * 0.7;
  const improvementValue = (property.improvements || []).reduce(
    (sum, imp) => sum + ((imp.cost || 0) * 0.5),
    0
  );
  const totalSellPrice = Math.floor(baseSellPrice + improvementValue);

  // Calculate income being lost
  const totalIncome = (property.rentalIncomePerHour || 0) +
    (property.improvements || []).reduce((sum, imp) => sum + (imp.bonusIncome || 0), 0);

  // Handle sell action
  const handleSell = () => {
    onSell(property.ownId);
    onClose();
  };

  const c = isDarkTheme
    ? { bg: 'bg-gray-900', border: 'border-gray-700', text: 'text-white', textSec: 'text-gray-400', inner: 'bg-gray-800' }
    : { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900', textSec: 'text-gray-500', inner: 'bg-gray-50' };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 max-w-sm w-full`}>

        {/*  HEADER  */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{property.image}</span>
            <div>
              <h3 className={`font-bold ${c.text}`}>Sell {property.name}</h3>
              <p className={`text-xs ${c.textSec} flex items-center gap-1`}>
                <MapPin className="w-3 h-3" />
                {property.location}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-full hover:opacity-80 ${c.inner}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/*  WARNING  */}
        <div className={`p-3 rounded-xl mb-4 flex items-start gap-2 ${
          isDarkTheme ? 'bg-yellow-900/20 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className={`text-xs font-medium ${isDarkTheme ? 'text-yellow-400' : 'text-yellow-700'}`}>
              You will lose {formatINR(totalIncome)}/hr rental income
            </p>
            <p className={`text-[10px] mt-0.5 ${isDarkTheme ? 'text-yellow-500/70' : 'text-yellow-600'}`}>
              Selling at 70% of purchase price + 50% of improvement costs
            </p>
          </div>
        </div>

        {/*  PRICE BREAKDOWN  */}
        <div className={`p-3 rounded-xl mb-4 border ${c.inner} ${c.border}`}>
          <p className={`text-xs font-semibold mb-2 ${c.textSec}`}>Sale Breakdown</p>
          
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className={`text-xs ${c.textSec}`}>Purchase Price</span>
              <span className={`text-xs ${c.text}`}>{formatINR(property.price || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className={`text-xs ${c.textSec}`}>Base Sale (70%)</span>
              <span className={`text-xs font-medium ${c.text}`}>{formatINR(baseSellPrice)}</span>
            </div>
            
            {(property.improvements || []).length > 0 && (
              <>
                <hr className={`my-1.5 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
                <p className={`text-[10px] ${c.textSec}`}>Improvements (50% value):</p>
                {property.improvements.map(imp => (
                  <div key={imp.id} className="flex justify-between pl-2">
                    <span className={`text-[10px] ${c.textSec}`}>• {imp.name}</span>
                    <span className={`text-[10px] ${c.text}`}>+{formatINR((imp.cost || 0) * 0.5)}</span>
                  </div>
                ))}
              </>
            )}
            
            <hr className={`my-1.5 ${isDarkTheme ? 'border-gray-700' : 'border-gray-200'}`} />
            <div className="flex justify-between">
              <span className={`text-sm font-bold ${c.text}`}>Total You'll Receive</span>
              <span className="text-sm font-bold text-green-500">{formatINR(totalSellPrice)}</span>
            </div>
          </div>
        </div>

        {/*  CURRENT INCOME INFO  */}
        <div className={`p-3 rounded-xl mb-4 ${c.inner}`}>
          <div className="flex justify-between">
            <span className={`text-xs ${c.textSec}`}>Current Income</span>
            <span className="text-xs font-bold text-green-500">+{formatINR(totalIncome)}/hr</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className={`text-xs ${c.textSec}`}>Improvements Done</span>
            <span className={`text-xs ${c.text}`}>
              {(property.improvements || []).length}/{(originalProp?.improvements || []).length}
            </span>
          </div>
        </div>

        {/*  SELL BUTTON  */}
        <button
          onClick={handleSell}
          className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
            bg-gradient-to-r from-red-500 to-orange-500 text-white hover:scale-[1.02] active:scale-95"
        >
          <DollarSign className="w-4 h-4" />
          Sell for {formatINR(totalSellPrice)}
        </button>
      </div>
    </div>
  );
}

export default PropertySellModal;