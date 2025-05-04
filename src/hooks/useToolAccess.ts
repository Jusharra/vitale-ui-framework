
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useToolAccess = (toolName: string) => {
  const { isAuthenticated, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Convert to async function that returns a Promise
  const checkAccess = useCallback(async () => {
    if (!isAuthenticated || !profile) {
      setHasAccess(false);
      setIsLoading(false);
      return false;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.rpc('check_tool_access', {
        user_id: profile.id,
        tool_name: toolName
      });

      if (error) throw error;
      const hasToolAccess = !!data;
      setHasAccess(hasToolAccess);
      return hasToolAccess;
    } catch (error) {
      console.error(`Error checking access for tool ${toolName}:`, error);
      setHasAccess(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, profile, toolName]);

  // Initial check
  useState(() => {
    checkAccess();
  });

  return { hasAccess, isLoading, checkAccess };
};

export default useToolAccess;
