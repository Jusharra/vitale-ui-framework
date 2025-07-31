
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
      // Simple check - if user has premium membership, they have access to all tools
      const { data, error } = await supabase
        .from('profiles')
        .select('membership_tier')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Premium members have access to all tools
      return data?.membership_tier === 'premium';
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
      setIsChecking(true);
      const access = await hasToolAccess(userId, toolName);
      setHasAccess(access);
      setIsChecking(false);
    };
    
    if (userId) {
      checkAccess();
    } else {
      setHasAccess(false);
      setIsChecking(false);
    }
  }, [userId, toolName, hasToolAccess]);
  
  return { 
    hasAccess, 
    isChecking 
  };
}
