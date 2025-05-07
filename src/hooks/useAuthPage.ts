
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LoginFormValues } from '@/components/auth/LoginForm';
import { RegisterFormValues } from '@/components/auth/RegisterForm';
import { ForgotPasswordFormValues } from '@/components/auth/ForgotPasswordForm';

export const useAuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  
  // Rate limiting for login attempts (security)
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginDisabled, setLoginDisabled] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a stored redirect path
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, navigate]);
  
  useEffect(() => {
    if (loginAttempts >= 5) {
      setLoginDisabled(true);
      toast({
        title: "Too many attempts",
        description: "Please try again after 2 minutes",
        variant: "destructive",
      });
      
      // Reset after 2 minutes
      const timer = setTimeout(() => {
        setLoginAttempts(0);
        setLoginDisabled(false);
      }, 120000);
      
      return () => clearTimeout(timer);
    }
  }, [loginAttempts, toast]);

  const onLoginSubmit = async (values: LoginFormValues) => {
    if (loginDisabled) {
      toast({
        title: "Login temporarily disabled",
        description: "Too many attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await signIn(values.email, values.password);
    if (!success) {
      setLoginAttempts(prev => prev + 1);
    }
  };

  const onRegisterSubmit = async (values: RegisterFormValues) => {
    // Add basic password strength validation
    if (values.password.length < 8) {
      toast({
        title: "Weak password",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return;
    }
    
    await signUp(values.email, values.password, { fullName: values.fullName });
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
      // Don't reveal if email exists or not (security)
      toast({
        title: "Password Reset",
        description: "If your email exists in our system, you'll receive reset instructions.",
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
    isLoading,
    loginDisabled,
    forgotPasswordLoading,
    loginAttempts,
    onLoginSubmit,
    onRegisterSubmit,
    onForgotPasswordSubmit,
  };
};
