import { useState, useEffect } from 'react';

export interface Reward {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  value: number | null;
  status: string; // Using string instead of union type
  expires_at: string | null;
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
      // This would be a Supabase query in a real implementation
      // const { data, error } = await supabase
      //   .from('member_rewards')
      //   .select('*')
      //   .eq('status', 'available');
      
      // if (error) throw error;
      // setRewards(data || []);
      
      // Temporary mock data
      const mockRewards: Reward[] = [
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
