
import React from 'react';
import { 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/utils/i18n';
import LoginForm, { LoginFormValues } from '@/components/auth/LoginForm';
import RegisterForm, { RegisterFormValues } from '@/components/auth/RegisterForm';

interface LoginRegisterTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onLoginSubmit: (values: LoginFormValues) => Promise<void>;
  onRegisterSubmit: (values: RegisterFormValues) => Promise<void>;
  isLoading: boolean;
  loginDisabled: boolean;
  loginAttempts: number;
  onForgotPassword: () => void;
}

const LoginRegisterTabs: React.FC<LoginRegisterTabsProps> = ({
  activeTab,
  onTabChange,
  onLoginSubmit,
  onRegisterSubmit,
  isLoading,
  loginDisabled,
  loginAttempts,
  onForgotPassword,
}) => {
  const { t } = useTranslation();
  
  return (
    <Tabs defaultValue="login" value={activeTab} onValueChange={onTabChange}>
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
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-amber-600 text-sm">
            Authentication has been removed. Login and registration are non-functional.
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="login">
          <LoginForm 
            onSubmit={onLoginSubmit}
            isLoading={isLoading || loginDisabled}
            onForgotPassword={onForgotPassword}
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
            <>{t('auth.noAccount')} <Button variant="link" className="p-0 h-auto" onClick={() => onTabChange("register")}>{t('auth.registerLink')}</Button></>
          ) : (
            <>{t('auth.haveAccount')} <Button variant="link" className="p-0 h-auto" onClick={() => onTabChange("login")}>{t('auth.loginLink')}</Button></>
          )}
        </p>
      </CardFooter>
    </Tabs>
  );
};

export default LoginRegisterTabs;
