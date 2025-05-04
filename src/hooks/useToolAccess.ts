
import { supabase } from '@/integrations/supabase/client';

export function useToolAccess() {
  // Check tool access based on membership tier
  const hasToolAccess = async (userId: string | null, toolName: string): Promise<boolean> => {
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
  };

  return { hasToolAccess };
}
