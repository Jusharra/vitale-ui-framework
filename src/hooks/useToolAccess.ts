
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Base hook that provides the core tool access checking functionality
 */
export function useToolAccess() {
  // Check tool access based on membership tier or admin role
  const hasToolAccess = useCallback(async (userId: string | null, toolName: string): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      // First check if user is admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (userError) {
        console.error("Error checking user role:", userError);
      } else if (userData?.role === 'admin') {
        // Admins have access to all tools
        return true;
      }
      
      // If not admin, check tool access based on membership tier
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
