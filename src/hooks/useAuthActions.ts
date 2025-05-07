
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile, UserRole } from '@/types/auth';

export function useAuthActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Sign up error:", error);
      
      toast({
        title: "Sign up failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });

      navigate('/auth');
      return true;
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update user profile
  const updateProfile = async (userId: string, data: Partial<UserProfile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error.message || "There was a problem updating your profile.",
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
