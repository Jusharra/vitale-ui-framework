
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface PointsCardProps {
  currentPoints: number;
  nextRewardThreshold: number;
  onViewActivity: () => void;
}

const PointsCard: React.FC<PointsCardProps> = ({
  currentPoints,
  nextRewardThreshold,
  onViewActivity
}) => {
  const progressPercentage = (currentPoints / nextRewardThreshold) * 100;

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
