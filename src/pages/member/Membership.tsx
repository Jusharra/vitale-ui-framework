
import React, { useEffect, useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

// Import refactored components
import SubscriptionDetails from '@/components/member/membership/SubscriptionDetails';
import MembershipTierCard from '@/components/member/membership/MembershipTierCard';
import BillingInformation from '@/components/member/membership/BillingInformation';
import PaymentHistory from '@/components/member/membership/PaymentHistory';
import { membershipTiers } from '@/components/member/membership/membershipData';

const Membership = () => {
  const { profile, isTrialing, isAuthenticated, refreshSubscription } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  const upgradeRequired = location.state?.upgradeRequired;

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) throw error;
        setSubscriptionData(data);
        
        // Refresh auth context subscription data as well
        refreshSubscription();
        
      } catch (error) {
        console.error('Error checking subscription:', error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSubscription();
    
    // Set up periodic refresh (every 30 seconds)
    const refreshInterval = setInterval(checkSubscription, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refreshSubscription]);

  // When the user comes from an upgrade required redirect
  useEffect(() => {
    if (upgradeRequired) {
      toast({
        title: "Upgrade Required",
        description: "This feature requires a higher membership tier. Please upgrade your plan to access it.",
        variant: "default",
      });
    }
  }, [upgradeRequired]);

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
            
            {/* Upgrade Alert if needed */}
            {upgradeRequired && (
              <Alert variant="warning" className="border-yellow-300 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  You attempted to access a feature that requires a higher membership tier.
                  Please upgrade your plan to access all features.
                </AlertDescription>
              </Alert>
            )}
            
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
