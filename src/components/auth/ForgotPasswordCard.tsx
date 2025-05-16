import React from 'react';
import { 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ForgotPasswordForm, { ForgotPasswordFormValues } from '@/components/auth/ForgotPasswordForm';
import { useTranslation } from '@/utils/i18n';

interface ForgotPasswordCardProps {
  onSubmit: (values: ForgotPasswordFormValues) => Promise<void>;
  isLoading: boolean;
  resetEmailSent: boolean;
  onBackToLogin: () => void;
}

const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({
  onSubmit,
  isLoading,
  resetEmailSent,
  onBackToLogin
}) => {
  const { t } = useTranslation();
  
  return (
    <>
      <CardHeader>
        <CardTitle>{t('auth.resetPassword')}</CardTitle>
        <CardDescription>
          {t('auth.resetPasswordDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ForgotPasswordForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
          resetEmailSent={resetEmailSent}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          {t('auth.rememberPassword')} <Button variant="link" className="p-0 h-auto" onClick={onBackToLogin}>{t('auth.backToLogin')}</Button>
        </p>
      </CardFooter>
    </>
  );
};

export default ForgotPasswordCard;