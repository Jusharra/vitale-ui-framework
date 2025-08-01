import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CalendarDays, TrendingUp, Crown, Clock } from 'lucide-react';

interface PlatformSubscription {
  id: string;
  status: string;
  trial_start_date: string;
  trial_end_date: string;
  subscription_start_date?: string;
  current_period_end?: string;
}

interface Partner {
  platform_subscription_active: boolean;
  full_revenue_eligible: boolean;
  platform_trial_ends_at: string;
}

const PlatformSubscriptionCard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<PlatformSubscription | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    try {
      // Fetch partner platform subscription
      const { data: subData, error: subError } = await supabase
        .from('partner_platform_subscriptions')
        .select('*')
        .eq('partner_id', user?.id)
        .single();

      if (subError && subError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subError);
      } else {
        setSubscription(subData);
      }

      // Fetch partner details
      const { data: partnerData, error: partnerError } = await supabase
        .from('partners')
        .select('platform_subscription_active, full_revenue_eligible, platform_trial_ends_at')
        .eq('id', user?.id)
        .single();

      if (partnerError) {
        console.error('Error fetching partner:', partnerError);
      } else {
        setPartner(partnerData);
      }
    } catch (error) {
      console.error('Error in fetchSubscriptionData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-partner-checkout');
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpgrading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!partner?.platform_trial_ends_at) return 0;
    const endDate = new Date(partner.platform_trial_ends_at);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getRevenueSharePercentage = () => {
    return partner?.full_revenue_eligible ? 100 : 70;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isOnTrial = subscription?.status === 'trial' || !partner?.platform_subscription_active;
  const daysRemaining = getDaysRemaining();
  const revenueShare = getRevenueSharePercentage();

  return (
    <Card className="relative overflow-hidden">
      {partner?.platform_subscription_active && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium Partner
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Platform Subscription
        </CardTitle>
        <CardDescription>
          Upgrade to unlock 100% revenue share on all member subscriptions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">Current Plan</div>
            <div className="flex items-center gap-2">
              <Badge variant={isOnTrial ? "outline" : "default"}>
                {isOnTrial ? "Trial" : "Premium"}
              </Badge>
              <span className="text-2xl font-bold">{revenueShare}%</span>
              <span className="text-sm text-gray-500">revenue share</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-600">
              {isOnTrial ? "Trial Ends" : "Next Billing"}
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                {isOnTrial 
                  ? `${daysRemaining} days remaining`
                  : subscription?.current_period_end 
                    ? new Date(subscription.current_period_end).toLocaleDateString()
                    : "N/A"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Benefits Comparison */}
        <div className="border rounded-lg p-4 space-y-3">
          <h4 className="font-medium">Platform Benefits</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-600 mb-2">Current (70% share)</div>
              <ul className="space-y-1 text-gray-500">
                <li>• Standard revenue split</li>
                <li>• Basic partner tools</li>
                <li>• Email support</li>
              </ul>
            </div>
            <div>
              <div className="font-medium text-purple-600 mb-2">Premium (100% share)</div>
              <ul className="space-y-1 text-purple-600">
                <li>• Full revenue retention</li>
                <li>• Advanced analytics</li>
                <li>• Priority support</li>
                <li>• Custom branding</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Revenue Impact */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-medium text-green-800">Revenue Impact</span>
          </div>
          <p className="text-sm text-green-700">
            With 100% revenue share, you keep an additional 30% of all member subscription fees.
            For a $1,297 monthly member, that's an extra $389/month per member.
          </p>
        </div>

        {/* Action Button */}
        {isOnTrial ? (
          <div className="space-y-3">
            {daysRemaining > 0 && (
              <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
                <Clock className="w-4 h-4" />
                <span>
                  Your trial expires in {daysRemaining} days. Upgrade now to maintain 100% revenue share.
                </span>
              </div>
            )}
            
            <Button 
              onClick={handleUpgrade}
              disabled={upgrading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              size="lg"
            >
              {upgrading ? "Processing..." : "Upgrade to Premium - $1,000/month"}
            </Button>
            
            <p className="text-xs text-center text-gray-500">
              12-month free trial • Cancel anytime • No setup fees
            </p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-green-600 font-medium">✓ Premium Partner Active</div>
            <p className="text-sm text-gray-500">
              You're earning 100% revenue share on all member subscriptions
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlatformSubscriptionCard;