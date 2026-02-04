// pages/Items.jsx
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag } from 'lucide-react';

function Items() {
  const { isDarkTheme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <ShoppingBag className="w-8 h-8 text-purple-500" />
        <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Items
        </h2>
      </div>
      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
        Browse and purchase items for your empire!
      </p>
    </div>
  );
}

export default Items;