
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
      
      // Query subscriptions table for the user
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.log("No subscription found, using default:", error);
        // If no subscription data, use default values
        setSubscription({
          id: 'default',
          status: 'active',
          tier: 'smart' as MembershipTier,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false
        });
        setIsTrialing(false);
        return;
      }
      
      if (data) {
        const subscriptionData: Subscription = {
          id: data.id,
          status: data.status,
          tier: data.tier as MembershipTier,
          current_period_end: data.current_period_end,
          cancel_at_period_end: data.cancel_at_period_end
        };
        
        setSubscription(subscriptionData);
        setIsTrialing(data.status === 'trialing');
      } else {
        // Default subscription for users
        setSubscription({
          id: 'default',
          status: 'active',
          tier: 'smart' as MembershipTier,
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancel_at_period_end: false
        });
        setIsTrialing(false);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Default subscription on error
      setSubscription({
        id: 'default',
        status: 'active',
        tier: 'smart' as MembershipTier,
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      });
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
