import { useState } from 'react';
import { X, ShoppingCart, Edit3, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCurrency } from './businessData';

function BusinessDetailModal({
  business,
  balance,
  ownedCount,
  onBuy,
  onClose
}) {
  const { isDarkTheme } = useTheme();

  // CONCEPT: Multi-step state
  // null = size selection screen
  // object = confirmation screen with selected size
  const [selectedSize, setSelectedSize] = useState(null);

  // CONCEPT: Custom name input state
  const [customName, setCustomName] = useState('');

  const colors = {
    dark: {
      cardBg: 'bg-gray-900', cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
      textPrimary: 'text-white', textSecondary: 'text-gray-400',
      inputBg: 'bg-gray-700', inputBorder: 'border-gray-600',
      inputText: 'text-white', inputPlaceholder: 'placeholder-gray-500'
    },
    light: {
      cardBg: 'bg-white', cardBorder: 'border-gray-200',
      innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
      textPrimary: 'text-gray-900', textSecondary: 'text-gray-600',
      inputBg: 'bg-white', inputBorder: 'border-gray-300',
      inputText: 'text-gray-900', inputPlaceholder: 'placeholder-gray-400'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  if (!business) return null;

  const Icon = business.icon;

  // CONCEPT: Step handler — size select thay to confirmation step par jaay
  const handleSizeSelect = (size) => {
    if (balance < size.cost) return;
    setSelectedSize(size);
    // Default name set karo — user badli sake
    setCustomName(`${size.type} ${business.name}`);
  };

  // CONCEPT: Final buy — name + size confirm thay to buy
  const handleConfirmBuy = () => {
    if (!selectedSize) return;
    const finalName = customName.trim() || `${selectedSize.type} ${business.name}`;
    onBuy(business, selectedSize, finalName);
    setSelectedSize(null);
    setCustomName('');
  };

  // Back to size selection
  const handleBack = () => {
    setSelectedSize(null);
    setCustomName('');
  };

  return (
    // CONCEPT: Modal Overlay — navbar ni upar rahe (z-[60])
    // pb-24 = navbar ni upar padding — modal niche na jaay
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`
        ${c.cardBg} rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md 
        max-h-[85vh] overflow-y-auto
        mb-0 sm:mb-0
      `}
        // CONCEPT: overflow-y-auto with hidden scrollbar (CSS handles hiding)
      >

        {/* Sticky Header */}
        <div className={`sticky top-0 ${c.cardBg} border-b ${c.cardBorder} p-4 
          flex items-center justify-between z-10`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-r ${business.color} 
              rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg font-bold ${c.textPrimary}`}>
                {business.name}
              </h3>
              <p className={`text-xs ${c.textSecondary}`}>
                Owned: {ownedCount}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full ${c.innerBg} hover:opacity-80 transition-opacity`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        {business.description && (
          <div className="px-4 pt-3">
            <p className={`text-xs ${c.textSecondary}`}>{business.description}</p>
          </div>
        )}

        {/* STEP 1: Size Selection
            selectedSize null hoy to size options dekhay*/}
        {!selectedSize && (
          <div className="p-4 space-y-3">
            <h4 className={`text-sm font-medium ${c.textSecondary} mb-2`}>
              Choose Size
            </h4>

            {business.sizes.map((size) => {
              const canAfford = balance >= size.cost;

              return (
                <button
                  key={size.type}
                  onClick={() => handleSizeSelect(size)}
                  disabled={!canAfford}
                  className={`
                    w-full text-left
                    ${c.innerBg} border ${c.innerBorder} rounded-xl p-4
                    transition-all duration-300
                    ${canAfford
                      ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h5 className={`font-medium ${c.textPrimary}`}>
                        {size.type} {business.name}
                      </h5>
                      <p className={`text-xs ${c.textSecondary}`}>
                        +{formatCurrency(size.incomePerHour)}/hr income
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${canAfford ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(size.cost)}
                      </p>
                      {canAfford && (
                        <p className="text-[10px] text-green-500">Tap to buy →</p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {/* Balance Display */}
            <div className={`${c.innerBg} rounded-xl p-3 mt-2`}>
              <div className="flex items-center justify-between">
                <span className={`text-sm ${c.textSecondary}`}>Your Balance</span>
                <span className={`font-bold ${c.textPrimary}`}>
                  {formatCurrency(balance)}
                </span>
              </div>
            </div>

            {/* Bottom safe area spacing */}
            <div className="h-4 sm:h-0" />
          </div>
        )}

        {/* STEP 2: Confirmation + Name Input
            selectedSize hoy to confirmation popup dekhay */}
        {selectedSize && (
          <div className="p-4 space-y-4">

            {/* Selected Size Summary */}
            <div className={`${c.innerBg} border ${c.innerBorder} rounded-xl p-4`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${business.color} 
                  rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className={`font-bold ${c.textPrimary}`}>
                    {selectedSize.type} {business.name}
                  </h4>
                  <p className={`text-xs ${c.textSecondary}`}>
                    +{formatCurrency(selectedSize.incomePerHour)}/hr income
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className={`text-sm ${c.textSecondary}`}>Cost</span>
                <span className="font-bold text-lg text-green-500">
                  {formatCurrency(selectedSize.cost)}
                </span>
              </div>
            </div>

            {/* CONCEPT: Custom Name Input */}
            <div>
              <label className={`text-sm font-medium ${c.textPrimary} mb-2 flex items-center gap-2`}>
                <Edit3 className="w-4 h-4" />
                Name Your Business
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                maxLength={30}
                className={`
                  w-full mt-2 px-4 py-3 rounded-xl border-2
                  ${c.inputBg} ${c.inputBorder} ${c.inputText} ${c.inputPlaceholder}
                  focus:border-blue-500 focus:outline-none
                  transition-colors duration-300 text-sm
                `}
                placeholder={`e.g. My ${business.name}`}
              />
              <p className={`text-[10px] ${c.textSecondary} mt-1 text-right`}>
                {customName.length}/30
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className={`
                  flex-1 py-3 rounded-xl font-medium text-sm
                  border-2 ${c.cardBorder} ${c.textPrimary}
                  hover:opacity-80 transition-all duration-300
                `}
              >
                ← Back
              </button>

              {/* Confirm Buy Button */}
              <button
                onClick={handleConfirmBuy}
                className="
                  flex-[2] py-3 rounded-xl font-bold text-sm
                  bg-green-500 hover:bg-green-600 text-white
                  flex items-center justify-center gap-2
                  hover:scale-[1.02] active:scale-[0.98]
                  transition-all duration-300
                "
              >
                <ShoppingCart className="w-4 h-4" />
                Confirm Purchase
              </button>
            </div>

            {/* Balance after purchase */}
            <div className={`${c.innerBg} rounded-xl p-3`}>
              <div className="flex items-center justify-between text-sm">
                <span className={c.textSecondary}>Balance after</span>
                <span className={`font-bold ${
                  (balance - selectedSize.cost) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatCurrency(balance - selectedSize.cost)}
                </span>
              </div>
            </div>

            {/* Bottom safe area spacing */}
            <div className="h-4 sm:h-0" />
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDetailModal;