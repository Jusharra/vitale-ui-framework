
import { MembershipTier } from '@/types/auth';
import { MembershipTierData } from '@/components/member/membership/MembershipTierCard';

// Define single membership tier with full access
export const membershipTiers: MembershipTierData[] = [
  {
    id: 'premium' as MembershipTier,
    name: 'Vitalé Premium Membership',
    description: 'Elite healthcare concierge with dedicated physician partnership and comprehensive wellness services',
    price: '$1,297',
    interval: 'month',
    yearlyPrice: '$15,564',
    familyMemberPrice: '$50',
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
      'Family member add-ons available ($50/month each)'
    ],
    notIncluded: [],
    popular: true
  }
];

// Function to get membership tier by ID
export const getMembershipTier = (tierId: MembershipTier): MembershipTierData | undefined => {
  return membershipTiers.find(tier => tier.id === tierId);
};
