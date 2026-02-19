// ============================================
// 📄 FILE: src/components/investing/investingData.js
// 🎯 PURPOSE: Stocks, Properties, Crypto nu static data
// 🔧 FIX: formatINR, formatMarketCap imported from utils (no duplicate)
// ============================================

// 🔧 FIX Bug #5: Import from single source instead of defining here
export { formatCurrency, formatINR, formatMarketCap } from '../../utils/formatCurrency';

// =====================
// 📈 STOCKS DATA
// =====================

export const STOCKS = [
  {
    id: 'teksft',
    name: 'TekSoft',
    fullName: 'TekSoft Consultancy Services',
    sector: 'IT',
    price: 3850,
    dividendYield: 1.2,
    capitalization: 1400000,
    volatility: 5,
    category: ['stable'],
    logo: '💻'
  },
  {
    id: 'relianz',
    name: 'Relianz',
    fullName: 'Relianz Industries Ltd',
    sector: 'Oil & Gas',
    price: 2950,
    dividendYield: 0.3,
    capitalization: 2000000,
    volatility: 7,
    category: ['growth'],
    logo: '🛢️'
  },
  {
    id: 'hdb_bank',
    name: 'HDB Bank',
    fullName: 'HDB Bank Limited',
    sector: 'Banking',
    price: 1680,
    dividendYield: 1.1,
    capitalization: 1250000,
    volatility: 4,
    category: ['stable'],
    logo: '🏦'
  },
  {
    id: 'infosyz',
    name: 'Infosyz',
    fullName: 'Infosyz Limited',
    sector: 'IT',
    price: 1520,
    dividendYield: 2.5,
    capitalization: 630000,
    volatility: 6,
    category: ['stable', 'dividend'],
    logo: '🖥️'
  },
  {
    id: 'ibc',
    name: 'IBC',
    fullName: 'IBC Limited',
    sector: 'FMCG',
    price: 465,
    dividendYield: 3.2,
    capitalization: 580000,
    volatility: 3,
    category: ['stable', 'dividend'],
    logo: '🚬'
  },
  {
    id: 'adaani_ent',
    name: 'Adaani Ent.',
    fullName: 'Adaani Enterprises',
    sector: 'Conglomerate',
    price: 2800,
    dividendYield: 0.1,
    capitalization: 320000,
    volatility: 10,
    category: ['growth'],
    logo: '⚡'
  },
  {
    id: 'tatva_motors',
    name: 'Tatva Motors',
    fullName: 'Tatva Motors Limited',
    sector: 'Automobile',
    price: 950,
    dividendYield: 0.4,
    capitalization: 350000,
    volatility: 8,
    category: ['growth'],
    logo: '🚗'
  },
  {
    id: 'suryapharma',
    name: 'Surya Pharma',
    fullName: 'Surya Pharmaceutical',
    sector: 'Pharma',
    price: 1680,
    dividendYield: 0.8,
    capitalization: 400000,
    volatility: 6,
    category: ['growth'],
    logo: '💊'
  },
  {
    id: 'koylacorp',
    name: 'Koyla Corp',
    fullName: 'Koyla Corporation Limited',
    sector: 'Mining',
    price: 450,
    dividendYield: 5.2,
    capitalization: 280000,
    volatility: 4,
    category: ['dividend'],
    logo: '⛏️'
  },
  {
    id: 'quickpay',
    name: 'QuickPay',
    fullName: 'QuickPay Communications',
    sector: 'Fintech',
    price: 380,
    dividendYield: 0.0,
    capitalization: 24000,
    volatility: 10,
    category: ['growth'],
    logo: '📲'
  }
];


// =====================
// 🏠 PROPERTIES DATA
// =====================

export const PROPERTIES = [
  {
    id: 'prop_1',
    name: '1BHK Apartment',
    location: 'Navpur Suburbs',
    price: 3500000,
    rentalIncomePerHour: 150,
    image: '🏢',
    type: 'apartment',
    improvements: [
      { id: 'paint', name: 'Fresh Paint', cost: 50000, bonusIncome: 20 },
      { id: 'furniture', name: 'Modern Furniture', cost: 150000, bonusIncome: 40 },
      { id: 'smart_home', name: 'Smart Home Setup', cost: 300000, bonusIncome: 80 }
    ]
  },
  {
    id: 'prop_2',
    name: '2BHK Flat',
    location: 'Rajpur NCR',
    price: 5500000,
    rentalIncomePerHour: 250,
    image: '🏠',
    type: 'flat',
    improvements: [
      { id: 'paint', name: 'Premium Paint', cost: 80000, bonusIncome: 30 },
      { id: 'furniture', name: 'Designer Furniture', cost: 250000, bonusIncome: 60 },
      { id: 'garden', name: 'Rooftop Garden', cost: 400000, bonusIncome: 100 }
    ]
  },
  {
    id: 'prop_3',
    name: '3BHK Villa',
    location: 'Greenpur',
    price: 12000000,
    rentalIncomePerHour: 550,
    image: '🏡',
    type: 'villa',
    improvements: [
      { id: 'pool', name: 'Swimming Pool', cost: 500000, bonusIncome: 80 },
      { id: 'landscape', name: 'Landscaping', cost: 300000, bonusIncome: 50 },
      { id: 'solar', name: 'Solar Panels', cost: 600000, bonusIncome: 120 },
      { id: 'theater', name: 'Home Theater', cost: 800000, bonusIncome: 150 }
    ]
  },
  {
    id: 'prop_4',
    name: 'Commercial Shop',
    location: 'Vyapar Nagar',
    price: 8000000,
    rentalIncomePerHour: 400,
    image: '🏪',
    type: 'commercial',
    improvements: [
      { id: 'signage', name: 'LED Signage', cost: 100000, bonusIncome: 40 },
      { id: 'ac', name: 'Central AC', cost: 250000, bonusIncome: 70 },
      { id: 'security', name: 'Security System', cost: 350000, bonusIncome: 90 }
    ]
  },
  {
    id: 'prop_5',
    name: 'Penthouse',
    location: 'Samundarpur',
    price: 35000000,
    rentalIncomePerHour: 1500,
    image: '🌇',
    type: 'penthouse',
    improvements: [
      { id: 'jacuzzi', name: 'Jacuzzi', cost: 800000, bonusIncome: 150 },
      { id: 'helipad', name: 'Helipad', cost: 2000000, bonusIncome: 400 },
      { id: 'butler', name: 'Butler Service', cost: 500000, bonusIncome: 200 },
      { id: 'wine', name: 'Wine Cellar', cost: 1000000, bonusIncome: 250 }
    ]
  },
  {
    id: 'prop_6',
    name: 'Farmhouse',
    location: 'Parvat Hills',
    price: 20000000,
    rentalIncomePerHour: 900,
    image: '🌾',
    type: 'farmhouse',
    improvements: [
      { id: 'stables', name: 'Horse Stables', cost: 700000, bonusIncome: 120 },
      { id: 'organic', name: 'Organic Farm', cost: 500000, bonusIncome: 150 },
      { id: 'guest', name: 'Guest Cottage', cost: 1200000, bonusIncome: 280 }
    ]
  }
];


// =====================
// ₿ CRYPTOCURRENCY DATA
// =====================

export const CRYPTOCURRENCIES = [
  {
    id: 'nvc',
    name: 'NovaCoin',
    symbol: 'NVC',
    price: 5500000,
    change24h: 2.5,
    marketCap: 105000000000000,
    volatility: 8,
    category: 'hot',
    logo: '🪙'
  },
  {
    id: 'ethr',
    name: 'Etheron',
    symbol: 'ETHR',
    price: 310000,
    change24h: 3.1,
    marketCap: 37000000000000,
    volatility: 9,
    category: 'hot',
    logo: '💎'
  },
  {
    id: 'bxb',
    name: 'BXB Chain',
    symbol: 'BXB',
    price: 52000,
    change24h: -1.2,
    marketCap: 8000000000000,
    volatility: 7,
    category: 'hot',
    logo: '🔶'
  },
  {
    id: 'slrs',
    name: 'Solaris',
    symbol: 'SLRS',
    price: 14500,
    change24h: 5.8,
    marketCap: 6200000000000,
    volatility: 10,
    category: 'gainer',
    logo: '☀️'
  },
  {
    id: 'rpx',
    name: 'RippleX',
    symbol: 'RPX',
    price: 180,
    change24h: -0.8,
    marketCap: 9500000000000,
    volatility: 6,
    category: 'hot',
    logo: '✕'
  },
  {
    id: 'pupy',
    name: 'PuppyCoin',
    symbol: 'PUPY',
    price: 26,
    change24h: -3.2,
    marketCap: 3700000000000,
    volatility: 10,
    category: 'loser',
    logo: '🐕'
  },
  {
    id: 'avlx',
    name: 'AvaLynx',
    symbol: 'AVLX',
    price: 4500,
    change24h: 6.5,
    marketCap: 1600000000000,
    volatility: 10,
    category: 'gainer',
    logo: '🔺'
  },
  {
    id: 'akit',
    name: 'Akita Doge',
    symbol: 'AKIT',
    price: 0.0018,
    change24h: -5.5,
    marketCap: 1000000000000,
    volatility: 10,
    category: 'loser',
    logo: '🐶'
  }
];


// =====================
// 📊 HELPER FUNCTIONS
// =====================

// 📖 Random Chart Data Generator
export const generateChartData = (basePrice, volatility, points = 30) => {
  const data = [];
  let price = basePrice;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * (volatility / 100) * price;
    price = Math.max(price * 0.5, price + change);

    data.push({
      day: i + 1,
      price: Math.round(price * 100) / 100
    });
  }
  return data;
};