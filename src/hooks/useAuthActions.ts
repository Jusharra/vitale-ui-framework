
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';

export function useAuthActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) throw error;
      
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'member',
          },
        },
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Welcome to Vitale Health Concierge!",
      });
      
      // Redirect to dashboard after signup
      navigate('/dashboard');
      return true;
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update user profile
  const updateProfile = async (userId: string, data: Partial<UserProfile>) => {
    if (!userId) return false;
    
    try {
      // Update profiles table first
      if (data.full_name) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ full_name: data.full_name })
          .eq('id', userId);
          
        if (profileError) throw profileError;
      }
      
      // Then update users table if needed
      const userUpdates: any = {};
      
      if (data.role) userUpdates.role = data.role;
      
      if (Object.keys(userUpdates).length > 0) {
        const { error: userError } = await supabase
          .from('users')
          .update(userUpdates)
          .eq('id', userId);
          
        if (userError) throw userError;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    updateProfile
  };
}
