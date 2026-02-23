// Number ne Indian currency format ma convert kare
// Example: 1500 -> "₹1.5K", 250000 -> "₹2.50L"
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const prefix = amount < 0 ? '-' : '';
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) {
    return `${prefix}₹${(absAmount / 10000000).toFixed(2)}Cr`;
  }
  if (absAmount >= 100000) {
    return `${prefix}₹${(absAmount / 100000).toFixed(2)}L`;
  }
  if (absAmount >= 1000) {
    return `${prefix}₹${(absAmount / 1000).toFixed(1)}K`;
  }
  
  // Small decimal prices (crypto like 0.0018)
  if (absAmount < 0.01 && absAmount > 0) return `${prefix}₹${absAmount.toFixed(6)}`;
  if (absAmount < 1 && absAmount > 0) return `${prefix}₹${absAmount.toFixed(4)}`;
  
  return `${prefix}₹${absAmount.toLocaleString('en-IN')}`;
};

export const formatCurrencyFull = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  return `₹${Math.floor(amount).toLocaleString('en-IN')}`;
};

export const formatNumber = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  const prefix = amount < 0 ? '-' : '';
  const absAmount = Math.abs(amount);

  if (absAmount >= 10000000) return `${prefix}${(absAmount / 10000000).toFixed(1)}Cr`;
  if (absAmount >= 100000) return `${prefix}${(absAmount / 100000).toFixed(1)}L`;
  if (absAmount >= 1000) return `${prefix}${(absAmount / 1000).toFixed(1)}K`;
  return amount.toLocaleString();
};

export const formatINR = formatCurrency;

export const formatMarketCap = (num) => {
  if (num === null || num === undefined) return '₹0';
  if (num >= 1000000000000) return `₹${(num / 1000000000000).toFixed(1)}T`;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)}L`;
  return `₹${num}`;
};