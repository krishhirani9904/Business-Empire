// src/components/items/itemsData.js

export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};

// ===== CARS =====
export const CARS = [
  {
    id: 'car_1',
    name: 'Velocity Spark',
    image: '🚗',
    basePrice: 500000,
    category: 'sedan',
    engineTypes: [
      { id: 'petrol', name: 'Petrol Engine', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'Diesel Engine', priceMultiplier: 1.08 },
      { id: 'hybrid', name: 'Hybrid Engine', priceMultiplier: 1.25 },
      { id: 'electric', name: 'Electric Motor', priceMultiplier: 1.45 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.3 }
    ]
  },
  {
    id: 'car_2',
    name: 'Thunder Blaze',
    image: '🏎️',
    basePrice: 1200000,
    category: 'sports',
    engineTypes: [
      { id: 'petrol', name: 'Petrol V6', priceMultiplier: 1.0 },
      { id: 'turbo', name: 'Twin Turbo V8', priceMultiplier: 1.35 },
      { id: 'hybrid', name: 'Hybrid Sport', priceMultiplier: 1.5 },
      { id: 'electric', name: 'Electric Sport', priceMultiplier: 1.7 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.4 }
    ]
  },
  {
    id: 'car_3',
    name: 'Royal Majesty',
    image: '🚙',
    basePrice: 3500000,
    category: 'luxury',
    engineTypes: [
      { id: 'petrol', name: 'V8 Petrol', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'V6 Diesel', priceMultiplier: 1.1 },
      { id: 'hybrid', name: 'Plug-in Hybrid', priceMultiplier: 1.4 },
      { id: 'electric', name: 'Full Electric', priceMultiplier: 1.6 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.35 }
    ]
  },
  {
    id: 'car_4',
    name: 'Storm Rider',
    image: '🛻',
    basePrice: 2200000,
    category: 'suv',
    engineTypes: [
      { id: 'petrol', name: 'V6 Petrol', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'Turbo Diesel', priceMultiplier: 1.12 },
      { id: 'hybrid', name: 'Mild Hybrid', priceMultiplier: 1.3 },
      { id: 'electric', name: 'Electric AWD', priceMultiplier: 1.55 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.28 }
    ]
  },
  {
    id: 'car_5',
    name: 'Eclipse GT',
    image: '🏎️',
    basePrice: 8500000,
    category: 'supercar',
    engineTypes: [
      { id: 'v10', name: 'V10 Naturally Aspirated', priceMultiplier: 1.0 },
      { id: 'v12', name: 'V12 Twin Turbo', priceMultiplier: 1.45 },
      { id: 'hybrid', name: 'Hybrid Hypercar', priceMultiplier: 1.8 },
      { id: 'electric', name: 'Electric Hyper', priceMultiplier: 2.0 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.5 }
    ]
  },
  {
    id: 'car_6',
    name: 'Nova Cruiser',
    image: '🚗',
    basePrice: 350000,
    category: 'hatchback',
    engineTypes: [
      { id: 'petrol', name: 'Petrol 1.2L', priceMultiplier: 1.0 },
      { id: 'diesel', name: 'Diesel 1.5L', priceMultiplier: 1.1 },
      { id: 'cng', name: 'CNG', priceMultiplier: 1.05 },
      { id: 'electric', name: 'Electric', priceMultiplier: 1.6 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.2 }
    ]
  },
  {
    id: 'car_7',
    name: 'Phantom Ultra',
    image: '🚘',
    basePrice: 15000000,
    category: 'hypercar',
    engineTypes: [
      { id: 'v12', name: 'W16 Quad Turbo', priceMultiplier: 1.0 },
      { id: 'hybrid', name: 'Hybrid Hyper', priceMultiplier: 1.6 },
      { id: 'electric', name: 'Full Electric', priceMultiplier: 2.2 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.6 }
    ]
  },
  {
    id: 'car_8',
    name: 'Apex Venom',
    image: '🏎️',
    basePrice: 25000000,
    category: 'hypercar',
    engineTypes: [
      { id: 'v8tt', name: 'V8 Twin Turbo', priceMultiplier: 1.0 },
      { id: 'v10', name: 'V10 Supercharged', priceMultiplier: 1.3 },
      { id: 'hybrid', name: 'Hybrid Beast', priceMultiplier: 1.7 }
    ],
    equipmentLevels: [
      { id: 'standard', name: 'Standard', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium', priceMultiplier: 1.55 }
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
    hireTeam: { name: 'Flight Crew', priceMultiplier: 1.15 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Luxury Interior', priceMultiplier: 1.35 }
    ]
  },
  {
    id: 'air_2',
    name: 'AeroStar 500',
    image: '🛩️',
    basePrice: 120000000,
    type: 'Business Jet',
    hireTeam: { name: 'Professional Crew', priceMultiplier: 1.2 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium VIP Interior', priceMultiplier: 1.4 }
    ]
  },
  {
    id: 'air_3',
    name: 'Titan Glide X',
    image: '✈️',
    basePrice: 300000000,
    type: 'Ultra Long Range Jet',
    hireTeam: { name: 'Elite Crew & Staff', priceMultiplier: 1.25 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Gold Interior', priceMultiplier: 1.5 }
    ]
  },
  {
    id: 'air_4',
    name: 'Heli-Prime 100',
    image: '🚁',
    basePrice: 25000000,
    type: 'Helicopter',
    hireTeam: { name: 'Pilot & Co-pilot', priceMultiplier: 1.1 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Interior', priceMultiplier: 1.25 }
    ]
  },
  {
    id: 'air_5',
    name: 'CloudMaster 777',
    image: '✈️',
    basePrice: 800000000,
    type: 'Jumbo Private Jet',
    hireTeam: { name: 'Full Flight Operations Team', priceMultiplier: 1.3 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Royal Suite Interior', priceMultiplier: 1.6 }
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
    hireTeam: { name: 'Crew (Captain + 2)', priceMultiplier: 1.12 },
    designLevels: [
      { id: 'standard', name: 'Standard Deck', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Teak Deck', priceMultiplier: 1.3 }
    ],
    locations: ['Mumbai Marina', 'Goa Harbor', 'Kochi Port']
  },
  {
    id: 'yacht_2',
    name: 'Ocean Pearl 60',
    image: '🛥️',
    basePrice: 80000000,
    type: 'Super Yacht',
    hireTeam: { name: 'Full Crew (8 members)', priceMultiplier: 1.2 },
    designLevels: [
      { id: 'standard', name: 'Standard Interior', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Premium Marble Interior', priceMultiplier: 1.4 }
    ],
    locations: ['Dubai Marina', 'Monaco Port', 'Singapore Harbor']
  },
  {
    id: 'yacht_3',
    name: 'Neptune Grand 100',
    image: '🚢',
    basePrice: 250000000,
    type: 'Mega Yacht',
    hireTeam: { name: 'Professional Crew (20 members)', priceMultiplier: 1.25 },
    designLevels: [
      { id: 'standard', name: 'Standard Luxury', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Ultra Premium Gold', priceMultiplier: 1.5 }
    ],
    locations: ['Mediterranean Sea', 'Caribbean', 'Maldives']
  },
  {
    id: 'yacht_4',
    name: 'Poseidon Elite 150',
    image: '🚢',
    basePrice: 600000000,
    type: 'Giga Yacht',
    hireTeam: { name: 'Elite Crew (40 members)', priceMultiplier: 1.3 },
    designLevels: [
      { id: 'standard', name: 'Standard Platinum', priceMultiplier: 1.0 },
      { id: 'premium', name: 'Diamond Luxury', priceMultiplier: 1.6 }
    ],
    locations: ['French Riviera', 'Bahamas', 'Seychelles', 'Fiji']
  }
];

// ===== COLLECTIONS =====
export const COINS_COLLECTION = [
  { id: 'coin_1', name: 'Ancient Gold Coin', image: '🪙', price: 50000 },
  { id: 'coin_2', name: 'Silver Dynasty Coin', image: '🪙', price: 75000 },
  { id: 'coin_3', name: 'Royal Mughal Coin', image: '🪙', price: 150000 },
  { id: 'coin_4', name: 'Rare Bronze Coin', image: '🪙', price: 200000 },
  { id: 'coin_5', name: 'Emperor\'s Gold Coin', image: '🪙', price: 500000 },
  { id: 'coin_6', name: 'Diamond Encrusted Coin', image: '💰', price: 1200000 }
];

export const PAINTINGS_COLLECTION = [
  { id: 'paint_1', name: 'Sunset Over Mountains', image: '🖼️', price: 300000 },
  { id: 'paint_2', name: 'The Golden Temple', image: '🎨', price: 800000 },
  { id: 'paint_3', name: 'Abstract Dreams', image: '🖼️', price: 1500000 },
  { id: 'paint_4', name: 'Portrait of a King', image: '🎨', price: 3000000 },
  { id: 'paint_5', name: 'Starry River Night', image: '🖼️', price: 5000000 },
  { id: 'paint_6', name: 'The Last Empire', image: '🎨', price: 10000000 }
];

export const UNIQUE_ITEMS = [
  { id: 'unique_1', name: 'Ancient Sword', image: '⚔️', price: 400000 },
  { id: 'unique_2', name: 'Royal Crown Replica', image: '👑', price: 1000000 },
  { id: 'unique_3', name: 'Diamond Skull', image: '💀', price: 2500000 },
  { id: 'unique_4', name: 'Emerald Scepter', image: '🏆', price: 5000000 },
  { id: 'unique_5', name: 'Pharaoh\'s Mask', image: '🎭', price: 8000000 },
  { id: 'unique_6', name: 'Holy Grail Replica', image: '🏆', price: 15000000 }
];

export const RETRO_CARS = [
  { id: 'retro_1', name: 'Classic Roadster 1957', image: '🚗', year: 1957, price: 2500000, description: 'A beautiful classic roadster from the golden era of motoring. Chrome details and leather interior.' },
  { id: 'retro_2', name: 'Vintage Coupe 1965', image: '🚙', year: 1965, price: 4000000, description: 'Elegant vintage coupe with original paint and engine. A true collector\'s dream.' },
  { id: 'retro_3', name: 'Muscle Thunder 1969', image: '🏎️', year: 1969, price: 6500000, description: 'Iconic muscle car with a roaring V8 engine. Symbol of raw American power.' },
  { id: 'retro_4', name: 'Royal Sedan 1940', image: '🚗', year: 1940, price: 12000000, description: 'Pre-war luxury sedan used by royalty. Hand-crafted body with exotic wood interior.' },
  { id: 'retro_5', name: 'Racing Legend 1955', image: '🏎️', year: 1955, price: 25000000, description: 'Won 3 Grand Prix races. One of only 5 ever made. Ultimate collector piece.' }
];

export const JEWELS_COLLECTION = [
  { id: 'jewel_1', name: 'Ruby Necklace', image: '💎', price: 800000 },
  { id: 'jewel_2', name: 'Sapphire Ring', image: '💍', price: 1500000 },
  { id: 'jewel_3', name: 'Emerald Bracelet', image: '💎', price: 3000000 },
  { id: 'jewel_4', name: 'Diamond Tiara', image: '👑', price: 7000000 },
  { id: 'jewel_5', name: 'Black Diamond Pendant', image: '💎', price: 15000000 },
  { id: 'jewel_6', name: 'The Eternal Diamond', image: '💎', price: 50000000 }
];

export const STAMPS_COLLECTION = [
  { id: 'stamp_1', name: 'Rare Penny Stamp 1840', image: '📮', price: 100000 },
  { id: 'stamp_2', name: 'Colonial Era Stamp', image: '📮', price: 250000 },
  { id: 'stamp_3', name: 'Independence Day Stamp', image: '📮', price: 500000 },
  { id: 'stamp_4', name: 'Inverted Error Stamp', image: '📮', price: 2000000 },
  { id: 'stamp_5', name: 'One of a Kind Stamp', image: '📮', price: 5000000 }
];

// ===== INSIGNIA =====
export const INSIGNIA = [
  {
    id: 'insignia_1',
    name: 'The Owner',
    icon: '🏠',
    description: 'Own 5 businesses of any type',
    requirement: { type: 'business_count', count: 5 },
    reward: '₹50,000 Bonus'
  },
  {
    id: 'insignia_2',
    name: 'Monopoly',
    icon: '🎩',
    description: 'Own 10 businesses of the same type',
    requirement: { type: 'same_business_count', count: 10 },
    reward: '₹200,000 Bonus'
  },
  {
    id: 'insignia_3',
    name: 'Business Empire',
    icon: '🏰',
    description: 'Own 25 businesses total and 3 mergers',
    requirement: { type: 'empire', businessCount: 25, mergerCount: 3 },
    reward: '₹1,000,000 Bonus'
  },
  {
    id: 'insignia_4',
    name: 'Investor',
    icon: '📈',
    description: 'Own stocks worth ₹10,00,000 or more',
    requirement: { type: 'stock_value', value: 1000000 },
    reward: '₹500,000 Bonus'
  },
  {
    id: 'insignia_5',
    name: 'RichMan',
    icon: '💰',
    description: 'Accumulate total balance of ₹1,00,00,000',
    requirement: { type: 'balance', value: 10000000 },
    reward: '₹5,000,000 Bonus'
  }
];

// ===== NFTs =====
export const NFTS = [
  { id: 'nft_1', name: 'Pixel Warrior #001', image: '🤖', price: 500000, collection: 'Pixel Warriors', rarity: 'Common' },
  { id: 'nft_2', name: 'Cyber Ape #042', image: '🦍', price: 1200000, collection: 'Cyber Apes', rarity: 'Rare' },
  { id: 'nft_3', name: 'Golden Dragon #007', image: '🐉', price: 3000000, collection: 'Mythical Beasts', rarity: 'Epic' },
  { id: 'nft_4', name: 'Diamond Skull #003', image: '💀', price: 8000000, collection: 'Skulls Club', rarity: 'Legendary' },
  { id: 'nft_5', name: 'Cosmic Cat #099', image: '🐱', price: 600000, collection: 'Cosmic Cats', rarity: 'Common' },
  { id: 'nft_6', name: 'Neon Samurai #011', image: '⚔️', price: 5000000, collection: 'Neon Warriors', rarity: 'Epic' },
  { id: 'nft_7', name: 'Astro Doge #001', image: '🐕', price: 15000000, collection: 'Astro Animals', rarity: 'Legendary' },
  { id: 'nft_8', name: 'Glitch Ghost #066', image: '👻', price: 900000, collection: 'Glitch World', rarity: 'Rare' }
];

// ===== ISLANDS =====
export const ISLANDS = [
  {
    id: 'island_1',
    name: 'Palm Cove Island',
    image: '🏝️',
    price: 50000000,
    description: 'A beautiful tropical island with white sandy beaches, palm trees, and crystal clear waters. Perfect for building your private resort.',
    size: '2.5 acres',
    location: 'Arabian Sea'
  },
  {
    id: 'island_2',
    name: 'Emerald Bay Island',
    image: '🏝️',
    price: 150000000,
    description: 'Lush green island with a natural bay, waterfalls, and exotic wildlife. Includes a helicopter pad and private dock.',
    size: '8 acres',
    location: 'Indian Ocean'
  },
  {
    id: 'island_3',
    name: 'Sunset Paradise',
    image: '🌅',
    price: 300000000,
    description: 'Premium island facing the sunset horizon. Features underground caves, coral reefs, and pre-built luxury villa.',
    size: '15 acres',
    location: 'Pacific Ocean'
  },
  {
    id: 'island_4',
    name: 'Royal Crown Island',
    image: '👑',
    price: 800000000,
    description: 'The most exclusive private island. Features a palace, golf course, private airport, submarine dock, and underwater restaurant.',
    size: '45 acres',
    location: 'Caribbean Sea'
  },
  {
    id: 'island_5',
    name: 'Dragon Reef Island',
    image: '🐉',
    price: 500000000,
    description: 'Mystical island shaped like a dragon from aerial view. Volcanic hot springs, ancient ruins, and bioluminescent lagoon.',
    size: '25 acres',
    location: 'South Pacific'
  }
];