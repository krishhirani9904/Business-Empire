import { Plus, GitMerge } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// Controlled Component Pattern
// activeTab = Current state (from parent)
// onTabChange = Function to change state (in parent)
function ActionButtons({ activeTab, onTabChange }) {
  const { isDarkTheme } = useTheme();

  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      textPrimary: 'text-white',
      startSelected: 'bg-blue-800 border-blue-800 text-white',
      startHover: 'hover:border-blue-400',
      mergeSelected: 'bg-purple-900 border-purple-600 text-white',
      mergeHover: 'hover:border-purple-400'
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      textPrimary: 'text-gray-900',
      startSelected: 'bg-blue-500 border-blue-500 text-white',
      startHover: 'hover:border-blue-500',
      mergeSelected: 'bg-purple-500 border-purple-500 text-white',
      mergeHover: 'hover:border-purple-500'
    }
  };

  const c = isDarkTheme ? colors.dark : colors.light;

  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      {/* Start Business Button */}
      <button
        // Toggle Pattern — same button fari click -> null (close)
        onClick={() => onTabChange(activeTab === 'start' ? null : 'start')}
        className={`
          flex items-center justify-center gap-2 p-4 rounded-2xl font-medium
          transition-all duration-300 border-2
          ${activeTab === 'start'
            ? c.startSelected
            : `${c.cardBg} ${c.cardBorder} ${c.textPrimary} ${c.startHover}`
          }
        `}
      >
        <Plus className="w-5 h-5" />
        <span>Start Business</span>
      </button>

      {/* Merge Business Button */}
      <button
        onClick={() => onTabChange(activeTab === 'merge' ? null : 'merge')}
        className={`
          flex items-center justify-center gap-2 p-4 rounded-2xl font-medium
          transition-all duration-300 border-2
          ${activeTab === 'merge'
            ? c.mergeSelected
            : `${c.cardBg} ${c.cardBorder} ${c.textPrimary} ${c.mergeHover}`
          }
        `}
      >
        <GitMerge className="w-5 h-5" />
        <span>Merge Business</span>
      </button>
    </div>
  );
}

export default ActionButtons;