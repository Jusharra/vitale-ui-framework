
import { MembershipTier } from '@/types/auth';
import { MembershipTierData } from '@/components/member/membership/MembershipTierCard';

// Define membership tiers with tiered access
export const membershipTiers: MembershipTierData[] = [
  {
    id: 'smart' as MembershipTier,
    name: 'Smart Access',
    description: 'Essential health tools and basic telehealth access for individuals',
    price: '$9.99',
    interval: 'month',
    yearlyPrice: '$99.99',
    familyMemberPrice: '$5',
    features: [
      'Basic health tracking',
      '2 telehealth consultations/month',
      'Health goal setting',
      'Basic medication reminders',
      'Community support access'
    ],
    notIncluded: [
      'Dedicated healthcare advisor',
      'Medical transportation',
      'VIP concierge services',
      'Premium vacation packages'
    ],
    popular: false
  },
  {
    id: 'core' as MembershipTier,
    name: 'Core Concierge',
    description: 'Comprehensive health management with dedicated support and enhanced services',
    price: '$24.99',
    interval: 'month',
    yearlyPrice: '$249.99',
    familyMemberPrice: '$15',
    features: [
      'Advanced health tracking and insights',
      'Unlimited telehealth consultations',
      'Dedicated healthcare advisor',
      '15% off prescribed medications',
      'Basic medical transportation (5 rides/month)',
      'Care coordination services',
      'Priority support',
      'Access to health tools',
      'Family member add-ons available ($15/month each)'
    ],
    notIncluded: [
      'VIP concierge services',
      'Premium vacation packages',
      'Unlimited medical transportation'
    ],
    popular: true
  },
  {
    id: 'vip' as MembershipTier,
    name: 'VIP Executive',
    description: 'Elite healthcare concierge with dedicated physician partnership and comprehensive wellness services',
    price: '$49.99',
    interval: 'month',
    yearlyPrice: '$499.99',
    familyMemberPrice: '$25',
    features: [
      'Complete health tracking and insights',
      'Unlimited telehealth consultations',
      'Dedicated healthcare advisor',
      '30% off prescribed medications',
      'Unlimited medical transportation',
      'VIP concierge services',
      'Premium vacation packages',
      '24/7 priority support',
      'Access to all health tools',
      'Personalized care plans',
      'Executive health assessments',
      'Family member add-ons available ($25/month each)'
    ],
    notIncluded: [],
    popular: false
  }
];

// Function to get membership tier by ID
export const getMembershipTier = (tierId: MembershipTier): MembershipTierData | undefined => {
  return membershipTiers.find(tier => tier.id === tierId);
};
