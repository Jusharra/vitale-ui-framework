import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { LoginFormValues } from '@/components/auth/LoginForm';
import { RegisterFormValues } from '@/components/auth/RegisterForm';
import { ForgotPasswordFormValues } from '@/components/auth/ForgotPasswordForm';

export const useAuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate limiting for login attempts (security)
  const [loginAttempts, setLoginAttempts] = useState(0);

  const onLoginSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const success = await signIn(values.email, values.password);
      
      if (!success) {
        setLoginAttempts(prev => prev + 1);
      } else {
        // Get the redirect path from session storage or default to dashboard
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        sessionStorage.removeItem('redirectAfterLogin'); // Clear it after use
        
        // Redirect to the appropriate dashboard based on user role
        navigate(redirectPath);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    // Ensure passwords match
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await signUp(values.email, values.password, values.fullName);
      
      if (success) {
        // Switch to login tab with a message
        setActiveTab("login");
        toast({
          title: "Account created",
          description: "Please check your email to verify your account",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setForgotPasswordLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setResetEmailSent(true);
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for further instructions",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred sending the reset email",
        variant: "destructive",
      });
      console.error("Error in password reset:", error);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    showForgotPassword,
    setShowForgotPassword,
    resetEmailSent,
    isLoading: isLoading || authLoading,
    forgotPasswordLoading,
    loginAttempts,
    onLoginSubmit,
    onRegisterSubmit,
    onForgotPasswordSubmit,
  };
};