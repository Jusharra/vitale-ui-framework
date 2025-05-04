
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Base hook that provides the core tool access checking functionality
 */
export function useToolAccess() {
  // Check tool access based on membership tier
  const hasToolAccess = useCallback(async (userId: string | null, toolName: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const { data } = await supabase.rpc('check_tool_access', {
        user_id: userId,
        tool_name: toolName
      });
      
      return !!data;
    } catch (error) {
      console.error(`Error checking access for ${toolName}:`, error);
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
      if (!userId || !toolName) {
        setHasAccess(false);
        setIsChecking(false);
        return;
      }
      
      setIsChecking(true);
      const access = await hasToolAccess(userId, toolName);
      setHasAccess(access);
      setIsChecking(false);
    };
    
    checkAccess();
  }, [userId, toolName, hasToolAccess]);
  
  return { hasAccess, isChecking };
}
