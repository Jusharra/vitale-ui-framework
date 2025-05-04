
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, Heart, Gift, CirclePlus } from 'lucide-react';
import { Reward } from '@/hooks/useRewards';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/utils/i18n';
import { useRegionalPricing } from '@/hooks/useRegionalPricing';

interface RewardsListProps {
  rewards: Reward[];
  currentPoints: number;
  isLoading: boolean;
}

const RewardsList: React.FC<RewardsListProps> = ({ rewards, currentPoints, isLoading }) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { formatPrice } = useRegionalPricing();
  
  const handleRedeem = (reward: Reward) => {
    // In a real implementation, this would call an API to redeem the reward
    toast({
      title: t('rewards.redeemingReward'),
      description: t('rewards.processingRedemption', { reward: reward.name }),
    });
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('rewards.availableRewards')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getRewardIcon = (reward: Reward) => {
    if (reward.reward_type.includes('wellness')) {
      return <Heart className="h-5 w-5" />;
    } else if (reward.reward_type.includes('referral')) {
      return <Gift className="h-5 w-5" />;
    } else {
      return <CircleCheck className="h-5 w-5" />;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('rewards.availableRewards')}</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <Badge variant="outline" className="ml-2">{t('rewards.claimed')}</Badge>
                )}
                {reward.status === 'limited' && (
                  <Badge variant="secondary" className="ml-2">{t('rewards.limited')}</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-sm font-medium">{reward.value} {t('rewards.points')}</span>
                <Button 
                  variant={reward.claimed ? "outline" : (currentPoints >= (reward.value || 0) ? "default" : "outline")}
                  disabled={reward.claimed || currentPoints < (reward.value || 0)}
                  size="sm"
                  onClick={() => handleRedeem(reward)}
                >
                  {reward.claimed 
                    ? t('rewards.claimed') 
                    : (currentPoints >= (reward.value || 0) 
                      ? t('rewards.redeem') 
                      : t('rewards.notEnoughPoints'))
                  }
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <CirclePlus className="mr-2 h-4 w-4" />
          {t('rewards.viewMoreRewards')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardsList;
