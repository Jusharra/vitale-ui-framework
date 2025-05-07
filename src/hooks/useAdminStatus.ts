
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export function useAdminStatus() {
  const { userRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Authentication removed, always set to not admin
    setIsAdmin(false);
    setIsLoading(false);
  }, []);
  
  return { isAdmin, isLoading };
}

export function useAdminToolkit() {
  const { isAdmin, isLoading } = useAdminStatus();
  
  const resetUserPassword = async (userId: string): Promise<boolean> => {
    // Authentication removed
    console.log('Password reset functionality removed', userId);
    return false;
  };
  
  return {
    isAdmin,
    isLoading,
    resetUserPassword,
  };
}
