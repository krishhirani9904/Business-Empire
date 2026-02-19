// ============================================
// 📄 FILE: src/components/business/businessData.js
// 🎯 PURPOSE: Business types and merger options
// 🔧 FIX Bug #5: formatCurrency imported from utils (no duplicate)
// ============================================

import {
  Store, Car, Building2, Cpu, Plane, Crown,
  Truck, Factory, Hammer, Landmark, Trophy, Fuel
} from 'lucide-react';

// 🔧 FIX: Import from single source instead of defining here
export { formatCurrency } from '../../utils/formatCurrency';

// CONCEPT: Sell Price Constant
// Business sell kare to original cost no 50% paacho male
export const SELL_PERCENTAGE = 0.5;

// CONCEPT: Sell Price Calculator Utility
export const getSellPrice = (owned) => {
  if (owned.purchaseCost) {
    return Math.floor(owned.purchaseCost * SELL_PERCENTAGE);
  }

  const business = BUSINESSES.find(b => b.id === owned.businessId);
  if (business) {
    const size = business.sizes.find(s => s.type === owned.sizeType);
    if (size) return Math.floor(size.cost * SELL_PERCENTAGE);
  }

  return 0;
};

// 12 Business Types with 3 Sizes Each
export const BUSINESSES = [
  {
    id: 'shop',
    name: 'Shop',
    icon: Store,
    color: 'from-green-500 to-emerald-600',
    description: 'Retail store chain - sabse basic business',
    sizes: [
      { type: 'Local', cost: 400, incomePerHour: 50 },
      { type: 'City', cost: 15000, incomePerHour: 200 },
      { type: 'National', cost: 50000, incomePerHour: 700 },
    ]
  },
  {
    id: 'taxi',
    name: 'Taxi Service',
    icon: Car,
    color: 'from-yellow-500 to-amber-600',
    description: 'Ride service - city transport business',
    sizes: [
      { type: 'Local', cost: 8000, incomePerHour: 100 },
      { type: 'City', cost: 30000, incomePerHour: 400 },
      { type: 'National', cost: 100000, incomePerHour: 1500 },
    ]
  },
  {
    id: 'company',
    name: 'Company',
    icon: Building2,
    color: 'from-blue-500 to-cyan-600',
    description: 'Corporate office - professional services',
    sizes: [
      { type: 'Small', cost: 25000, incomePerHour: 300 },
      { type: 'Medium', cost: 80000, incomePerHour: 1000 },
      { type: 'Large', cost: 250000, incomePerHour: 3500 },
    ]
  },
  {
    id: 'shipping',
    name: 'Shipping Company',
    icon: Truck,
    color: 'from-orange-500 to-red-600',
    description: 'Logistics & delivery network',
    sizes: [
      { type: 'Regional', cost: 50000, incomePerHour: 600 },
      { type: 'National', cost: 150000, incomePerHour: 2000 },
      { type: 'International', cost: 500000, incomePerHour: 7000 },
    ]
  },
  {
    id: 'factory',
    name: 'Factory',
    icon: Factory,
    color: 'from-gray-500 to-slate-600',
    description: 'Manufacturing unit - produce goods',
    sizes: [
      { type: 'Small', cost: 75000, incomePerHour: 900 },
      { type: 'Medium', cost: 200000, incomePerHour: 2500 },
      { type: 'Large', cost: 600000, incomePerHour: 8000 },
    ]
  },
  {
    id: 'construction',
    name: 'Construction Company',
    icon: Hammer,
    color: 'from-amber-600 to-yellow-700',
    description: 'Build infrastructure & real estate',
    sizes: [
      { type: 'Local', cost: 100000, incomePerHour: 1200 },
      { type: 'City', cost: 300000, incomePerHour: 3800 },
      { type: 'National', cost: 800000, incomePerHour: 10000 },
    ]
  },
  {
    id: 'cardealership',
    name: 'Car Dealership',
    icon: Car,
    color: 'from-red-500 to-rose-600',
    description: 'Luxury & commercial car showroom',
    sizes: [
      { type: 'Standard', cost: 150000, incomePerHour: 1800 },
      { type: 'Premium', cost: 400000, incomePerHour: 5000 },
      { type: 'Luxury', cost: 1000000, incomePerHour: 13000 },
    ]
  },
  {
    id: 'itcompany',
    name: 'IT Company',
    icon: Cpu,
    color: 'from-purple-500 to-indigo-600',
    description: 'Software & tech solutions',
    sizes: [
      { type: 'Startup', cost: 80000, incomePerHour: 1000 },
      { type: 'Scaleup', cost: 250000, incomePerHour: 3200 },
      { type: 'Enterprise', cost: 750000, incomePerHour: 10000 },
    ]
  },
  {
    id: 'bank',
    name: 'Bank',
    icon: Landmark,
    color: 'from-emerald-600 to-teal-700',
    description: 'Financial institution - loans & deposits',
    sizes: [
      { type: 'Local', cost: 500000, incomePerHour: 6000 },
      { type: 'Regional', cost: 1500000, incomePerHour: 20000 },
      { type: 'National', cost: 5000000, incomePerHour: 70000 },
    ]
  },
  {
    id: 'sportsclub',
    name: 'Sports Club',
    icon: Trophy,
    color: 'from-sky-500 to-blue-600',
    description: 'Sports team & entertainment',
    sizes: [
      { type: 'Local', cost: 300000, incomePerHour: 3500 },
      { type: 'National', cost: 800000, incomePerHour: 10000 },
      { type: 'International', cost: 3000000, incomePerHour: 40000 },
    ]
  },
  {
    id: 'oilgas',
    name: 'Oil & Gas Company',
    icon: Fuel,
    color: 'from-stone-600 to-neutral-800',
    description: 'Energy sector - fuel production',
    sizes: [
      { type: 'Small', cost: 1000000, incomePerHour: 12000 },
      { type: 'Medium', cost: 3000000, incomePerHour: 38000 },
      { type: 'Large', cost: 10000000, incomePerHour: 130000 },
    ]
  },
  {
    id: 'airlines',
    name: 'Airlines',
    icon: Plane,
    color: 'from-indigo-500 to-violet-600',
    description: 'Aviation - passenger & cargo flights',
    sizes: [
      { type: 'Regional', cost: 2000000, incomePerHour: 25000 },
      { type: 'National', cost: 5000000, incomePerHour: 65000 },
      { type: 'International', cost: 20000000, incomePerHour: 280000 },
    ]
  }
];

// Merger Options
export const MERGER_OPTIONS = [
  {
    id: 'local_chain',
    name: 'Local Chain',
    description: 'Shop + Taxi = Local delivery & ride network',
    bonus: 15,
    requirements: [
      { businessId: 'shop', minCount: 2 },
      { businessId: 'taxi', minCount: 1 }
    ]
  },
  {
    id: 'logistics_empire',
    name: 'Logistics Empire',
    description: 'Shipping + Factory = Production & delivery combo',
    bonus: 20,
    requirements: [
      { businessId: 'shipping', minCount: 1 },
      { businessId: 'factory', minCount: 1 }
    ]
  },
  {
    id: 'city_empire',
    name: 'City Empire',
    description: 'Construction + Company + Shop = Urban development',
    bonus: 25,
    requirements: [
      { businessId: 'construction', minCount: 1 },
      { businessId: 'company', minCount: 1 },
      { businessId: 'shop', minCount: 2 }
    ]
  },
  {
    id: 'tech_logistics',
    name: 'Tech Logistics',
    description: 'IT Company + Shipping = Smart delivery system',
    bonus: 30,
    requirements: [
      { businessId: 'itcompany', minCount: 1 },
      { businessId: 'shipping', minCount: 2 }
    ]
  },
  {
    id: 'auto_empire',
    name: 'Auto Empire',
    description: 'Car Dealership + Taxi + Factory = Auto industry dominance',
    bonus: 35,
    requirements: [
      { businessId: 'cardealership', minCount: 1 },
      { businessId: 'taxi', minCount: 2 },
      { businessId: 'factory', minCount: 1 }
    ]
  },
  {
    id: 'financial_group',
    name: 'Financial Group',
    description: 'Bank + Company = Complete financial services',
    bonus: 30,
    requirements: [
      { businessId: 'bank', minCount: 1 },
      { businessId: 'company', minCount: 2 }
    ]
  },
  {
    id: 'energy_transport',
    name: 'Energy & Transport',
    description: 'Oil & Gas + Airlines + Shipping = Energy logistics',
    bonus: 40,
    requirements: [
      { businessId: 'oilgas', minCount: 1 },
      { businessId: 'airlines', minCount: 1 },
      { businessId: 'shipping', minCount: 1 }
    ]
  },
  {
    id: 'mega_corp',
    name: 'Mega Corporation',
    description: 'Own 5+ different business types = Ultimate empire bonus',
    bonus: 50,
    requirements: [
      { businessId: 'shop', minCount: 1 },
      { businessId: 'company', minCount: 1 },
      { businessId: 'factory', minCount: 1 },
      { businessId: 'itcompany', minCount: 1 },
      { businessId: 'bank', minCount: 1 }
    ]
  }
];