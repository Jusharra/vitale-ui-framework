
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
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

  const onLoginSubmit = async (values: LoginFormValues) => {
    if (loginDisabled) {
      toast({
        title: "Login temporarily disabled",
        description: "Too many attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Authentication removed",
      description: "Supabase authentication has been removed",
      variant: "destructive",
    });
    setLoginAttempts(prev => prev + 1);
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
    
    toast({
      title: "Authentication removed",
      description: "Supabase authentication has been removed",
      variant: "destructive",
    });
  };

  const onForgotPasswordSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setForgotPasswordLoading(true);
      
      // Placeholder implementation
      setResetEmailSent(true);
      toast({
        title: "Authentication removed",
        description: "Supabase authentication has been removed",
        variant: "destructive",
      });
    } catch (error: any) {
      toast({
        title: "Authentication removed",
        description: "Supabase authentication has been removed",
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
    isLoading,
    loginDisabled,
    forgotPasswordLoading,
    loginAttempts,
    onLoginSubmit,
    onRegisterSubmit,
    onForgotPasswordSubmit,
  };
};
