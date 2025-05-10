
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Award, BarChart } from 'lucide-react';

interface RewardItem {
  name: string;
  claims: number;
}

interface RewardsStatsProps {
  rewardsStats: {
    totalIssued: number;
    totalRedeemed: number;
    popularRewards: RewardItem[];
  };
}

const RewardsTab: React.FC<RewardsStatsProps> = ({ rewardsStats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-amber-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Gift className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-4xl">{rewardsStats.totalIssued}</CardTitle>
            <CardDescription>Total Rewards Issued</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-4xl">{rewardsStats.totalRedeemed}</CardTitle>
            <CardDescription>Rewards Redeemed</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-blue-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <BarChart className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-4xl">
              {Math.round((rewardsStats.totalRedeemed / rewardsStats.totalIssued) * 100)}%
            </CardTitle>
            <CardDescription>Redemption Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Most Popular Rewards</CardTitle>
          <CardDescription>Based on redemption frequency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rewardsStats.popularRewards.map((reward, idx) => (
              <div key={idx} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                    ${idx === 0 ? 'bg-amber-100 text-amber-600' : 
                      idx === 1 ? 'bg-slate-100 text-slate-600' : 
                      'bg-orange-100 text-orange-600'}`}>
                    {idx + 1}
                  </div>
                  <span className="font-medium">{reward.name}</span>
                </div>
                <span className="font-medium">{reward.claims} claims</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <span>Add New Reward</span>
          </Button>
          <Button>
            <span>Manage All Rewards</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RewardsTab;
