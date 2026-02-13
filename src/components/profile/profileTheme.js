// src/components/profile/profileTheme.js

export const getProfileColors = (isDarkTheme) => {
  const colors = {
    dark: {
      cardBg: 'bg-gray-900',
      cardBorder: 'border-gray-700',
      innerBg: 'bg-gray-800',
      innerBorder: 'border-gray-600',
      textPrimary: 'text-white',
      textSecondary: 'text-gray-400',
      textMuted: 'text-gray-500',
      hoverBg: 'hover:bg-gray-800',
      divider: 'divide-gray-700',
      inputBg: 'bg-gray-800',
      inputBorder: 'border-gray-600',
      inputText: 'text-white',
      dangerBg: 'bg-red-900/30',
      dangerBorder: 'border-red-700',
      progressBg: 'bg-gray-700',
    },
    light: {
      cardBg: 'bg-white',
      cardBorder: 'border-gray-200',
      innerBg: 'bg-gray-50',
      innerBorder: 'border-gray-200',
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-400',
      hoverBg: 'hover:bg-gray-50',
      divider: 'divide-gray-200',
      inputBg: 'bg-gray-100',
      inputBorder: 'border-gray-300',
      inputText: 'text-gray-900',
      dangerBg: 'bg-red-50',
      dangerBorder: 'border-red-200',
      progressBg: 'bg-gray-200',
    }
  };

  return isDarkTheme ? colors.dark : colors.light;
};

export const formatMoney = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${Math.floor(amount).toLocaleString('en-IN')}`;
};

export const formatMoneyFull = (amount) => {
  return `₹${Math.floor(amount).toLocaleString('en-IN')}`;
};