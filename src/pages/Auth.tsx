
import React from 'react';
import { Card } from "@/components/ui/card";
import { useAuthPage } from '@/hooks/useAuthPage';
import { useTranslation } from '@/utils/i18n';
import AuthHeader from '@/components/auth/AuthHeader';
import ForgotPasswordCard from '@/components/auth/ForgotPasswordCard';
import LoginRegisterTabs from '@/components/auth/LoginRegisterTabs';

const Auth = () => {
  const { t } = useTranslation();
  const {
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
  } = useAuthPage();

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
            loginDisabled={loginDisabled}
            loginAttempts={loginAttempts}
            onForgotPassword={() => setShowForgotPassword(true)}
          />
        )}
      </Card>
    </div>
  );
};

export default Auth;
