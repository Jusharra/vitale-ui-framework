
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReferralCard from '@/components/member/rewards/ReferralCard';
import PointsCard from '@/components/member/rewards/PointsCard';
import RewardsList from '@/components/member/rewards/RewardsList';
import ActivityHistory from '@/components/member/rewards/ActivityHistory';
import { useRewards } from '@/hooks/useRewards';
import { useNavigate } from 'react-router-dom';

const ShareAndEarn = () => {
  const navigate = useNavigate();
  const { 
    rewards, 
    userPoints, 
    nextRewardThreshold, 
    pointsHistory, 
    referralCode,
    successfulReferrals,
    isLoading, 
    redeemReward
  } = useRewards();
  
  const viewDetailedHistory = () => {
    // You can implement a modal or navigate to a detailed history page
    console.log("View detailed history");
  };
  
  return (
    <MemberPageLayout 
      title="Share & Earn" 
      description="Refer friends, earn points, and redeem rewards"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Points & Referrals */}
        <div className="space-y-6">
          <PointsCard 
            currentPoints={userPoints}
            nextRewardThreshold={nextRewardThreshold}
            onViewActivity={viewDetailedHistory}
          />
          
          <ReferralCard 
            referralCode={referralCode}
            successfulReferrals={successfulReferrals}
          />
        </div>
        
        {/* Column 2: Available Rewards & Activity */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="available" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available">Available Rewards</TabsTrigger>
              <TabsTrigger value="redeemed">Redeemed Rewards</TabsTrigger>
            </TabsList>
            
            <TabsContent value="available" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <RewardsList 
                    rewards={rewards.filter(r => !r.claimed)}
                    userPoints={userPoints}
                    onRedeemReward={redeemReward}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="redeemed" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <RewardsList 
                    rewards={rewards.filter(r => r.claimed)}
                    userPoints={userPoints}
                    onRedeemReward={redeemReward}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <ActivityHistory 
            history={pointsHistory}
            onViewComplete={viewDetailedHistory}
          />
        </div>
      </div>
    </MemberPageLayout>
  );
};

export default ShareAndEarn;
