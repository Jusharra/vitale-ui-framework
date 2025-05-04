
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function useAdminStatus() {
  const { user, userRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true);
      
      // First check the cached user role from Auth context
      if (userRole === 'admin') {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      // If not determined yet, check from database
      if (user?.id) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          setIsAdmin(data?.role === 'admin');
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    };
    
    checkAdminStatus();
  }, [user, userRole]);
  
  return { isAdmin, isLoading };
}

export function useAdminToolkit() {
  const { isAdmin, isLoading } = useAdminStatus();
  
  const resetUserPassword = async (userId: string): Promise<boolean> => {
    if (!isAdmin) return false;
    
    try {
      // This would normally call a supabase function that uses admin/service role
      // to reset the password and send an email
      const { data, error } = await supabase.functions.invoke('admin-reset-password', {
        body: { userId }
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error resetting user password:', error);
      return false;
    }
  };
  
  return {
    isAdmin,
    isLoading,
    resetUserPassword,
  };
}
