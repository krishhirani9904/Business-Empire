import { useTheme } from '../../context/ThemeContext';
import { BUSINESSES, MERGER_OPTIONS } from './businessData';

// Validation-heavy Component
// Merger requirements check kare — badhi conditions satisfy thay to j merge possible
function MergerPanel({ ownedBusinesses, mergedBusinesses, onMerge, getOwnedCount }) {
  const { isDarkTheme } = useTheme();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900', cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800', innerBorder: 'border-gray-600',
      textPrimary: 'text-white', textSecondary: 'text-gray-400'
    },
    light: {
      cardBg: 'bg-white', cardBorder: 'border-gray-200',
      innerBg: 'bg-gray-100', innerBorder: 'border-gray-300',
      textPrimary: 'text-gray-900', textSecondary: 'text-gray-600'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  // Merger possible che ke nahi
  const canMerge = (merger) => {
    if (mergedBusinesses.includes(merger.id)) return false;
    return merger.requirements.every(req => {
      const count = getOwnedCount(req.businessId);
      return count >= req.minCount;
    });
  };

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4 mb-4`}>
      <h3 className={`text-lg font-bold ${c.textPrimary} mb-3`}>
        Business Mergers
      </h3>
      <p className={`text-xs ${c.textSecondary} mb-4`}>
        Combine businesses for bonus income multipliers
      </p>

      <div className="space-y-3">
        {MERGER_OPTIONS.map(merger => {
          const available = canMerge(merger);
          const merged = mergedBusinesses.includes(merger.id);

          return (
            <div
              key={merger.id}
              className={`
                ${c.innerBg} border ${c.innerBorder} rounded-xl p-4
                ${!available && !merged && 'opacity-50'}
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${c.textPrimary}`}>
                      {merger.name}
                    </h4>
                    {merged && (
                      <span className="bg-green-500 text-white text-[10px] 
                        px-2 py-0.5 rounded-full">
                        MERGED
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${c.textSecondary} mb-2`}>
                    {merger.description}
                  </p>

                  {/* Requirements display — green = met, red = not met */}
                  <div className="flex flex-wrap gap-2">
                    {merger.requirements.map((req) => {
                      const business = BUSINESSES.find(b => b.id === req.businessId);
                      const owned = getOwnedCount(req.businessId);
                      const met = owned >= req.minCount;

                      return (
                        <span
                          key={req.businessId}
                          className={`
                            text-[10px] px-2 py-1 rounded-full
                            ${met
                              ? 'bg-green-500/20 text-green-500'
                              : 'bg-red-500/20 text-red-400'
                            }
                          `}
                        >
                          {business?.name}: {owned}/{req.minCount}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="text-right ml-3">
                  <span className="text-lg font-bold text-purple-500">
                    +{merger.bonus}%
                  </span>
                </div>
              </div>

              {!merged && (
                <button
                  onClick={() => onMerge(merger)}
                  disabled={!available}
                  className={`
                    w-full py-2 mt-2 rounded-lg font-medium text-sm
                    transition-all duration-300
                    ${available
                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {available ? 'Merge Now' : 'Requirements Not Met'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MergerPanel;