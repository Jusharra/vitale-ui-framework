
import React, { useEffect, useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';

// Import refactored components
import SubscriptionDetails from '@/components/member/membership/SubscriptionDetails';
import MembershipTierCard from '@/components/member/membership/MembershipTierCard';
import BillingInformation from '@/components/member/membership/BillingInformation';
import PaymentHistory from '@/components/member/membership/PaymentHistory';
import { membershipTiers } from '@/components/member/membership/membershipData';

const Membership = () => {
  const { profile, isTrialing, isAuthenticated, refreshSubscription, membershipTier, subscription } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const upgradeRequired = location.state?.upgradeRequired;

  // Check subscription status on initial load only
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Try database first for faster response
        const { data: dbData, error: dbError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', profile?.id)
          .maybeSingle();
        
        if (!dbError && dbData) {
          setSubscriptionData({
            subscribed: dbData.status === 'active',
            subscription_tier: dbData.tier,
            subscription_end: dbData.current_period_end,
            assigned_partner: dbData.assigned_partner_id,
          });
          setIsLoading(false);
          return;
        }
        
        // Fallback to edge function
        const { data, error } = await supabase.functions.invoke('check-subscription');
        
        if (error) {
          console.warn('Edge function error, using fallback:', error);
          // Set fallback data to prevent infinite loading
          setSubscriptionData({
            subscribed: false,
            subscription_tier: null,
            subscription_end: null,
            assigned_partner: null,
          });
        } else {
          setSubscriptionData(data);
        }
        
        // Refresh auth context subscription data as well
        await refreshSubscription();
        
      } catch (error) {
        console.error('Error checking subscription:', error);
        // Set fallback data to prevent infinite loading
        setSubscriptionData({
          subscribed: false,
          subscription_tier: null,
          subscription_end: null,
          assigned_partner: null,
        });
        toast({
          title: t('common.error'),
          description: t('membership.errorFetchingSubscription'),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (profile?.id) {
      checkSubscription();
    } else if (isAuthenticated) {
      // If authenticated but no profile yet, still set loading to false
      setIsLoading(false);
    }
  }, [isAuthenticated, profile?.id, refreshSubscription, t, toast]);

  // When the user comes from an upgrade required redirect
  useEffect(() => {
    if (upgradeRequired) {
      toast({
        title: t('membership.upgradeRequired'),
        description: t('membership.upgradeRequiredDescription'),
        variant: "default",
      });
    }
  }, [upgradeRequired, t, toast]);

  // Adapt subscription data to match expected format in subcomponents
  // Convert current_period_end to a number if it's a string
  const adaptedSubscriptionData = {
    subscription: subscription ? {
      current_period_end: typeof subscription.current_period_end === 'string' 
        ? Math.floor(new Date(subscription.current_period_end).getTime() / 1000) // Convert string date to UNIX timestamp
        : subscription.current_period_end,
      status: subscription.status,
      cancel_at_period_end: subscription.cancel_at_period_end
    } : null
  };

  return (
    <MemberPageLayout 
      title={t('membership.tier')} 
      description={t('membership.manage')}
    >
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
          <TabsTrigger value="billing">{t('membership.billing')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            {/* Subscription Details */}
            <SubscriptionDetails 
              profile={{...profile, membership_tier: membershipTier}}
              isTrialing={isTrialing}
              membershipTiers={[...membershipTiers]}
              subscriptionData={adaptedSubscriptionData}
              isLoading={isLoading}
            />
            
            {/* Upgrade Alert if needed */}
            {upgradeRequired && (
              <Alert variant="default" className="border-yellow-300 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  {t('membership.upgradeRequiredFeatureAccess')}
                </AlertDescription>
              </Alert>
            )}
            
            {/* Membership Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {membershipTiers.map((tier) => (
                <MembershipTierCard 
                  key={tier.id}
                  tier={tier}
                  isCurrent={tier.id === membershipTier}
                  hasSubscription={!!subscription}
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
              subscriptionData={adaptedSubscriptionData} 
            />
            
            {/* Payment History */}
            <PaymentHistory 
              hasSubscription={!!subscription}
            />
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Membership;
