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
      
      // Check if user exists and has a role
      if (user) {
        // Option 1: Use the role from auth context if available
        if (userRole) {
          setIsAdmin(userRole === 'admin');
          setIsLoading(false);
          return;
        }
        
        // Option 2: Check profiles table for admin role
        try {
          const { data, error } = await supabase
            .from('profiles')
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
      // Call a server-side function to perform the reset
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