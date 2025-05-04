
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface Reward {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  reward_type: string;
  value: number;
  expires_at: string;
  status: 'available' | 'limited' | 'unavailable' | string; // Allow string to accommodate DB values
  claimed?: boolean;
}

interface ActivityItem {
  id: string;
  date: string;
  action: string;
  points: number;
}

interface UseRewardsReturn {
  rewards: Reward[];
  userPoints: number;
  nextRewardThreshold: number;
  pointsHistory: ActivityItem[];
  referralCode: string;
  successfulReferrals: number;
  isLoading: boolean;
  error: string | null;
  redeemReward: (rewardId: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const useRewards = (): UseRewardsReturn => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [nextRewardThreshold, setNextRewardThreshold] = useState(1000);
  const [pointsHistory, setPointsHistory] = useState<ActivityItem[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [successfulReferrals, setSuccessfulReferrals] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  const fetchRewards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) return;
      
      // Fetch user's reward points
      const { data: pointsData, error: pointsError } = await supabase
        .from('reward_points')
        .select('current_balance')
        .eq('profile_id', user.id)
        .single();
      
      if (pointsError && pointsError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is fine for a new user
        throw pointsError;
      }
      
      // Fetch available rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('member_rewards')
        .select('*')
        .in('status', ['available', 'limited'])
        .order('value');
      
      if (rewardsError) throw rewardsError;
      
      // Get user's claimed rewards
      const { data: userRedemptions, error: redemptionsError } = await supabase
        .from('reward_redemptions')
        .select('reward_id')
        .eq('profile_id', user.id);
      
      if (redemptionsError) throw redemptionsError;
      
      // Mark claimed rewards
      const claimedRewardIds = userRedemptions?.map(r => r.reward_id) || [];
      const availableRewards = rewardsData?.map(reward => ({
        ...reward,
        claimed: claimedRewardIds.includes(reward.id)
      })) as Reward[] || [];
      
      // Fetch reward transactions history
      const { data: historyData, error: historyError } = await supabase
        .from('reward_transactions')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (historyError) throw historyError;
      
      // Format history items
      const formattedHistory = historyData?.map(item => ({
        id: item.id,
        date: new Date(item.created_at).toLocaleDateString(),
        action: item.description || item.transaction_type,
        points: item.points
      })) || [];
      
      // Fetch user's referral code and successful referrals
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('referral_code, referred_count')
        .eq('id', user.id)
        .single();
      
      if (profileError) throw profileError;
      
      // Set all the state variables
      setUserPoints(pointsData?.current_balance || 0);
      setRewards(availableRewards);
      setPointsHistory(formattedHistory);
      setReferralCode(profileData?.referral_code || '');
      setSuccessfulReferrals(profileData?.referred_count || 0);
      
      // Calculate next reward threshold (find the lowest unredeemed reward)
      const unredeemed = availableRewards.filter(r => !r.claimed).sort((a, b) => a.value - b.value);
      if (unredeemed.length > 0) {
        setNextRewardThreshold(unredeemed[0].value);
      }
      
    } catch (err: any) {
      console.error('Error fetching rewards data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const redeemReward = async (rewardId: string) => {
    if (!user) return;
    
    try {
      // Get the reward details first
      const { data: reward, error: rewardError } = await supabase
        .from('member_rewards')
        .select('value, name')
        .eq('id', rewardId)
        .single();
      
      if (rewardError) throw rewardError;
      
      // Begin transaction by creating redemption record
      const { data: redemption, error: redemptionError } = await supabase
        .from('reward_redemptions')
        .insert({
          profile_id: user.id,
          reward_id: rewardId,
          points_used: reward.value,
          status: 'pending'
        })
        .select()
        .single();
      
      if (redemptionError) throw redemptionError;
      
      // Create transaction record for the redemption
      const { error: transactionError } = await supabase
        .from('reward_transactions')
        .insert({
          profile_id: user.id,
          points: -reward.value, // negative value for redemption
          transaction_type: 'redeem',
          source: 'rewards',
          description: `Redeemed ${reward.name}`,
          reference_id: redemption.id
        });
      
      if (transactionError) throw transactionError;
      
      // Refresh data after redemption
      await fetchRewards();
      
    } catch (err: any) {
      console.error('Error redeeming reward:', err);
      setError(err.message);
      throw err;
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (user) {
      fetchRewards();
    }
  }, [user]);
  
  return {
    rewards,
    userPoints,
    nextRewardThreshold,
    pointsHistory: pointsHistory,
    referralCode,
    successfulReferrals,
    isLoading,
    error,
    redeemReward,
    refreshData: fetchRewards
  };
};
