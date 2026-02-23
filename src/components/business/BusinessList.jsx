import { useTheme } from '../../context/ThemeContext';
import { BUSINESSES, formatCurrency } from './businessData';

// List Component with Selection
// Grid layout ma badha businesses dekhay
// Click kare to parent ne khabar pade (onSelectBusiness)
function BusinessList({ ownedBusinesses, onSelectBusiness, getOwnedCount }) {
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

  return (
    <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-4 mb-4`}>
      <h3 className={`text-lg font-bold ${c.textPrimary} mb-3`}>
        Available Businesses
      </h3>

      {/*  Responsive Grid — 2 columns mobile, 3 columns tablet+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {BUSINESSES.map(business => {
          const Icon = business.icon;
          const ownedCount = getOwnedCount(business.id);
          const minCost = business.sizes[0].cost;

          return (
            <button
              key={business.id}
              onClick={() => onSelectBusiness(business)}
              className={`
                ${c.innerBg} border ${c.innerBorder} rounded-xl p-3
                hover:scale-105 transition-all duration-300
                text-left relative overflow-hidden
              `}
            >
              {/*  Conditional Badge — owned count > 0 hoy to j dekhay */}
              {ownedCount > 0 && (
                <div className="absolute top-2 right-2 bg-green-500 text-white 
                  text-[10px] w-5 h-5 rounded-full flex items-center 
                  justify-center font-bold">
                  {ownedCount}
                </div>
              )}

              <div className={`w-10 h-10 bg-gradient-to-r ${business.color} 
                rounded-lg flex items-center justify-center mb-2`}>
                <Icon className="w-5 h-5 text-white" />
              </div>

              <h4 className={`text-sm font-medium ${c.textPrimary} truncate`}>
                {business.name}
              </h4>
              <p className={`text-xs ${c.textSecondary}`}>
                From {formatCurrency(minCost)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BusinessList;