// pages/Investing.jsx
import { useTheme } from '../context/ThemeContext';
import { TrendingUp } from 'lucide-react';

function Investing() {
  const { isDarkTheme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-8 h-8 text-green-500" />
        <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Investing
        </h2>
      </div>
      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
        Grow your wealth through smart investments!
      </p>
    </div>
  );
}

export default Investing;