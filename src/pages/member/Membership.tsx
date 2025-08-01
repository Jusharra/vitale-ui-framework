
import React, { useEffect } from 'react';
import RoleAwareLayout from '@/components/layout/RoleAwareLayout';
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
  const { profile, isTrialing, membershipTier, subscription, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const upgradeRequired = location.state?.upgradeRequired;

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

  return (
    <RoleAwareLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('membership.tier')}</h1>
          <p className="text-muted-foreground">
            {t('membership.manage')}
          </p>
        </div>
        <div className="space-y-8">
        {/* Subscription Status */}
        <SubscriptionDetails 
          profile={profile}
          isTrialing={isTrialing}
          subscription={subscription}
          membershipTier={membershipTier}
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
        
        {/* Membership Plans Selection */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{subscription ? 'Change Plan' : 'Choose Your Plan'}</h2>
            <p className="text-muted-foreground">
              {subscription 
                ? 'Upgrade or switch to a different membership plan' 
                : 'Select a membership plan to get started with premium healthcare services'
              }
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {membershipTiers.map((tier) => (
              <MembershipTierCard 
                key={tier.id}
                tier={tier}
                isCurrent={membershipTier === 'premium' && tier.id === 'premium'}
                hasSubscription={!!subscription}
              />
            ))}
          </div>
        </div>
        
        {/* Billing Information - Only show if subscription exists */}
        {subscription && (
          <div className="space-y-6">
            <BillingInformation 
              isLoading={isLoading} 
              subscription={subscription} 
            />
            
            <PaymentHistory 
              hasSubscription={!!subscription}
            />
          </div>
        )}
        </div>
      </div>
    </RoleAwareLayout>
  );
};

export default Membership;
