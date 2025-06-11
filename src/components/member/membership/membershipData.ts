
import { MembershipTier } from '@/types/auth';
import { MembershipTierData } from '@/components/member/membership/MembershipTierCard';

// Define membership tiers with their features and pricing
export const membershipTiers: MembershipTierData[] = [
  {
    id: 'smart' as MembershipTier,
    name: 'Smart Access',
    description: 'Essential healthcare tools for everyday wellness monitoring',
    price: '$9.99',
    interval: 'month',
    yearlyPrice: '$99.99',
    features: [
      'Basic health tracking tools',
      'Access to health articles',
      '10% off prescribed medications',
      'Email support'
    ],
    notIncluded: [
      'Personalized health insights',
      'Telehealth consultations',
      'Medical transportation',
      'Concierge services'
    ]
  },
  {
    id: 'core' as MembershipTier,
    name: 'Core Concierge',
    description: 'Comprehensive care with personalized health guidance',
    price: '$24.99',
    interval: 'month',
    yearlyPrice: '$249.99',
    features: [
      'Everything in Smart Access',
      'Personalized health insights',
      'Up to 3 telehealth consultations/month',
      '20% off prescribed medications',
      'Medical transportation (3 rides/month)',
      'Priority customer support'
    ],
    notIncluded: [
      'VIP concierge services',
      'Premium vacation packages',
      'Dedicated healthcare advisor'
    ],
    popular: true
  },
  {
    id: 'vip' as MembershipTier,
    name: 'VIP Executive',
    description: 'Elite healthcare experience with premium concierge services',
    price: '$49.99',
    interval: 'month',
    yearlyPrice: '$499.99',
    features: [
      'Everything in Core Concierge',
      'Unlimited telehealth consultations',
      'Dedicated healthcare advisor',
      '30% off prescribed medications',
      'Unlimited medical transportation',
      'VIP concierge services',
      'Exclusive vacation package discounts',
      '24/7 priority support'
    ],
    notIncluded: []
  }
];

// Function to get membership tier by ID
const getMembershipTier = (tierId: MembershipTier): MembershipTierData | undefined => {
  return membershipTiers.find(tier => tier.id === tierId);
};
