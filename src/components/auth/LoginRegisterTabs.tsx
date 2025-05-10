
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm, { LoginFormValues } from './LoginForm';
import RegisterForm, { RegisterFormValues } from './RegisterForm';

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
  return (
    <Tabs 
      defaultValue="login" 
      value={activeTab} 
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login" className="py-4">
        <LoginForm 
          onSubmit={onLoginSubmit} 
          isLoading={isLoading} 
          disabled={loginDisabled}
          loginAttempts={loginAttempts}
          onForgotPassword={onForgotPassword}
        />
      </TabsContent>
      <TabsContent value="register" className="py-4">
        <RegisterForm 
          onSubmit={onRegisterSubmit} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default LoginRegisterTabs;
