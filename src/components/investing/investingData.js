// src/components/investing/investingData.js

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
    id: 'dbi',
    name: 'DBI',
    fullName: 'Desh Bank of India',
    sector: 'Banking',
    price: 780,
    dividendYield: 1.8,
    capitalization: 700000,
    volatility: 5,
    category: ['stable', 'dividend'],
    logo: '🏛️'
  },
  {
    id: 'bhaarti',
    name: 'Bhaarti Telco',
    fullName: 'Bhaarti Telecom Limited',
    sector: 'Telecom',
    price: 1580,
    dividendYield: 0.5,
    capitalization: 890000,
    volatility: 6,
    category: ['growth'],
    logo: '📱'
  },
  {
    id: 'vypro',
    name: 'Vypro',
    fullName: 'Vypro Limited',
    sector: 'IT',
    price: 480,
    dividendYield: 1.5,
    capitalization: 260000,
    volatility: 5,
    category: ['stable'],
    logo: '🌐'
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
    id: 'hbl',
    name: 'HBL',
    fullName: 'Hindustan BrandCo Limited',
    sector: 'FMCG',
    price: 2520,
    dividendYield: 1.7,
    capitalization: 590000,
    volatility: 3,
    category: ['stable', 'dividend'],
    logo: '🧴'
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
    id: 'oegc',
    name: 'OEGC',
    fullName: 'Oil & Energy Gas Corp',
    sector: 'Oil & Gas',
    price: 280,
    dividendYield: 4.0,
    capitalization: 350000,
    volatility: 5,
    category: ['dividend'],
    logo: '🔥'
  },
  {
    id: 'khaana',
    name: 'Khaana',
    fullName: 'Khaana FoodTech Limited',
    sector: 'Food Tech',
    price: 240,
    dividendYield: 0.0,
    capitalization: 210000,
    volatility: 9,
    category: ['growth'],
    logo: '🍕'
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
  },
  {
    id: 'powernet',
    name: 'PowerNET',
    fullName: 'PowerNET Grid Corp',
    sector: 'Power',
    price: 310,
    dividendYield: 4.5,
    capitalization: 290000,
    volatility: 3,
    category: ['stable', 'dividend'],
    logo: '🔌'
  },
  {
    id: 'tatva_steel',
    name: 'Tatva Steel',
    fullName: 'Tatva Steel Limited',
    sector: 'Steel',
    price: 155,
    dividendYield: 2.8,
    capitalization: 190000,
    volatility: 7,
    category: ['dividend'],
    logo: '🏗️'
  }
];

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
    name: 'Studio Apartment',
    location: 'Techpur',
    price: 2800000,
    rentalIncomePerHour: 120,
    image: '🏬',
    type: 'studio',
    improvements: [
      { id: 'paint', name: 'Wall Art', cost: 30000, bonusIncome: 15 },
      { id: 'furniture', name: 'Compact Furniture', cost: 100000, bonusIncome: 35 },
      { id: 'gym', name: 'Mini Gym', cost: 200000, bonusIncome: 60 }
    ]
  },
  {
    id: 'prop_4',
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
    id: 'prop_5',
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
    id: 'prop_6',
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
    id: 'prop_7',
    name: 'Office Space',
    location: 'IT Valley',
    price: 15000000,
    rentalIncomePerHour: 700,
    image: '🏗️',
    type: 'office',
    improvements: [
      { id: 'cowork', name: 'Co-working Setup', cost: 400000, bonusIncome: 100 },
      { id: 'cafeteria', name: 'Cafeteria', cost: 600000, bonusIncome: 130 },
      { id: 'parking', name: 'Basement Parking', cost: 800000, bonusIncome: 180 }
    ]
  },
  {
    id: 'prop_8',
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
  },
  {
    id: 'prop_9',
    name: 'Beach House',
    location: 'Sagar Tatt',
    price: 25000000,
    rentalIncomePerHour: 1100,
    image: '🏖️',
    type: 'beach',
    improvements: [
      { id: 'deck', name: 'Sun Deck', cost: 400000, bonusIncome: 80 },
      { id: 'boat', name: 'Private Dock', cost: 1500000, bonusIncome: 300 },
      { id: 'bar', name: 'Beach Bar', cost: 800000, bonusIncome: 200 }
    ]
  },
  {
    id: 'prop_10',
    name: 'Shopping Mall',
    location: 'Udyog Vihar',
    price: 100000000,
    rentalIncomePerHour: 5000,
    image: '🛒',
    type: 'mall',
    improvements: [
      { id: 'multiplex', name: 'Multiplex Cinema', cost: 5000000, bonusIncome: 800 },
      { id: 'food_court', name: 'Food Court', cost: 3000000, bonusIncome: 600 },
      { id: 'gaming', name: 'Gaming Zone', cost: 2000000, bonusIncome: 500 },
      { id: 'parking_lot', name: 'Multi-level Parking', cost: 4000000, bonusIncome: 700 }
    ]
  }
];

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
    id: 'cdx',
    name: 'Cardex',
    symbol: 'CDX',
    price: 75,
    change24h: 1.5,
    marketCap: 2600000000000,
    volatility: 7,
    category: 'gainer',
    logo: '🔵'
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
    id: 'pknt',
    name: 'PolkaNet',
    symbol: 'PKNT',
    price: 950,
    change24h: -2.1,
    marketCap: 1200000000000,
    volatility: 8,
    category: 'loser',
    logo: '⊙'
  },
  {
    id: 'plhd',
    name: 'Polyhedra',
    symbol: 'PLHD',
    price: 120,
    change24h: 4.2,
    marketCap: 1100000000000,
    volatility: 9,
    category: 'gainer',
    logo: '🟣'
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
    id: 'cbrg',
    name: 'ChainBridge',
    symbol: 'CBRG',
    price: 1850,
    change24h: 1.8,
    marketCap: 1050000000000,
    volatility: 7,
    category: 'hot',
    logo: '⬡'
  },
  {
    id: 'akit',
    name: 'Akita Doge',
    symbol: 'AKIT',
    price: 0.85,
    change24h: -5.5,
    marketCap: 1000000000000,
    volatility: 10,
    category: 'loser',
    logo: '🐶'
  },
  {
    id: 'ltnd',
    name: 'LiteNode',
    symbol: 'LTND',
    price: 11000,
    change24h: -0.5,
    marketCap: 820000000000,
    volatility: 6,
    category: 'loser',
    logo: '⚡'
  },
  {
    id: 'udex',
    name: 'UniDex',
    symbol: 'UDEX',
    price: 1250,
    change24h: 3.8,
    marketCap: 750000000000,
    volatility: 8,
    category: 'gainer',
    logo: '🦄'
  },
  {
    id: 'cosm',
    name: 'Cosmara',
    symbol: 'COSM',
    price: 1100,
    change24h: 2.2,
    marketCap: 420000000000,
    volatility: 7,
    category: 'hot',
    logo: '⚛️'
  }
];

// Helper: generate random price chart data
export const generateChartData = (basePrice, volatility, points = 30) => {
  const data = [];
  let price = basePrice;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * (volatility / 100) * price;
    price = Math.max(price * 0.5, price + change);
    data.push({
      day: i + 1,
      price: Math.round(price * 10000) / 10000
    });
  }
  return data;
};

// FIXED: Handles negative numbers and micro prices
export const formatINR = (num) => {
  if (num === undefined || num === null || isNaN(num)) return '₹0';

  const isNegative = num < 0;
  const abs = Math.abs(num);
  let formatted;

  if (abs >= 10000000) {
    formatted = `₹${(abs / 10000000).toFixed(2)} Cr`;
  } else if (abs >= 100000) {
    formatted = `₹${(abs / 100000).toFixed(2)} L`;
  } else if (abs >= 1000) {
    formatted = `₹${(abs / 1000).toFixed(1)}K`;
  } else if (abs < 1 && abs > 0) {
    formatted = `₹${abs.toFixed(4)}`;
  } else {
    formatted = `₹${abs.toFixed(2)}`;
  }

  return isNegative ? `-${formatted}` : formatted;
};

export const formatMarketCap = (num) => {
  if (num >= 1000000000000) return `₹${(num / 1000000000000).toFixed(1)}T`;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(1)} L`;
  return `₹${num}`;
};