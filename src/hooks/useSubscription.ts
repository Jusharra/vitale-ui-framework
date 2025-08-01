import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { MembershipTier } from '@/types/auth';

// Define the Subscription type here since it's missing from auth types
export interface Subscription {
  id: string;
  status: string;
  tier: MembershipTier;
  current_period_end: string | number;
  cancel_at_period_end: boolean;
}

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      checkSubscription();
    } else {
      setSubscription(null);
      setIsTrialing(false);
      setIsLoading(false);
    }
  }, [userId]);

  const checkSubscription = async () => {
    if (!userId) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Use enhanced check-subscription edge function
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.log("Error checking subscription via edge function:", error);
        // Fallback to local database check
        const { data: dbData, error: dbError } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();
        
        if (dbError || !dbData) {
          // No subscription found - set to null to show proper subscription prompt
          setSubscription(null);
          setIsTrialing(false);
          return;
        }
        
        const subscriptionData: Subscription = {
          id: dbData.id,
          status: dbData.status,
          tier: dbData.tier as MembershipTier,
          current_period_end: dbData.current_period_end,
          cancel_at_period_end: dbData.cancel_at_period_end
        };
        
        setSubscription(subscriptionData);
        setIsTrialing(dbData.status === 'trialing');
        return;
      }
      
      // Handle edge function response
      if (data.subscribed) {
        const subscriptionData: Subscription = {
          id: 'stripe-subscription',
          status: 'active',
          tier: data.subscription_tier as MembershipTier,
          current_period_end: data.subscription_end,
          cancel_at_period_end: data.cancel_at_period_end || false
        };
        
        setSubscription(subscriptionData);
        setIsTrialing(data.trial_status?.trial_status === 'active');
      } else {
        // No active subscription
        setSubscription(null);
        setIsTrialing(false);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // On error, set to null to show proper subscription prompt
      setSubscription(null);
      setIsTrialing(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshSubscription = async () => {
    await checkSubscription();
  };

  return {
    subscription,
    isTrialing,
    isLoading,
    checkSubscription,
    refreshSubscription,
    setSubscription,
    setIsTrialing
  };
}