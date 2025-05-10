
import React, { useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useAuthPage } from '@/hooks/useAuthPage';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordCard from '@/components/auth/ForgotPasswordCard';
import LoginRegisterTabs from '@/components/auth/LoginRegisterTabs';

const Auth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authStateLoading } = useAuth();
  const {
    activeTab,
    setActiveTab,
    showForgotPassword,
    setShowForgotPassword,
    resetEmailSent,
    isLoading,
    forgotPasswordLoading,
    loginAttempts,
    onLoginSubmit,
    onRegisterSubmit,
    onForgotPasswordSubmit,
  } = useAuthPage();

  // Debug logging
  console.log("Auth page state:", { 
    isAuthenticated, 
    authStateLoading,
    activeTab,
    showForgotPassword
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authStateLoading) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate('/dashboard');
    }
  }, [isAuthenticated, authStateLoading, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <AuthHeader />
      <Card className="w-full max-w-md">
        {showForgotPassword ? (
          <ForgotPasswordCard
            onSubmit={onForgotPasswordSubmit}
            isLoading={forgotPasswordLoading}
            resetEmailSent={resetEmailSent}
            onBackToLogin={() => setShowForgotPassword(false)}
          />
        ) : (
          <LoginRegisterTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onLoginSubmit={onLoginSubmit}
            onRegisterSubmit={onRegisterSubmit}
            isLoading={isLoading}
            loginAttempts={loginAttempts}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        )}
      </Card>
    </div>
  );
};

export default Auth;
