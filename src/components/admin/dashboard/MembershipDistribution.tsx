
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MembershipTier {
  tier: string;
  count: number;
  percentage: number;
}

interface MembershipDistributionProps {
  membershipBreakdown: MembershipTier[];
}

const MembershipDistribution: React.FC<MembershipDistributionProps> = ({ membershipBreakdown }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Distribution</CardTitle>
        <CardDescription>Breakdown by membership tier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {membershipBreakdown.map((item) => (
            <div key={item.tier}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{item.tier}</span>
                <span className="text-sm text-muted-foreground">{item.count} members</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full bg-primary"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-muted-foreground">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <span>View Detailed Report</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MembershipDistribution;
