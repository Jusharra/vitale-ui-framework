import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import FamilyMemberManager from '@/components/member/membership/FamilyMemberManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FamilyMembershipCard from '@/components/member/membership/FamilyMembershipCard';
import { membershipTiers } from '@/components/member/membership/membershipData';
import { useAuth } from '@/context/AuthContext';

const FamilyManagement: React.FC = () => {
  const { membershipTier } = useAuth();
  const premiumTier = membershipTiers[0]; // Get the premium tier

  return (
    <MemberPageLayout title="Family Management">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Family Management</h1>
          <p className="text-muted-foreground">
            Manage your family subscription and add family members
          </p>
        </div>

        <Tabs defaultValue="management" className="space-y-6">
          <TabsList>
            <TabsTrigger value="management">Manage Family</TabsTrigger>
            <TabsTrigger value="subscription">Family Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <FamilyMemberManager />
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <FamilyMembershipCard
                tier={premiumTier}
                isCurrent={membershipTier === 'premium'}
                hasSubscription={!!membershipTier}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MemberPageLayout>
  );
};

export default FamilyManagement;