
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tag, TrendingUp, Gift } from 'lucide-react';

interface PromotionSource {
  name: string;
  percentage: number;
}

interface PromotionStatsProps {
  promotionStats: {
    totalActive: number;
    clickThrough: number;
    claimRate: number;
    sources: PromotionSource[];
  };
}

const PromotionsTab: React.FC<PromotionStatsProps> = ({ promotionStats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-indigo-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Tag className="h-5 w-5 text-indigo-600" />
            </div>
            <CardTitle className="text-4xl">{promotionStats.totalActive}</CardTitle>
            <CardDescription>Active Promotions</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-violet-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-violet-600" />
            </div>
            <CardTitle className="text-4xl">{promotionStats.clickThrough}%</CardTitle>
            <CardDescription>Average Click Rate</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Gift className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-4xl">{promotionStats.claimRate}%</CardTitle>
            <CardDescription>Average Claim Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Promotion Sources</CardTitle>
          <CardDescription>Where promotions are being claimed from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promotionStats.sources.map((source) => (
              <div key={source.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{source.name}</span>
                  <span className="text-sm">{source.percentage}%</span>
                </div>
                <Progress value={source.percentage} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionsTab;
