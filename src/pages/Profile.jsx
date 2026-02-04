// pages/Profile.jsx
import { useTheme } from '../context/ThemeContext';
import { User } from 'lucide-react';

function Profile() {
  const { isDarkTheme } = useTheme();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-8 h-8 text-pink-500" />
        <h2 className={`text-2xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
          Profile
        </h2>
      </div>
      <p className={`${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
        View and edit your profile settings!
      </p>
    </div>
  );
}

export default Profile;