import React from 'react';
import { 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ResetPasswordForm, { ResetPasswordFormValues } from './ResetPasswordForm';

interface ResetPasswordCardProps {
  onSubmit: (values: ResetPasswordFormValues) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onBackToLogin: () => void;
}

const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({
  onSubmit,
  isLoading,
  error,
  onBackToLogin
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          Create a new password for your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <ResetPasswordForm 
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button variant="link" onClick={onBackToLogin}>
          Back to Login
        </Button>
      </CardFooter>
    </>
  );
};

export default ResetPasswordCard;