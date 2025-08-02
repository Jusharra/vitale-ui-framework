
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Partner {
  name: string;
  revenue: number;
  specialties: string[];
}

interface PartnerStatsProps {
  partnerStats: {
    topPerformers: Partner[];
    totalRevenue: number;
    activePartners: number;
  };
  totalProfessionals: number;
}

const PartnersTab: React.FC<PartnerStatsProps> = ({ partnerStats, totalProfessionals }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Partners</CardTitle>
            <CardDescription>By revenue generated</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partnerStats.topPerformers.map((partner, idx) => (
                <div key={idx} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{partner.name}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {partner.specialties.map((specialty, i) => (
                        <span 
                          key={i}
                          className="bg-blue-50 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${partner.revenue}</p>
                    <p className="text-xs text-muted-foreground">Revenue MTD</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Partner Overview</CardTitle>
            <CardDescription>Active partners and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Active Partners</span>
                  <span className="text-2xl font-semibold">{partnerStats.activePartners}</span>
                </div>
                <Progress value={(partnerStats.activePartners / totalProfessionals) * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((partnerStats.activePartners / totalProfessionals) * 100)}% of total partners
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Total Partner Revenue</span>
                  <span className="text-2xl font-semibold">${partnerStats.totalRevenue}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnersTab;
