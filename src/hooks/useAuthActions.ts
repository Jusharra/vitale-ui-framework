
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/types/auth';

export function useAuthActions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sign in with email and password with enhanced security checks
  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      const { error, data } = await supabase.auth.signInWithPassword({
        email, password
      });
      
      if (error) throw error;
      
      // Check if the session was created successfully
      if (!data.session) {
        throw new Error("Failed to create a session. Please try again.");
      }
      
      navigate('/dashboard');
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in",
      });
      
      return true;
    } catch (error: any) {
      // Provide user-friendly error messages without revealing specific details
      let errorMessage = "Sign in failed";
      if (error.message) {
        // Sanitize error messages to prevent information leakage
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Invalid email or password";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Please confirm your email before signing in";
        } else {
          errorMessage = "Authentication failed. Please try again.";
        }
      }
      
      console.error("Sign in error:", error);
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Sign up with email and password with enhanced validation
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      // Validate input
      if (!email || !password || !fullName) {
        throw new Error("Email, password, and full name are required");
      }
      
      // Basic password strength validation
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }
      
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
      // Provide security-conscious error messages
      let errorMessage = "Sign up failed";
      
      if (error.message) {
        if (error.message.includes("already registered")) {
          errorMessage = "An account with this email already exists";
        } else if (error.message.length < 100) { // Avoid displaying long error messages
          errorMessage = error.message;
        }
      }
      
      console.error("Sign up error:", error);
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Sign out with improved error handling
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any sensitive data from localStorage
      localStorage.removeItem('lastRoute');
      
      navigate('/');
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Update user profile with security validations
  const updateProfile = async (userId: string, data: Partial<UserProfile>) => {
    if (!userId) return false;
    
    try {
      // Security validation - prevent updating role to admin
      if (data.role === 'admin') {
        // Role elevation should be handled by a separate admin function
        throw new Error("Unauthorized role update");
      }
      
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
      
      if (data.role && data.role !== 'admin') userUpdates.role = data.role;
      
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
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
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
