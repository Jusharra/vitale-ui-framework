
import { useState, useEffect } from 'react';

export interface Reward {
  id: string;
  name: string;
  title: string; // Added to match RewardsList interface
  points_required: number; // Added to match RewardsList interface
  category: string; // Added to match RewardsList interface
  description: string | null;
  image_url: string | null;
  value: number | null;
  status: string;
  expires_at: string | null;
  expiry_date?: string; // Added for compatibility with RewardsList
  created_at: string | null;
  terms_conditions: string | null;
  reward_type: string;
  claimed: boolean;
  redeemed: boolean;
  profile_id: string | null;
  renewal_date: string;
}

export interface Activity {
  id: string | number;
  date: string;
  action: string;
  points: number;
}

export interface RewardPoints {
  current: number;
  lifetime: number;
  referrals: number;
}

export const useRewards = (userId: string | null = null) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [points, setPoints] = useState<RewardPoints>({ current: 0, lifetime: 0, referrals: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRewards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Temporary mock data with added fields to match RewardsList interface
      const mockRewards: Reward[] = [
        {
          id: '1',
          name: 'Free Hotel Night',
          title: 'Free Hotel Night', // Added for compatibility
          points_required: 5000, // Added for compatibility
          category: 'travel', // Added for compatibility
          description: 'One night stay at a premium hotel of your choice',
          image_url: '/assets/images/rewards/hotel.jpg',
          value: 5000,
          status: 'available', 
          expires_at: '2025-12-31T00:00:00Z',
          expiry_date: '2025-12-31T00:00:00Z', // Added for compatibility
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
          title: 'Refer 3 Friends Bonus', // Added for compatibility
          points_required: 1500, // Added for compatibility
          category: 'referral', // Added for compatibility
          description: 'Earn 1500 bonus points when you refer 3 friends who subscribe',
          image_url: '/assets/images/rewards/referral.jpg',
          value: 1500,
          status: 'available',
          expires_at: '2025-12-31T00:00:00Z',
          expiry_date: '2025-12-31T00:00:00Z', // Added for compatibility
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
          title: 'Premium Subscription Discount', // Added for compatibility
          points_required: 2500, // Added for compatibility
          category: 'discount', // Added for compatibility
          description: '25% off on your next membership renewal',
          image_url: '/assets/images/rewards/discount.jpg',
          value: 2500,
          status: 'limited',
          expires_at: '2025-06-30T00:00:00Z',
          expiry_date: '2025-06-30T00:00:00Z', // Added for compatibility
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
          title: 'Spa Treatment Voucher', // Added for compatibility
          points_required: 3000, // Added for compatibility
          category: 'wellness', // Added for compatibility
          description: 'Complimentary spa treatment at select locations',
          image_url: '/assets/images/rewards/spa.jpg',
          value: 3000,
          status: 'available',
          expires_at: '2025-12-31T00:00:00Z', 
          expiry_date: '2025-12-31T00:00:00Z', // Added for compatibility
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
          title: 'Referral Achievement: Gold', // Added for compatibility
          points_required: 10000, // Added for compatibility
          category: 'referral', // Added for compatibility
          description: 'Special vacation package for referring 5+ friends',
          image_url: '/assets/images/rewards/gold.jpg',
          value: 10000,
          status: 'available',
          expires_at: '2025-12-31T00:00:00Z',
          expiry_date: '2025-12-31T00:00:00Z', // Added for compatibility
          created_at: '2025-01-01T00:00:00Z',
          terms_conditions: 'Valid after 5 successful referrals who become paying members.',
          reward_type: 'referral_achievement',
          claimed: false,
          redeemed: false,
          profile_id: null,
          renewal_date: '2025-12-31'
        },
      ];

      // Mock activities data
      const mockActivities: Activity[] = [
        {
          id: '1',
          date: '2025-04-25',
          action: 'Completed health assessment',
          points: 100
        },
        {
          id: '2',
          date: '2025-04-22',
          action: 'Referred a friend',
          points: 300
        },
        {
          id: '3',
          date: '2025-04-15',
          action: 'Logged workout activity',
          points: 50
        },
        {
          id: '4',
          date: '2025-04-10',
          action: 'Annual checkup completed',
          points: 200
        },
      ];
      
      // Mock points data
      const mockPoints: RewardPoints = {
        current: 2150,
        lifetime: 3500,
        referrals: 2
      };

      // Simulate API delay
      setTimeout(() => {
        setRewards(mockRewards);
        setActivities(mockActivities);
        setPoints(mockPoints);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [userId]);

  return {
    rewards,
    activities,
    points,
    isLoading,
    error,
    fetchRewards
  };
};
