
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Subscription } from '@/types/auth';

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);

  // Check and update subscription data
  const checkSubscription = async () => {
    if (!userId) return;
    
    try {
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
    }
  };
  
  const refreshSubscription = async () => {
    await checkSubscription();
  };

  return {
    subscription,
    isTrialing,
    checkSubscription,
    refreshSubscription,
    setSubscription,
    setIsTrialing
  };
}
