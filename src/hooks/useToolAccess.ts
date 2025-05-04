
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useToolAccess = (toolName: string) => {
  const { isAuthenticated, profile } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated || !profile) {
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase.rpc('check_tool_access', {
          user_id: profile.id,
          tool_name: toolName
        });

        if (error) throw error;
        setHasAccess(!!data);
      } catch (error) {
        console.error(`Error checking access for tool ${toolName}:`, error);
        setHasAccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [isAuthenticated, profile, toolName]);

  return { hasAccess, isLoading };
};

export default useToolAccess;
