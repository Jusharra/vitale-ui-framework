
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Users } from "lucide-react";
import { RewardPoints } from "@/hooks/useRewards";

interface RewardsCardProps {
  points: RewardPoints | undefined;
  isLoading: boolean;
}

const RewardsCard: React.FC<RewardsCardProps> = ({ points, isLoading }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Rewards</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Points</p>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold">
                {isLoading ? '...' : points?.current || 0}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/rewards')}>
            <span>Redeem</span>
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Referral Status</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {isLoading ? 'Loading...' : `${points?.referrals || 0} of 5 referrals`}
              </span>
            </div>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => navigate('/dashboard/share-and-earn')}
            >
              <span>Invite</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsCard;
