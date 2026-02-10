// components/business/businessData.js
import { 
  Store, 
  Car, 
  Building2, 
  Ship, 
  Factory, 
  HardHat, 
  Monitor, 
  Landmark, 
  Trophy, 
  Fuel, 
  Plane 
} from 'lucide-react';

export const BUSINESSES = [
  { 
    id: 'shop', 
    name: 'Shop', 
    icon: Store, 
    color: 'from-orange-500 to-amber-600',
    sizes: [
      { type: 'Local', cost: 4000, incomePerHour: 50 },
      { type: 'Small', cost: 15000, incomePerHour: 200 },
      { type: 'Large', cost: 50000, incomePerHour: 700 }
    ]
  },
  { 
    id: 'taxi', 
    name: 'Taxi Service', 
    icon: Car, 
    color: 'from-yellow-500 to-orange-500',
    sizes: [
      { type: 'Single Car', cost: 8000, incomePerHour: 80 },
      { type: 'Small Fleet', cost: 35000, incomePerHour: 400 },
      { type: 'Large Fleet', cost: 120000, incomePerHour: 1500 }
    ]
  },
  { 
    id: 'company', 
    name: 'Company', 
    icon: Building2, 
    color: 'from-blue-500 to-indigo-600',
    sizes: [
      { type: 'Startup', cost: 25000, incomePerHour: 300 },
      { type: 'Medium', cost: 100000, incomePerHour: 1200 },
      { type: 'Enterprise', cost: 500000, incomePerHour: 6000 }
    ]
  },
  { 
    id: 'shipping', 
    name: 'Shipping Company', 
    icon: Ship, 
    color: 'from-cyan-500 to-blue-600',
    sizes: [
      { type: 'Local', cost: 50000, incomePerHour: 600 },
      { type: 'Regional', cost: 200000, incomePerHour: 2500 },
      { type: 'International', cost: 800000, incomePerHour: 10000 }
    ]
  },
  { 
    id: 'factory', 
    name: 'Factory', 
    icon: Factory, 
    color: 'from-gray-500 to-slate-600',
    sizes: [
      { type: 'Small', cost: 75000, incomePerHour: 900 },
      { type: 'Medium', cost: 300000, incomePerHour: 4000 },
      { type: 'Large', cost: 1000000, incomePerHour: 15000 }
    ]
  },
  { 
    id: 'construction', 
    name: 'Construction Company', 
    icon: HardHat, 
    color: 'from-amber-500 to-yellow-600',
    sizes: [
      { type: 'Small', cost: 100000, incomePerHour: 1200 },
      { type: 'Medium', cost: 400000, incomePerHour: 5000 },
      { type: 'Large', cost: 1500000, incomePerHour: 20000 }
    ]
  },
  { 
    id: 'cardealership', 
    name: 'Car Dealership', 
    icon: Car, 
    color: 'from-red-500 to-rose-600',
    sizes: [
      { type: 'Local', cost: 150000, incomePerHour: 1800 },
      { type: 'City', cost: 600000, incomePerHour: 7500 },
      { type: 'Premium', cost: 2000000, incomePerHour: 25000 }
    ]
  },
  { 
    id: 'itcompany', 
    name: 'IT Company', 
    icon: Monitor, 
    color: 'from-purple-500 to-violet-600',
    sizes: [
      { type: 'Startup', cost: 80000, incomePerHour: 1000 },
      { type: 'Medium', cost: 350000, incomePerHour: 4500 },
      { type: 'Tech Giant', cost: 2500000, incomePerHour: 35000 }
    ]
  },
  { 
    id: 'bank', 
    name: 'Bank', 
    icon: Landmark, 
    color: 'from-emerald-500 to-green-600',
    sizes: [
      { type: 'Local Branch', cost: 500000, incomePerHour: 6000 },
      { type: 'Regional', cost: 2000000, incomePerHour: 25000 },
      { type: 'National', cost: 10000000, incomePerHour: 130000 }
    ]
  },
  { 
    id: 'sportsclub', 
    name: 'Sports Club', 
    icon: Trophy, 
    color: 'from-green-500 to-emerald-600',
    sizes: [
      { type: 'Local Team', cost: 300000, incomePerHour: 3500 },
      { type: 'City Club', cost: 1500000, incomePerHour: 18000 },
      { type: 'Premier League', cost: 8000000, incomePerHour: 100000 }
    ]
  },
  { 
    id: 'oilgas', 
    name: 'Oil & Gas Company', 
    icon: Fuel, 
    color: 'from-stone-600 to-neutral-700',
    sizes: [
      { type: 'Small', cost: 1000000, incomePerHour: 12000 },
      { type: 'Medium', cost: 5000000, incomePerHour: 65000 },
      { type: 'Large', cost: 20000000, incomePerHour: 280000 }
    ]
  },
  { 
    id: 'airlines', 
    name: 'Airlines', 
    icon: Plane, 
    color: 'from-sky-500 to-blue-600',
    sizes: [
      { type: 'Regional', cost: 2000000, incomePerHour: 25000 },
      { type: 'National', cost: 10000000, incomePerHour: 130000 },
      { type: 'International', cost: 50000000, incomePerHour: 700000 }
    ]
  }
];

export const MERGER_OPTIONS = [
  {
    id: 'retail_empire',
    name: 'Retail Empire',
    requirements: [
      { businessId: 'shop', minCount: 3 },
      { businessId: 'cardealership', minCount: 1 }
    ],
    bonus: 25,
    description: 'Combine shops and dealership for +25% income'
  },
  {
    id: 'logistics_giant',
    name: 'Logistics Giant',
    requirements: [
      { businessId: 'factory', minCount: 2 },
      { businessId: 'shipping', minCount: 2 }
    ],
    bonus: 30,
    description: 'Merge factories with shipping for +30% income'
  },
  {
    id: 'transport_hub',
    name: 'Transport Hub',
    requirements: [
      { businessId: 'taxi', minCount: 3 },
      { businessId: 'airlines', minCount: 1 }
    ],
    bonus: 35,
    description: 'Create transport network for +35% income'
  },
  {
    id: 'tech_conglomerate',
    name: 'Tech Conglomerate',
    requirements: [
      { businessId: 'itcompany', minCount: 2 },
      { businessId: 'company', minCount: 2 }
    ],
    bonus: 40,
    description: 'Build tech empire for +40% income'
  },
  {
    id: 'industrial_complex',
    name: 'Industrial Complex',
    requirements: [
      { businessId: 'factory', minCount: 4 },
      { businessId: 'construction', minCount: 2 },
      { businessId: 'oilgas', minCount: 1 }
    ],
    bonus: 50,
    description: 'Ultimate industrial merger for +50% income'
  }
];

// Utility function to format currency
export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount}`;
};