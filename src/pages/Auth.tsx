import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoginForm, { LoginFormValues } from '@/components/auth/LoginForm';
import RegisterForm, { RegisterFormValues } from '@/components/auth/RegisterForm';
import ForgotPasswordForm, { ForgotPasswordFormValues } from '@/components/auth/ForgotPasswordForm';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';
import LanguageSelector from '@/components/i18n/LanguageSelector';

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  
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

  // Rate limiting for login attempts (security)
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginDisabled, setLoginDisabled] = useState(false);
  
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
    
    // Pass fullName as metadata instead of a third parameter
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('navigation.backToHome')}
        </Button>
        <LanguageSelector variant="compact" />
      </div>
      <Card className="w-full max-w-md">
        {showForgotPassword ? (
          <>
            <CardHeader>
              <CardTitle>{t('auth.resetPassword')}</CardTitle>
              <CardDescription>
                {t('auth.resetPasswordDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ForgotPasswordForm 
                onSubmit={onForgotPasswordSubmit}
                isLoading={forgotPasswordLoading}
                resetEmailSent={resetEmailSent}
              />
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.rememberPassword')} <Button variant="link" className="p-0 h-auto" onClick={() => setShowForgotPassword(false)}>{t('auth.backToLogin')}</Button>
              </p>
            </CardFooter>
          </>
        ) : (
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
            </TabsList>
            
            <CardHeader>
              <CardTitle>
                {activeTab === "login" ? t('auth.welcomeBack') : t('auth.createAccount')}
              </CardTitle>
              <CardDescription>
                {activeTab === "login" ? 
                  t('auth.signInDescription') : 
                  t('auth.registerDescription')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="login">
                <LoginForm 
                  onSubmit={onLoginSubmit}
                  isLoading={isLoading || loginDisabled}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
                {loginAttempts > 2 && !loginDisabled && (
                  <p className="text-amber-600 text-sm mt-2">
                    {t('auth.warningLoginAttempts', { count: 5 - loginAttempts })}
                  </p>
                )}
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm 
                  onSubmit={onRegisterSubmit}
                  isLoading={isLoading}
                />
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                {activeTab === "login" ? (
                  <>{t('auth.noAccount')} <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>{t('auth.registerLink')}</Button></>
                ) : (
                  <>{t('auth.haveAccount')} <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>{t('auth.loginLink')}</Button></>
                )}
              </p>
            </CardFooter>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default Auth;
