
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Pill, CircleCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  status: 'available' | 'limited' | 'unavailable';
  claimed?: boolean;
}

interface RewardsListProps {
  rewards: Reward[];
  userPoints: number;
  onRedeemReward: (rewardId: string) => Promise<void>;
  isLoading: boolean;
}

const RewardsList: React.FC<RewardsListProps> = ({ 
  rewards, 
  userPoints, 
  onRedeemReward, 
  isLoading 
}) => {
  const { toast } = useToast();
  
  const handleRedeem = async (reward: Reward) => {
    try {
      await onRedeemReward(reward.id);
      toast({
        title: "Reward Redeemed",
        description: `You've successfully redeemed ${reward.name}`,
      });
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast({
        title: "Redemption Failed",
        description: "There was a problem redeeming your reward. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const getRewardIcon = (reward: Reward) => {
    if (reward.claimed) {
      return <CircleCheck className="h-5 w-5" />;
    } else if (reward.reward_type === 'health' || reward.reward_type === 'service') {
      return <Heart className="h-5 w-5" />;
    } else {
      return <Pill className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (rewards.length === 0) {
    return (
      <div className="text-center p-10">
        <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">No rewards available</h3>
        <p className="text-muted-foreground mb-4">
          Check back soon for new reward opportunities
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {rewards.map((reward) => (
        <div 
          key={reward.id}
          className="border rounded-lg p-4 flex flex-col"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {getRewardIcon(reward)}
              </div>
              <h3 className="font-medium">{reward.name}</h3>
            </div>
            {reward.claimed && (
              <Badge variant="outline" className="ml-2">Claimed</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 mb-4">{reward.description}</p>
          <div className="mt-auto pt-2 flex justify-between items-center">
            <span className="text-sm font-medium">{reward.value} points</span>
            <Button 
              variant={reward.claimed ? "outline" : (userPoints >= reward.value ? "default" : "outline")}
              disabled={reward.claimed || userPoints < reward.value}
              size="sm"
              onClick={() => !reward.claimed && userPoints >= reward.value && handleRedeem(reward)}
            >
              {reward.claimed 
                ? "Claimed" 
                : (userPoints >= reward.value ? "Redeem" : "Not Enough Points")
              }
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RewardsList;
