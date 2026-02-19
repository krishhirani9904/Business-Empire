// ============================================
// 📄 FILE: src/components/items/itemsData.js
// 🎯 PURPOSE: All Items Data - Cars, Aircraft, Yachts, Collections, NFTs, Islands, Insignia
// 🔧 FIX Bug #5: formatCurrency imported from utils (no duplicate)
// ============================================

// 🔧 FIX: Import from single source instead of defining here
export { formatCurrency } from '../../utils/formatCurrency';

// ===== CARS =====
export const CARS = [
  {
    id: 'car_1',
    name: 'Velocity Spark',
    image: '🚗',
    basePrice: 500000,
    category: 'sedan',
    description: 'A sleek sedan with excellent fuel efficiency and smooth handling.',
    engineTypes: [
      { id: 'petrol', name: 'Petrol Engine', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'Diesel Engine', priceMultiplier: 1.08 },
      { id: 'hybrid', name: 'Hybrid Engine', priceMultiplier: 1.25 },
      { id: 'electric', name: 'Electric Motor', priceMultiplier: 1.45 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.3 },
      { id: 'luxury', name: 'Luxury', priceMultiplier: 1.6 }
    ]
  },
  {
    id: 'car_2',
    name: 'Thunder Blaze',
    image: '🏎️',
    basePrice: 1200000,
    category: 'sports',
    description: 'High-performance sports car with twin turbo engine and racing DNA.',
    engineTypes: [
      { id: 'petrol', name: 'Petrol V6', priceMultiplier: 1.0 },
      { id: 'turbo', name: 'Twin Turbo V8', priceMultiplier: 1.35 },
      { id: 'hybrid', name: 'Hybrid Sport', priceMultiplier: 1.5 },
      { id: 'electric', name: 'Electric Sport', priceMultiplier: 1.7 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.4 },
      { id: 'track', name: 'Track Edition', priceMultiplier: 1.8 }
    ]
  },
  {
    id: 'car_3',
    name: 'Royal Majesty',
    image: '🚙',
    basePrice: 3500000,
    category: 'luxury',
    description: 'Ultra-luxury sedan with handcrafted interior and whisper-quiet cabin.',
    engineTypes: [
      { id: 'petrol', name: 'V8 Petrol', priceMultiplier: 1.0 },
      { id: 'turbo', name: 'Twin Turbo V12', priceMultiplier: 1.4 },
      { id: 'hybrid', name: 'Hybrid Luxury', priceMultiplier: 1.55 },
      { id: 'electric', name: 'Electric Silent', priceMultiplier: 1.75 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Elegance', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Prestige', priceMultiplier: 1.35 },
      { id: 'bespoke', name: 'Bespoke', priceMultiplier: 1.9 }
    ]
  },
  {
    id: 'car_4',
    name: 'Storm Rider',
    image: '🚐',
    basePrice: 2200000,
    category: 'suv',
    description: 'Powerful SUV built for both city roads and off-road adventures.',
    engineTypes: [
      { id: 'petrol', name: 'Petrol V6', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'Diesel Turbo', priceMultiplier: 1.12 },
      { id: 'hybrid', name: 'Hybrid 4WD', priceMultiplier: 1.35 },
      { id: 'electric', name: 'Electric AWD', priceMultiplier: 1.6 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Adventure', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.3 },
      { id: 'offroad', name: 'Off-Road Pro', priceMultiplier: 1.55 }
    ]
  },
  {
    id: 'car_5',
    name: 'Eclipse GT',
    image: '🏎️',
    basePrice: 8500000,
    category: 'supercar',
    description: 'Mid-engine supercar with carbon fiber body and race-bred aerodynamics.',
    engineTypes: [
      { id: 'v8', name: 'V8 Naturally Aspirated', priceMultiplier: 1.0 },
      { id: 'v10', name: 'V10 Supercharged', priceMultiplier: 1.3 },
      { id: 'v12', name: 'V12 Twin Turbo', priceMultiplier: 1.65 },
      { id: 'hybrid', name: 'Hybrid Hyper', priceMultiplier: 1.85 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Sport', priceMultiplier: 1.0 },
      { id: 'race', name: 'Race Edition', priceMultiplier: 1.5 },
      { id: 'limited', name: 'Limited Edition', priceMultiplier: 2.0 }
    ]
  },
  {
    id: 'car_6',
    name: 'Nova Cruiser',
    image: '🚗',
    basePrice: 350000,
    category: 'hatchback',
    description: 'Compact city car perfect for daily commute with great mileage.',
    engineTypes: [
      { id: 'petrol', name: 'Petrol 1.2L', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'Diesel 1.5L', priceMultiplier: 1.1 },
      { id: 'cng', name: 'CNG Dual Fuel', priceMultiplier: 1.15 },
      { id: 'electric', name: 'Electric', priceMultiplier: 1.5 }
    ],
    equipmentLevels: [
      { id: 'base', name: 'Base', priceMultiplier: 1.0 },
      { id: 'mid', name: 'Mid Variant', priceMultiplier: 1.2 },
      { id: 'top', name: 'Top Model', priceMultiplier: 1.45 }
    ]
  },
  {
    id: 'car_7',
    name: 'Phantom Ultra',
    image: '🏎️',
    basePrice: 25000000,
    category: 'hypercar',
    description: 'Limited production hypercar with 1000+ HP and active aerodynamics.',
    engineTypes: [
      { id: 'v12', name: 'V12 Quad Turbo', priceMultiplier: 1.0 },
      { id: 'hybrid', name: 'Hybrid V12', priceMultiplier: 1.3 },
      { id: 'electric', name: 'Full Electric 1200HP', priceMultiplier: 1.6 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'track', name: 'Track Pack', priceMultiplier: 1.4 },
      { id: 'one_of_one', name: 'One of One', priceMultiplier: 2.5 }
    ]
  },
  {
    id: 'car_8',
    name: 'Apex Venom',
    image: '🏎️',
    basePrice: 45000000,
    category: 'hypercar',
    description: 'The ultimate hypercar. Only 50 units made worldwide. Pure speed.',
    engineTypes: [
      { id: 'v8_tt', name: 'V8 Twin Turbo 1100HP', priceMultiplier: 1.0 },
      { id: 'v12_na', name: 'V12 NA 1000HP', priceMultiplier: 1.2 },
      { id: 'hybrid', name: 'Hybrid 1500HP', priceMultiplier: 1.8 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Race Spec', priceMultiplier: 1.0 },
      { id: 'aero', name: 'Aero Package', priceMultiplier: 1.35 },
      { id: 'ultimate', name: 'Ultimate Edition', priceMultiplier: 2.2 }
    ]
  }
];

// ===== AIRCRAFT =====
export const AIRCRAFT = [
  {
    id: 'air_1',
    name: 'SkyHawk 200',
    image: '✈️',
    basePrice: 50000000,
    type: 'Private Jet',
    description: 'Light private jet for short to medium range business travel.',
    hireTeam: { name: 'Flight Crew (Pilot + Co-pilot)', priceMultiplier: 1.15 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Leather Interior', priceMultiplier: 1.35 },
      { id: 'vip', name: 'VIP Suite Interior', priceMultiplier: 1.7 }
    ]
  },
  {
    id: 'air_2',
    name: 'Eagle Express 500',
    image: '🛩️',
    basePrice: 120000000,
    type: 'Business Jet',
    description: 'Mid-size business jet with intercontinental range capability.',
    hireTeam: { name: 'Full Crew (3 Members)', priceMultiplier: 1.18 },
    designLevels: [
      { id: 'standard', name: 'Corporate Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Executive Suite', priceMultiplier: 1.4 },
      { id: 'royal', name: 'Royal Configuration', priceMultiplier: 1.85 }
    ]
  },
  {
    id: 'air_3',
    name: 'Falcon Global 7000',
    image: '✈️',
    basePrice: 350000000,
    type: 'Ultra Long Range',
    description: 'Ultra long range jet. Fly anywhere in the world non-stop.',
    hireTeam: { name: 'Premium Crew (5 Members)', priceMultiplier: 1.2 },
    designLevels: [
      { id: 'standard', name: 'Business Class', priceMultiplier: 1.0 },
      { id: 'first', name: 'First Class Suite', priceMultiplier: 1.5 },
      { id: 'palace', name: 'Flying Palace', priceMultiplier: 2.0 }
    ]
  },
  {
    id: 'air_4',
    name: 'Rotor King H160',
    image: '🚁',
    basePrice: 25000000,
    type: 'Helicopter',
    description: 'Modern helicopter for city-to-city travel and aerial tours.',
    hireTeam: { name: 'Pilot + Engineer', priceMultiplier: 1.12 },
    designLevels: [
      { id: 'standard', name: 'Standard Cabin', priceMultiplier: 1.0 },
      { id: 'premium', name: 'VIP Cabin', priceMultiplier: 1.3 },
      { id: 'luxury', name: 'Luxury Gold Interior', priceMultiplier: 1.6 }
    ]
  },
  {
    id: 'air_5',
    name: 'SkyPalace A340',
    image: '✈️',
    basePrice: 800000000,
    type: 'Private Airliner',
    description: 'Converted airliner with bedrooms, lounge, and conference room.',
    hireTeam: { name: 'Full Aviation Team (12 Members)', priceMultiplier: 1.25 },
    designLevels: [
      { id: 'standard', name: 'Executive Layout', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Presidential Suite', priceMultiplier: 1.6 },
      { id: 'ultimate', name: 'Sky Mansion', priceMultiplier: 2.5 }
    ]
  },
  {
    id: 'air_6',
    name: 'Thunder Drone X1',
    image: '🛸',
    basePrice: 8000000,
    type: 'Personal Drone',
    description: 'Futuristic personal air vehicle for short urban commutes.',
    hireTeam: { name: 'Remote Operator', priceMultiplier: 1.08 },
    designLevels: [
      { id: 'standard', name: 'Basic Pod', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Comfort Pod', priceMultiplier: 1.25 },
      { id: 'luxury', name: 'Luxury Capsule', priceMultiplier: 1.5 }
    ]
  }
];

// ===== YACHTS =====
export const YACHTS = [
  {
    id: 'yacht_1',
    name: 'Wave Runner 30',
    image: '🚤',
    basePrice: 15000000,
    type: 'Motor Yacht',
    description: 'Compact motor yacht perfect for coastal cruising.',
    hireTeam: { name: 'Crew (Captain + 2)', priceMultiplier: 1.12 },
    designLevels: [
      { id: 'standard', name: 'Standard Deck', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Teak Deck', priceMultiplier: 1.3 },
      { id: 'luxury', name: 'Luxury Marine Interior', priceMultiplier: 1.6 }
    ],
    locations: ['Mumbai Marina', 'Goa Harbor', 'Kochi Port']
  },
  {
    id: 'yacht_2',
    name: 'Ocean Star 60',
    image: '🛥️',
    basePrice: 80000000,
    type: 'Luxury Yacht',
    description: 'Full-size luxury yacht with sun deck and water toys.',
    hireTeam: { name: 'Full Crew (Captain + 6)', priceMultiplier: 1.18 },
    designLevels: [
      { id: 'standard', name: 'Classic Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Modern Luxury', priceMultiplier: 1.4 },
      { id: 'royal', name: 'Royal Suite', priceMultiplier: 1.8 }
    ],
    locations: ['Mumbai Marina', 'Goa Harbor', 'Kochi Port', 'Chennai Bay']
  },
  {
    id: 'yacht_3',
    name: 'Neptune 100',
    image: '🚢',
    basePrice: 250000000,
    type: 'Mega Yacht',
    description: 'Mega yacht with helipad, pool, and cinema room.',
    hireTeam: { name: 'Full Maritime Team (15 Members)', priceMultiplier: 1.22 },
    designLevels: [
      { id: 'standard', name: 'Executive Layout', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Ultra Luxury', priceMultiplier: 1.5 },
      { id: 'palace', name: 'Floating Palace', priceMultiplier: 2.0 }
    ],
    locations: ['Mumbai Marina', 'Goa Harbor', 'Dubai Creek', 'Monaco Port']
  },
  {
    id: 'yacht_4',
    name: 'Aqua Breeze 45',
    image: '⛵',
    basePrice: 35000000,
    type: 'Sailing Yacht',
    description: 'Elegant sailing yacht for the true nautical enthusiast.',
    hireTeam: { name: 'Sailing Crew (4 Members)', priceMultiplier: 1.15 },
    designLevels: [
      { id: 'standard', name: 'Classic Wood', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Modern Composite', priceMultiplier: 1.3 },
      { id: 'racing', name: 'Racing Edition', priceMultiplier: 1.55 }
    ],
    locations: ['Goa Harbor', 'Kochi Port', 'Vizag Bay']
  },
  {
    id: 'yacht_5',
    name: 'Titan Explorer',
    image: '🚢',
    basePrice: 500000000,
    type: 'Explorer Yacht',
    description: 'Go-anywhere explorer yacht with ice-class hull and submarine.',
    hireTeam: { name: 'Expedition Team (20 Members)', priceMultiplier: 1.28 },
    designLevels: [
      { id: 'standard', name: 'Expedition Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Research Premium', priceMultiplier: 1.45 },
      { id: 'ultimate', name: 'Ultimate Explorer', priceMultiplier: 2.2 }
    ],
    locations: ['Mumbai Marina', 'Dubai Creek', 'Singapore Port', 'Monaco Port']
  }
];

// ===== COLLECTIONS =====
export const COINS_COLLECTION = [
  { id: 'coin_1', name: 'Ancient Gold Mohur', image: '🪙', price: 50000, description: 'Mughal era gold coin from 1628 AD.' },
  { id: 'coin_2', name: 'Silver Dynasty Rupee', image: '🪙', price: 75000, description: 'Silver rupee from the Gupta dynasty.' },
  { id: 'coin_3', name: 'Copper Temple Token', image: '🪙', price: 25000, description: 'Rare copper token from ancient temple.' },
  { id: 'coin_4', name: 'Platinum Imperial', image: '🪙', price: 200000, description: 'Extremely rare platinum coin from British era.' },
  { id: 'coin_5', name: 'Bronze Maurya Karshapana', image: '🪙', price: 150000, description: 'Ancient Mauryan empire currency.' },
  { id: 'coin_6', name: 'Gold Fanam', image: '🪙', price: 120000, description: 'Tiny gold coin from South Indian kingdoms.' },
  { id: 'coin_7', name: 'Silver Punch Mark', image: '🪙', price: 95000, description: 'One of the earliest Indian coins ever made.' }
];

export const PAINTINGS_COLLECTION = [
  { id: 'paint_1', name: 'Sunset Over Mountains', image: '🖼️', price: 300000, description: 'Oil painting of Himalayan sunset.' },
  { id: 'paint_2', name: 'Royal Court Scene', image: '🖼️', price: 550000, description: 'Mughal miniature painting of royal durbar.' },
  { id: 'paint_3', name: 'Abstract Dreams', image: '🖼️', price: 420000, description: 'Modern abstract by contemporary artist.' },
  { id: 'paint_4', name: 'Village Life', image: '🖼️', price: 180000, description: 'Watercolor depicting Indian rural life.' },
  { id: 'paint_5', name: 'The Golden Temple', image: '🖼️', price: 750000, description: 'Photorealistic painting of the Golden Temple.' },
  { id: 'paint_6', name: 'Monsoon Evening', image: '🖼️', price: 280000, description: 'Impressionist style monsoon landscape.' },
  { id: 'paint_7', name: 'Digital Cosmos', image: '🖼️', price: 650000, description: 'AI-assisted digital art of the cosmos.' }
];

export const UNIQUE_ITEMS = [
  { id: 'unique_1', name: 'Ancient War Sword', image: '⚔️', price: 500000, description: 'Maratha era battle sword with gold hilt.' },
  { id: 'unique_2', name: 'Crystal Globe', image: '🔮', price: 350000, description: 'Hand-crafted crystal globe with gold map.' },
  { id: 'unique_3', name: 'Ivory Chess Set', image: '♟️', price: 800000, description: 'Antique chess set carved from rare wood.' },
  { id: 'unique_4', name: 'Vintage Telescope', image: '🔭', price: 250000, description: '19th century brass telescope from Royal Navy.' },
  { id: 'unique_5', name: 'Samurai Armor', image: '🛡️', price: 1200000, description: 'Authentic Japanese samurai armor set.' },
  { id: 'unique_6', name: 'Ancient Map Scroll', image: '📜', price: 400000, description: 'Hand-drawn maritime trade route map from 1750.' },
  { id: 'unique_7', name: 'Diamond Pocket Watch', image: '⌚', price: 950000, description: 'Swiss pocket watch encrusted with 24 diamonds.' }
];

export const RETRO_CARS = [
  { id: 'retro_1', name: 'Classic Roadster 1957', image: '🚗', year: 1957, price: 2500000, description: 'A beautiful classic roadster from the golden era of automobiles.' },
  { id: 'retro_2', name: 'Vintage Convertible 1965', image: '🚗', year: 1965, price: 3200000, description: 'Iconic convertible with chrome finish and leather seats.' },
  { id: 'retro_3', name: 'Muscle King 1970', image: '🚗', year: 1970, price: 4500000, description: 'American muscle car with thunderous V8 and racing stripes.' },
  { id: 'retro_4', name: 'Grand Tourer 1962', image: '🚗', year: 1962, price: 8000000, description: 'Italian grand tourer featured in classic spy movies.' },
  { id: 'retro_5', name: 'Safari Wagon 1975', image: '🚗', year: 1975, price: 1800000, description: 'Classic woody wagon perfect for vintage car shows.' },
  { id: 'retro_6', name: 'Silver Arrow 1938', image: '🚗', year: 1938, price: 15000000, description: 'Pre-war racing legend. Only 12 ever made.' },
  { id: 'retro_7', name: 'Royal Phantom 1955', image: '🚗', year: 1955, price: 12000000, description: 'Luxury limousine once owned by a Maharaja.' }
];

export const JEWELS_COLLECTION = [
  { id: 'jewel_1', name: 'Blue Sapphire Ring', image: '💎', price: 400000, description: 'Natural Sri Lankan sapphire in platinum setting.' },
  { id: 'jewel_2', name: 'Ruby Necklace', image: '💎', price: 650000, description: 'Burmese ruby necklace with diamond accents.' },
  { id: 'jewel_3', name: 'Emerald Bracelet', image: '💎', price: 550000, description: 'Colombian emerald bracelet in 22K gold.' },
  { id: 'jewel_4', name: 'Diamond Tiara', image: '👑', price: 1500000, description: 'Victorian era diamond tiara with 150 stones.' },
  { id: 'jewel_5', name: 'Pearl Earrings', image: '💎', price: 280000, description: 'South Sea pearl earrings with gold setting.' },
  { id: 'jewel_6', name: 'Tanzanite Pendant', image: '💎', price: 750000, description: 'Rare tanzanite stone in white gold pendant.' },
  { id: 'jewel_7', name: 'Opal Crown Brooch', image: '💎', price: 900000, description: 'Black opal brooch with intricate crown design.' }
];

export const STAMPS_COLLECTION = [
  { id: 'stamp_1', name: 'Penny Black 1840', image: '📮', price: 180000, description: 'World\'s first adhesive postage stamp.' },
  { id: 'stamp_2', name: 'Inverted Jenny', image: '📮', price: 350000, description: 'Famous US stamp with upside-down airplane.' },
  { id: 'stamp_3', name: 'British Guiana 1c', image: '📮', price: 500000, description: 'One of the rarest stamps in the world.' },
  { id: 'stamp_4', name: 'Indian Scinde Dawk', image: '📮', price: 220000, description: 'First stamp of Asia, issued in 1852.' },
  { id: 'stamp_5', name: 'Mauritius Post Office', image: '📮', price: 450000, description: 'Rare Mauritius stamp from 1847.' },
  { id: 'stamp_6', name: 'Cape Triangle', image: '📮', price: 280000, description: 'Triangular stamp from Cape of Good Hope.' },
  { id: 'stamp_7', name: 'Swedish Treskilling Yellow', image: '📮', price: 600000, description: 'Misprinted Swedish stamp worth millions.' }
];

// ===== INSIGNIA (Achievements) =====
export const INSIGNIA = [
  {
    id: 'insignia_1',
    name: 'The Owner',
    icon: '🏠',
    description: 'Own 5 businesses of any type',
    requirement: { type: 'business_count', count: 5 },
    rewardAmount: 50000
  },
  {
    id: 'insignia_2',
    name: 'Monopoly King',
    icon: '🎩',
    description: 'Own 10 businesses of the same type',
    requirement: { type: 'same_business_count', count: 10 },
    rewardAmount: 200000
  },
  {
    id: 'insignia_3',
    name: 'Empire Builder',
    icon: '🏰',
    description: 'Own 15 businesses and 2 mergers',
    requirement: { type: 'empire', businessCount: 15, mergerCount: 2 },
    rewardAmount: 500000
  },
  {
    id: 'insignia_4',
    name: 'Stock Mogul',
    icon: '📈',
    description: 'Own stocks worth ₹50 Lakhs or more',
    requirement: { type: 'stock_value', value: 5000000 },
    rewardAmount: 300000
  },
  {
    id: 'insignia_5',
    name: 'Crorepati',
    icon: '💰',
    description: 'Have ₹1 Crore balance at once',
    requirement: { type: 'balance', value: 10000000 },
    rewardAmount: 100000
  },
  {
    id: 'insignia_6',
    name: 'Car Collector',
    icon: '🚗',
    description: 'Own 5 or more cars',
    requirement: { type: 'item_count', category: 'Cars', count: 5 },
    rewardAmount: 150000
  },
  {
    id: 'insignia_7',
    name: 'Art Connoisseur',
    icon: '🎨',
    description: 'Own 5 or more paintings',
    requirement: { type: 'item_count', category: 'Paintings', count: 5 },
    rewardAmount: 120000
  },
  {
    id: 'insignia_8',
    name: 'Island Tycoon',
    icon: '🏝️',
    description: 'Own 2 or more private islands',
    requirement: { type: 'item_count', category: 'Islands', count: 2 },
    rewardAmount: 1000000
  }
];

// ===== NFTs =====
export const NFTS = [
  { id: 'nft_1', name: 'Pixel Warrior #001', image: '🤖', price: 500000, collection: 'Pixel Warriors', rarity: 'Common', description: 'A brave pixel warrior from the digital realm.' },
  { id: 'nft_2', name: 'Cyber Ape #042', image: '🦍', price: 1200000, collection: 'Cyber Apes', rarity: 'Rare', description: 'Futuristic ape with neon cybernetic implants.' },
  { id: 'nft_3', name: 'Cosmic Cat #007', image: '🐱', price: 800000, collection: 'Cosmic Cats', rarity: 'Rare', description: 'A cat floating through the cosmic void.' },
  { id: 'nft_4', name: 'Dragon Lord #100', image: '🐉', price: 3500000, collection: 'Dragon Lords', rarity: 'Epic', description: 'Ancient dragon lord with fire breathing ability.' },
  { id: 'nft_5', name: 'Golden Phoenix #001', image: '🦅', price: 8000000, collection: 'Mythical Beasts', rarity: 'Legendary', description: 'The rarest phoenix. Only 1 exists.' },
  { id: 'nft_6', name: 'Neon Skull #055', image: '💀', price: 650000, collection: 'Neon Skulls', rarity: 'Common', description: 'Glowing neon skull from the underworld.' },
  { id: 'nft_7', name: 'Robot Samurai #033', image: '🤖', price: 2200000, collection: 'Mech Warriors', rarity: 'Epic', description: 'A samurai rebuilt with advanced robotics.' },
  { id: 'nft_8', name: 'Crystal Unicorn #010', image: '🦄', price: 5500000, collection: 'Mythical Beasts', rarity: 'Legendary', description: 'Unicorn made entirely of living crystal.' }
];

// ===== ISLANDS =====
export const ISLANDS = [
  { id: 'island_1', name: 'Palm Cove Island', image: '🏝️', price: 50000000, size: '2.5 acres', location: 'Arabian Sea', description: 'Tropical island with white sandy beaches and palm trees.' },
  { id: 'island_2', name: 'Emerald Isle', image: '🏝️', price: 120000000, size: '8 acres', location: 'Indian Ocean', description: 'Lush green island with waterfall and natural lagoon.' },
  { id: 'island_3', name: 'Coral Reef Paradise', image: '🏝️', price: 85000000, size: '5 acres', location: 'Bay of Bengal', description: 'Surrounded by pristine coral reefs teeming with marine life.' },
  { id: 'island_4', name: 'Sunset Haven', image: '🏝️', price: 200000000, size: '15 acres', location: 'Pacific Ocean', description: 'Large island with mountain, forest, and private airstrip.' },
  { id: 'island_5', name: 'Dragon Rock Island', image: '🏝️', price: 350000000, size: '25 acres', location: 'South China Sea', description: 'Volcanic island with hot springs and dramatic rock formations.' },
  { id: 'island_6', name: 'Crystal Waters Atoll', image: '🏝️', price: 500000000, size: '40 acres', location: 'Maldives Region', description: 'Ring-shaped coral atoll with crystal clear turquoise waters.' },
  { id: 'island_7', name: 'Northern Star Isle', image: '🏝️', price: 75000000, size: '4 acres', location: 'Lakshadweep Sea', description: 'Secluded island with dense coconut groves and calm waters.' }
];