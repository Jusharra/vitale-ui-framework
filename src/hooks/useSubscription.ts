
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Subscription } from '@/types/auth';

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check and update subscription data
  const checkSubscription = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      if (data?.subscription) {
        setSubscription(data.subscription);
      } else {
        setSubscription(null);
      }

      // Update trial status based on subscription data
      if (data?.isTrialing !== undefined) {
        setIsTrialing(data.isTrialing);
      }
      
    } catch (error) {
      console.error("Error checking subscription:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial subscription check
  useEffect(() => {
    checkSubscription();
  }, [userId]);
  
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
