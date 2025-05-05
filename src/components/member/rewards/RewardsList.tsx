import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Gift, Award, Clock } from 'lucide-react';

interface Reward {
  id: string;
  title: string;
  description: string;
  points_required: number;
  category: string;
  status: 'available' | 'claimed' | 'expired';
  expiry_date?: string;
}

interface RewardsListProps {
  rewards: Reward[];
  userPoints: number;
  isLoading?: boolean;
  onClaimReward?: (rewardId: string) => void;
}

const RewardsList: React.FC<RewardsListProps> = ({ 
  rewards, 
  userPoints, 
  isLoading = false,
  onClaimReward 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClaimReward = (reward: Reward) => {
    if (userPoints < reward.points_required) {
      toast({
        title: "Not enough points",
        description: "You need more points to claim this reward",
        variant: "destructive"
      });
      return;
    }

    if (onClaimReward) {
      onClaimReward(reward.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!rewards || rewards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
          <p className="text-muted-foreground">No rewards available at the moment.</p>
          <p className="text-sm text-muted-foreground mt-1">Check back soon for new rewards!</p>
        </CardContent>
      </Card>
    );
  }

  const availableRewards = rewards.filter(r => r.status === 'available');
  const claimedRewards = rewards.filter(r => r.status === 'claimed');

  return (
    <Tabs defaultValue="available">
      <TabsList className="mb-4">
        <TabsTrigger value="available">
          Available
          {availableRewards.length > 0 && (
            <Badge variant="secondary" className="ml-2">{availableRewards.length}</Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="claimed">
          Claimed
          {claimedRewards.length > 0 && (
            <Badge variant="secondary" className="ml-2">{claimedRewards.length}</Badge>
          )}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="available" className="space-y-4">
        {availableRewards.map(reward => (
          <Card key={reward.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{reward.title}</CardTitle>
                <Badge variant="outline" className="font-mono">
                  {reward.points_required} pts
                </Badge>
              </div>
              <CardDescription>{reward.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {reward.expiry_date && (
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4 mr-1" />
                  Expires: {new Date(reward.expiry_date).toLocaleDateString()}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleClaimReward(reward)} 
                disabled={userPoints < reward.points_required}
                className="w-full"
              >
                {userPoints < reward.points_required ? 'Not Enough Points' : 'Claim Reward'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
      
      <TabsContent value="claimed" className="space-y-4">
        {claimedRewards.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Award className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">You haven't claimed any rewards yet.</p>
            </CardContent>
          </Card>
        ) : (
          claimedRewards.map(reward => (
            <Card key={reward.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{reward.title}</CardTitle>
                  <Badge variant="secondary">Claimed</Badge>
                </div>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This reward has been added to your account.
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default RewardsList;
