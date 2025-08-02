
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import components
import AdminDashboardHeader from '@/components/admin/dashboard/AdminDashboardHeader';
import SystemStats from '@/components/admin/dashboard/SystemStats';
import SystemAlerts from '@/components/admin/dashboard/SystemAlerts';
import OverviewTab from '@/components/admin/dashboard/OverviewTab';
import LeadsTab from '@/components/admin/dashboard/tabs/LeadsTab';
import PartnersTab from '@/components/admin/dashboard/tabs/PartnersTab';
import RewardsTab from '@/components/admin/dashboard/tabs/RewardsTab';
import PromotionsTab from '@/components/admin/dashboard/tabs/PromotionsTab';

// Import hooks and mock data
import { useUserDistribution } from '@/hooks/useUserDistribution';
import { 
  systemStats, 
  recentActivities, 
  systemAlerts, 
  leadStats, 
  partnerStats, 
  rewardsStats, 
  promotionStats
} from '@/components/admin/dashboard/mockData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { membershipBreakdown, isLoading } = useUserDistribution();

  return (
    <div className="space-y-8">
      <AdminDashboardHeader />

      {/* System Alerts Section */}
      {systemAlerts.length > 0 && (
        <SystemAlerts alerts={systemAlerts} />
      )}

      {/* Overview Cards */}
      <SystemStats stats={systemStats} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview">
          <OverviewTab 
            membershipBreakdown={membershipBreakdown}
            recentActivities={recentActivities}
            isLoading={isLoading}
          />
        </TabsContent>
        
        {/* Leads Tab */}
        <TabsContent value="leads">
          <LeadsTab leadStats={leadStats} />
        </TabsContent>
        
        {/* Partners Tab */}
        <TabsContent value="partners">
          <PartnersTab 
            partnerStats={partnerStats}
            totalProfessionals={systemStats.totalProfessionals}
          />
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards">
          <RewardsTab rewardsStats={rewardsStats} />
        </TabsContent>
        
        {/* Promotions Tab */}
        <TabsContent value="promotions">
          <PromotionsTab promotionStats={promotionStats} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
