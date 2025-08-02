
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Building2, TrendingUp, Gift, Megaphone, Heart } from 'lucide-react';
import MembershipReports from './reports/MembershipReports';
import LeadsReports from './reports/LeadsReports';
import PartnersReports from './reports/PartnersReports';
import FacilitiesReports from './reports/FacilitiesReports';

// Placeholder components for upcoming reports
const RewardsReports = () => (
  <div className="text-center py-10">
    <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium mb-2">Rewards Reports</h3>
    <p className="text-muted-foreground">Coming soon - Track reward redemptions and engagement</p>
  </div>
);

const PromotionsReports = () => (
  <div className="text-center py-10">
    <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium mb-2">Promotions Reports</h3>
    <p className="text-muted-foreground">Coming soon - Analyze promotion effectiveness and ROI</p>
  </div>
);

const CaregiversReports = () => (
  <div className="text-center py-10">
    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
    <h3 className="text-lg font-medium mb-2">Caregivers Reports</h3>
    <p className="text-muted-foreground">Coming soon - Monitor caregiver activity and performance</p>
  </div>
);

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState('membership');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Comprehensive Reports</CardTitle>
          <CardDescription>
            View and analyze all platform data with advanced filtering and export capabilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="membership" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="membership" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="hidden sm:inline">Membership</span>
              </TabsTrigger>
              <TabsTrigger value="leads" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="hidden sm:inline">Leads</span>
              </TabsTrigger>
              <TabsTrigger value="partners" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="hidden sm:inline">Partners</span>
              </TabsTrigger>
              <TabsTrigger value="facilities" className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                <span className="hidden sm:inline">Facilities</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                <span className="hidden sm:inline">Rewards</span>
              </TabsTrigger>
              <TabsTrigger value="promotions" className="flex items-center gap-1">
                <Megaphone className="h-3 w-3" />
                <span className="hidden sm:inline">Promotions</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="membership" className="space-y-6">
                <MembershipReports />
              </TabsContent>

              <TabsContent value="leads" className="space-y-6">
                <LeadsReports />
              </TabsContent>

              <TabsContent value="partners" className="space-y-6">
                <PartnersReports />
              </TabsContent>

              <TabsContent value="facilities" className="space-y-6">
                <FacilitiesReports />
              </TabsContent>

              <TabsContent value="rewards" className="space-y-6">
                <RewardsReports />
              </TabsContent>

              <TabsContent value="promotions" className="space-y-6">
                <PromotionsReports />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReports;
