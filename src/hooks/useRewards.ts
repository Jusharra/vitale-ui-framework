
import { useState, useEffect } from 'react';

// Update the Reward interface to have status as string instead of restricted enum
export interface Reward {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  value: number | null;
  status: string; // Changed from union type to string
  expires_at: string | null;
  created_at: string | null;
  terms_conditions: string | null;
  reward_type: string;
  claimed: boolean;
  redeemed: boolean;
  profile_id: string | null;
  renewal_date: string;
}

export const useRewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRewards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data response
      const mockRewards = [
        {
          id: '1',
          name: 'Free Hotel Night',
          description: 'One night stay at a premium hotel of your choice',
          image_url: '/assets/images/rewards/hotel.jpg',
          value: 5000,
          status: 'available', 
          expires_at: '2025-12-31T00:00:00Z',
          created_at: '2025-01-01T00:00:00Z',
          terms_conditions: 'Valid at participating hotels. Blackout dates may apply.',
          reward_type: 'travel',
          claimed: false,
          redeemed: false,
          profile_id: null,
          renewal_date: '2025-12-31'
        },
        {
          id: '2',
          name: 'Refer 3 Friends Bonus',
          description: 'Earn 1500 bonus points when you refer 3 friends who subscribe',
          image_url: '/assets/images/rewards/referral.jpg',
          value: 1500,
          status: 'available',
          expires_at: '2025-12-31T00:00:00Z',
          created_at: '2025-01-01T00:00:00Z',
          terms_conditions: 'Friends must subscribe to any membership tier.',
          reward_type: 'referral_bonus',
          claimed: false,
          redeemed: false,
          profile_id: null,
          renewal_date: '2025-12-31'
        },
        {
          id: '3',
          name: 'Premium Subscription Discount',
          description: '25% off on your next membership renewal',
          image_url: '/assets/images/rewards/discount.jpg',
          value: 2500,
          status: 'limited',
          expires_at: '2025-06-30T00:00:00Z',
          created_at: '2025-01-01T00:00:00Z',
          terms_conditions: 'Valid once per account.',
          reward_type: 'discount',
          claimed: false,
          redeemed: false,
          profile_id: null,
          renewal_date: '2025-06-30'
        },
        {
          id: '4',
          name: 'Spa Treatment Voucher',
          description: 'Complimentary spa treatment at select locations',
          image_url: '/assets/images/rewards/spa.jpg',
          value: 3000,
          status: 'available',
          expires_at: '2025-12-31T00:00:00Z', 
          created_at: '2025-01-01T00:00:00Z',
          terms_conditions: 'Valid at participating locations.',
          reward_type: 'wellness',
          claimed: false,
          redeemed: false,
          profile_id: null,
          renewal_date: '2025-12-31'
        },
        {
          id: '5',
          name: 'Referral Achievement: Gold',
          description: 'Special vacation package for referring 5+ friends',
          image_url: '/assets/images/rewards/gold.jpg',
          value: 10000,
          status: 'available',
          expires_at: '2025-12-31T00:00:00Z',
          created_at: '2025-01-01T00:00:00Z',
          terms_conditions: 'Valid after 5 successful referrals who become paying members.',
          reward_type: 'referral_achievement',
          claimed: false,
          redeemed: false,
          profile_id: null,
          renewal_date: '2025-12-31'
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setRewards(mockRewards);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return {
    rewards,
    isLoading,
    error,
    fetchRewards
  };
};
