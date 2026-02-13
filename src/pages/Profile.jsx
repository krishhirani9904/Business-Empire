// src/pages/Profile.jsx

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getProfileColors } from '../components/profile/profileTheme';
import { useProfileData } from '../components/profile/useProfileData';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs from '../components/profile/ProfileTabs';
import OverviewSection from '../components/profile/OverviewSection';
import ForbesSection from '../components/profile/ForbesSection';
import StatisticsSection from '../components/profile/StatisticsSection';
import SettingsSection from '../components/profile/SettingsSection';

function Profile() {
  const { isDarkTheme } = useTheme();
  const c = getProfileColors(isDarkTheme);
  const profileData = useProfileData();
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="max-w-full mx-auto pb-8">
      <ProfileHeader c={c} profileData={profileData} />

      <ProfileTabs
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        c={c}
      />

      {activeSection === 'overview' && (
        <OverviewSection c={c} profileData={profileData} />
      )}

      {activeSection === 'forbes' && (
        <ForbesSection c={c} profileData={profileData} />
      )}

      {activeSection === 'statistics' && (
        <StatisticsSection c={c} profileData={profileData} isDarkTheme={isDarkTheme} />
      )}

      {activeSection === 'settings' && (
        <SettingsSection c={c} profileData={profileData} />
      )}
    </div>
  );
}

export default Profile;