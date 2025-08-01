
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Base hook that provides the core tool access checking functionality
 * Now simplified for single membership tier - users either have premium access or they don't
 */
export function useToolAccess() {
  const hasToolAccess = useCallback(async (userId: string | null, toolName: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Primary check: Active subscription with premium tier
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('status, tier')
        .eq('user_id', userId)
        .eq('status', 'active')
        .eq('tier', 'premium')
        .single();
      
      if (!subError && subscription) {
        return true; // Active premium subscription grants access
      }
      
      // No active subscription found
      return false;
    } catch (error) {
      console.error('Error checking tool access:', error);
      return false;
    }
  }, []);

  return { hasToolAccess };
}

/**
 * Hook for checking access with state management
 * Returns an object with hasAccess boolean and isChecking loading state
 */
export function useAccessCheck(userId: string | null, toolName: string) {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const { hasToolAccess } = useToolAccess();
  
  useEffect(() => {
    const checkAccess = async () => {
      console.log('useAccessCheck: Checking access for user:', userId, 'tool:', toolName);
      setIsChecking(true);
      
      try {
        const access = await hasToolAccess(userId, toolName);
        console.log('useAccessCheck: Access result:', access);
        setHasAccess(access);
      } catch (error) {
        console.error('useAccessCheck: Error checking access:', error);
        setHasAccess(false);
      }
      
      setIsChecking(false);
    };
    
    if (userId) {
      checkAccess();
    } else {
      console.log('useAccessCheck: No userId, setting access to false');
      setHasAccess(false);
      setIsChecking(false);
    }
  }, [userId, toolName, hasToolAccess]);
  
  console.log('useAccessCheck: Current state - hasAccess:', hasAccess, 'isChecking:', isChecking);
  
  return { 
    hasAccess, 
    isChecking 
  };
}
