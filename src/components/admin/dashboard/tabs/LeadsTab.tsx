
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface LeadSource {
  name: string;
  count: number;
  percentage: number;
}

interface LeadStatsProps {
  leadStats: {
    newLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    conversionRate: number;
    sources: LeadSource[];
  };
}

const LeadsTab: React.FC<LeadStatsProps> = ({ leadStats }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{leadStats.newLeads}</CardTitle>
            <CardDescription>New Leads</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{leadStats.qualifiedLeads}</CardTitle>
            <CardDescription>Qualified Leads</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{leadStats.convertedLeads}</CardTitle>
            <CardDescription>Converted Leads</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{leadStats.conversionRate}%</CardTitle>
            <CardDescription>Conversion Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lead Sources</CardTitle>
          <CardDescription>Where leads are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leadStats.sources.map((source) => (
              <div key={source.name} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{source.name}</span>
                  <span className="text-sm">{source.count} leads ({source.percentage}%)</span>
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

export default LeadsTab;
