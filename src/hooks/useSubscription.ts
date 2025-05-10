
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Subscription, MembershipTier } from '@/types/auth';

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
        throw error;
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
        setSubscription(null);
        setIsTrialing(false);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setSubscription(null);
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
