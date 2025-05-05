
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PointsCardProps {
  currentPoints: number;
  lifetimeEarned?: number;
  nextRewardThreshold?: number;
  onViewActivity?: () => void;
  isLoading?: boolean;
}

const PointsCard: React.FC<PointsCardProps> = ({
  currentPoints,
  lifetimeEarned,
  nextRewardThreshold = 1000,
  onViewActivity,
  isLoading = false
}) => {
  const progressPercentage = (currentPoints / nextRewardThreshold) * 100;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Rewards</CardTitle>
          <CardDescription>Points earned from health activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse text-center">
            <div className="h-10 w-20 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-2 bg-gray-200 rounded mb-1"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mx-auto mt-1"></div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="h-10 w-full bg-gray-200 rounded"></div>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Rewards</CardTitle>
        <CardDescription>Points earned from health activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{currentPoints}</div>
          <p className="text-muted-foreground mb-4">Current Points</p>
          
          <div className="mb-1">
            <div className="flex justify-between text-sm mb-1">
              <span>{currentPoints} points</span>
              <span>{nextRewardThreshold} points</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {nextRewardThreshold - currentPoints} more points until your next reward
          </p>
          {lifetimeEarned && (
            <p className="text-xs text-muted-foreground mt-3">
              Lifetime earned: {lifetimeEarned} points
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onViewActivity}>
          View Activity History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PointsCard;
