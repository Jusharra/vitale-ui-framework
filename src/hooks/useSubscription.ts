
import { useState } from 'react';
import type { Subscription } from '@/types/auth';

export function useSubscription(userId: string | null) {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isTrialing, setIsTrialing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // No-op check subscription function since auth is removed
  const checkSubscription = async () => {
    setIsLoading(false);
    return;
  };
  
  // No-op refresh subscription function
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
