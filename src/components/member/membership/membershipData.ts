
// This is a secure, read-only implementation of membership tiers data
// No sensitive information should be stored here

import type { MembershipTier } from '@/components/member/membership/MembershipTierCard';

// Create a frozen (immutable) object for membership tiers
export const membershipTiers: ReadonlyArray<MembershipTier> = Object.freeze([
  {
    id: "smart",
    name: "Smart Access",
    price: "$12.99",
    interval: "month",
    yearlyPrice: "$129.99",
    description: "Basic plan with essential health monitoring features",
    features: [
      "Basic health monitoring",
      "Smart medication reminders",
      "Pharmacy delivery coordination",
      "Basic telehealth consultations"
    ],
    notIncluded: [
      "Premium health tools",
      "Concierge care team",
      "Priority appointment scheduling",
      "VIP transport services"
    ]
  },
  {
    id: "core",
    name: "Core Concierge", 
    price: "$24.99",
    interval: "month",
    yearlyPrice: "$249.99",
    description: "Enhanced plan with premium care coordination",
    features: [
      "All Smart Access features",
      "Premium health assessments",
      "Advanced analytics and insights",
      "Priority appointment scheduling",
      "Dedicated care coordinators"
    ],
    notIncluded: [
      "Exclusive VIP services",
      "Personal 24/7 concierge",
      "White-glove medical transport"
    ],
    popular: true
  },
  {
    id: "vip",
    name: "VIP Experience",
    price: "$49.99",
    interval: "month",
    yearlyPrice: "$499.99",
    description: "All-inclusive luxury health concierge experience",
    features: [
      "All Core Concierge features",
      "24/7 personal health concierge",
      "White-glove medical transport",
      "Virtual and in-home care options",
      "Exclusive wellness retreats access",
      "Global health support and coordination",
      "Family coverage options"
    ],
    notIncluded: []
  }
]);

// Helper function to safely get tier by ID
export function getTierById(tierId: string): MembershipTier | undefined {
  return membershipTiers.find(tier => tier.id === tierId);
}

// Helper function to safely check if a tier level is sufficient
export function hasSufficientTier(userTier: string | null, requiredTier: string): boolean {
  const tierLevels: Record<string, number> = {
    "smart": 1,
    "core": 2,
    "vip": 3
  };
  
  const userLevel = userTier ? tierLevels[userTier] || 0 : 0;
  const requiredLevel = tierLevels[requiredTier] || 0;
  
  return userLevel >= requiredLevel;
}
