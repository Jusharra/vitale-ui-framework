
import React, { useEffect, useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Import refactored components
import SubscriptionDetails from '@/components/member/membership/SubscriptionDetails';
import MembershipTierCard from '@/components/member/membership/MembershipTierCard';
import BillingInformation from '@/components/member/membership/BillingInformation';
import PaymentHistory from '@/components/member/membership/PaymentHistory';
import { membershipTiers } from '@/components/member/membership/membershipData';

const Membership = () => {
  const { profile, isTrialing, isAuthenticated } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;
        setSubscriptionData(data);
        
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSubscription();
  }, [isAuthenticated]);

  return (
    <MemberPageLayout 
      title="Membership" 
      description="Manage your membership plan and billing"
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Subscription Details */}
            <SubscriptionDetails 
              profile={profile}
              isTrialing={isTrialing}
              membershipTiers={membershipTiers}
              subscriptionData={subscriptionData}
              isLoading={isLoading}
            />
            
            {/* Membership Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => (
                <MembershipTierCard 
                  key={tier.id}
                  tier={tier}
                  isCurrent={tier.id === profile?.membership_tier}
                  hasSubscription={!!subscriptionData?.subscription}
                />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="mt-6">
          <div className="space-y-6">
            {/* Billing Information */}
            <BillingInformation 
              isLoading={isLoading} 
              subscriptionData={subscriptionData} 
            />
            
            {/* Payment History */}
            <PaymentHistory 
              hasSubscription={!!subscriptionData?.subscription}
            />
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Membership;
