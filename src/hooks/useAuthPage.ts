
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
    
    const success = await signIn(values.email, values.password);
    
    if (!success) {
      setLoginAttempts(prev => {
        const newAttempts = prev + 1;
        // Disable login after 5 failed attempts
        if (newAttempts >= 5) {
          setLoginDisabled(true);
          // Re-enable after 10 minutes
          setTimeout(() => {
            setLoginDisabled(false);
            setLoginAttempts(0);
          }, 10 * 60 * 1000);
        }
        return newAttempts;
      });
    } else {
      // Redirect to dashboard on success
      navigate('/dashboard');
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
    
    // Ensure passwords match
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    const success = await signUp(values.email, values.password, values.fullName);
    
    if (success) {
      // Switch to login tab with a message
      setActiveTab("login");
      toast({
        title: "Account created",
        description: "Please check your email to verify your account",
      });
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
    isLoading,
    loginDisabled,
    forgotPasswordLoading,
    loginAttempts,
    onLoginSubmit,
    onRegisterSubmit,
    onForgotPasswordSubmit,
  };
};
