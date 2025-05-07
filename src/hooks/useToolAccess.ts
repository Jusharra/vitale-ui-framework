
import { useCallback, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Base hook that provides the core tool access checking functionality
 */
export function useToolAccess() {
  const hasToolAccess = useCallback(async (userId: string | null, toolName: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // Call the check_tool_access database function
      const { data, error } = await supabase.rpc('check_tool_access', {
        user_id: userId,
        tool_name: toolName
      });
      
      if (error) throw error;
      
      return !!data;
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
