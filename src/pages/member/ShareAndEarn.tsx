
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PointsCard from '@/components/member/rewards/PointsCard';
import ReferralCard from '@/components/member/rewards/ReferralCard';
import RewardsList from '@/components/member/rewards/RewardsList';
import ActivityHistory from '@/components/member/rewards/ActivityHistory';
import { useAuth } from '@/context/AuthContext';
import { useRewards } from '@/hooks/useRewards';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';

const ShareAndEarn: React.FC = () => {
  const { user } = useAuth();
  const { rewards, isLoading } = useRewards();
  const { toast } = useToast();
  
  // Mock data - in a real app this would come from your API
  const rewardsData = {
    points: 750,
    nextRewardThreshold: 1000,
    referrals: 2,
    successfulReferrals: 2,
    pendingReferrals: 1,
    referralCode: user?.id?.substring(0, 8) || 'REF12345',
    history: [
      { id: 1, date: "May 1, 2025", action: "Annual checkup completed", points: 250 },
      { id: 2, date: "April 15, 2025", action: "Referral: Jane Smith", points: 300 },
      { id: 3, date: "April 5, 2025", action: "Health assessment completed", points: 100 },
      { id: 4, date: "March 20, 2025", action: "Prescription refill on time", points: 50 },
      { id: 5, date: "March 1, 2025", action: "Referral: Bob Johnson", points: 300 },
    ]
  };

  const handleViewActivity = () => {
    // In a real implementation, this would navigate to a detailed activity history view
    // or expand the current view to show more history
    toast({
      title: "Activity History",
      description: "Viewing your complete rewards activity history"
    });
  };

  return (
    <MemberPageLayout 
      title="Share & Earn Rewards" 
      description="Refer friends, earn points, and redeem exclusive rewards"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Points & Referrals */}
        <div className="space-y-6">
          <PointsCard 
            currentPoints={rewardsData.points} 
            nextRewardThreshold={rewardsData.nextRewardThreshold}
            onViewActivity={handleViewActivity}
          />
          
          <ReferralCard 
            referralCode={rewardsData.referralCode}
            successfulReferrals={rewardsData.successfulReferrals}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Reward Tiers
                <Badge variant="outline" className="ml-2">Silver</Badge>
              </CardTitle>
              <CardDescription>Your current tier and benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Bronze</span>
                  <Badge variant="secondary">0-500 pts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">Silver</span>
                  <Badge>500-2000 pts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Gold</span>
                  <Badge variant="outline">2000-5000 pts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Platinum</span>
                  <Badge variant="outline">5000+ pts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Column 2: Available Rewards & Activity */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="rewards">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              <TabsTrigger value="activity">Activity History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rewards" className="pt-4">
              <RewardsList rewards={rewards} userPoints={rewardsData.points} isLoading={isLoading} />
            </TabsContent>
            
            <TabsContent value="activity" className="pt-4">
              <ActivityHistory activities={rewardsData.history} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MemberPageLayout>
  );
};

export default ShareAndEarn;
