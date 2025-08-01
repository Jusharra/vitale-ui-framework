
import { MembershipTier } from '@/types/auth';
import { MembershipTierData } from '@/components/member/membership/MembershipTierCard';

// Define the single Premium membership tier for members
export const membershipTiers: MembershipTierData[] = [
  {
    id: 'premium' as MembershipTier,
    name: 'Premium Membership',
    description: 'Comprehensive healthcare concierge with dedicated physician partnership and complete wellness services',
    price: '$1,297',
    interval: 'month',
    yearlyPrice: '$12,970',
    familyMemberPrice: '$649',
    features: [
      'Complete health tracking and insights',
      'Unlimited telehealth consultations',
      'Dedicated healthcare advisor',
      'Up to 30% off prescribed medications',
      'Unlimited medical transportation',
      'Premium concierge services',
      'Exclusive vacation packages',
      '24/7 priority support',
      'Access to all health tools',
      'Personalized care plans',
      'Executive health assessments',
      'Family member add-ons available ($649/month each)',
      'Care coordination services',
      'Priority appointment scheduling'
    ],
    notIncluded: [],
    popular: true
  }
];

// Function to get membership tier by ID
export const getMembershipTier = (tierId: MembershipTier): MembershipTierData | undefined => {
  return membershipTiers.find(tier => tier.id === tierId);
};
