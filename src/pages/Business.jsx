// pages/Business.jsx
import { useTheme } from '../context/ThemeContext';
import { Briefcase } from 'lucide-react';

function Business() {
  const { isDarkTheme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="w-8 h-8 text-blue-500" />
        <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Business
        </h2>
      </div>
      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
        Manage and expand your business empire!
      </p>
    </div>
  );
}

export default Business;