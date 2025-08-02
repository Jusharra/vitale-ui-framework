
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MembershipTier {
  tier: string;
  count: number;
  percentage: number;
}

interface MembershipDistributionProps {
  membershipBreakdown: MembershipTier[];
  isLoading?: boolean;
}

const MembershipDistribution: React.FC<MembershipDistributionProps> = ({ membershipBreakdown, isLoading = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Distribution</CardTitle>
        <CardDescription>Breakdown by membership tier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-muted rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-16"></div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            membershipBreakdown.map((item) => (
              <div key={item.tier}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.tier}</span>
                  <span className="text-sm text-muted-foreground">{item.count} {item.tier === 'Premium Members' ? 'subscribers' : 'users'}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div 
                    className="h-2.5 rounded-full bg-primary"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">{item.percentage}%</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipDistribution;
