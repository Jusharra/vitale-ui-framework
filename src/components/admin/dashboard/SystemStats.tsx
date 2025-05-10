
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, TrendingUp, User, Award } from 'lucide-react';

interface SystemStatsProps {
  stats: {
    totalMembers: number;
    totalProfessionals?: number;
    activeSubscriptions?: number;
    pendingApprovals?: number;
    revenue: {
      mtd: number;
      ytd: number;
    };
    newLeadsThisWeek: number;
    referralConversions: number;
  };
}

const SystemStats: React.FC<SystemStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-4xl">{stats.totalMembers}</CardTitle>
          <CardDescription>Total Members</CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <CardTitle className="text-4xl">${(stats.revenue.mtd / 1000).toFixed(1)}k</CardTitle>
          <CardDescription>Revenue MTD</CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="bg-blue-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-4xl">{stats.newLeadsThisWeek}</CardTitle>
          <CardDescription>New Leads This Week</CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="bg-purple-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
            <Award className="h-5 w-5 text-purple-600" />
          </div>
          <CardTitle className="text-4xl">{stats.referralConversions}</CardTitle>
          <CardDescription>Referral Conversions</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SystemStats;
