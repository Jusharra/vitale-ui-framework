
import React from 'react';
import { useRewards } from '@/hooks/useRewards';
import { useAuth } from '@/context/AuthContext';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import RewardsList from '@/components/member/rewards/RewardsList';
import PointsCard from '@/components/member/rewards/PointsCard';
import ReferralCard from '@/components/member/rewards/ReferralCard';
import ActivityHistory from '@/components/member/rewards/ActivityHistory';

const RewardsPage = () => {
  const { user } = useAuth();
  const { rewards, activities, points, isLoading } = useRewards(user?.id || null);
  
  return (
    <MemberPageLayout 
      title="Rewards & Referrals"
      subtitle="Earn points, get rewards, and earn money by referring friends"
      contentClassName="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PointsCard 
          currentPoints={points.current} 
          lifetimeEarned={points.lifetime}
          isLoading={isLoading}
        />
        <ReferralCard 
          referralCode="FRIEND25"
          successfulReferrals={points.referrals} 
          isLoading={isLoading}
        />
      </div>
      
      <RewardsList 
        rewards={rewards} 
        userPoints={points.current} 
        isLoading={isLoading}
      />
      
      <ActivityHistory 
        activities={activities} 
        isLoading={isLoading}
      />
    </MemberPageLayout>
  );
};

export default RewardsPage;
