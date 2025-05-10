
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/types/auth';

export function useAuthActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      console.log("Sign in successful:", data);
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
      console.log("Attempting to sign up with:", email);
      
      // First, create the auth user
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

      console.log("Sign up successful, user created:", data);
      
      // If successful and we have a user, create a profile entry manually
      if (data.user) {
        try {
          const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'member'
          });
          
          if (profileError) {
            console.error("Error creating profile during signup:", profileError);
          }
        } catch (profileCreateError) {
          console.error("Exception creating profile:", profileCreateError);
        }
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
