import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from 'lucide-react';

interface GuestAccountCreationProps {
  sessionId: string;
  customerEmail?: string;
  onAccountCreated?: (user: any) => void;
}

const GuestAccountCreation: React.FC<GuestAccountCreationProps> = ({
  sessionId,
  customerEmail,
  onAccountCreated,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const { toast } = useToast();

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(password);
    setConfirmPassword(password);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const handleCreateAccount = async () => {
    if (!customerEmail) {
      toast({
        title: 'Email required',
        description: 'Customer email is required to create account.',
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create user account with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: customerEmail,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            full_name: fullName,
            email: customerEmail,
            role: 'member' as const,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Don't throw error - user is created, just profile might need manual creation
        }

        // Note: Subscription record will be linked via webhook or manual process
        // For now, just ensure the user is created and can access their account

        setIsCreated(true);
        
        toast({
          title: 'Account created successfully!',
          description: 'Please check your email to verify your account.',
        });

        if (onAccountCreated) {
          onAccountCreated(authData.user);
        }
      }
    } catch (error) {
      console.error('Account creation error:', error);
      toast({
        title: 'Account creation failed',
        description: error.message || 'Failed to create account. Please contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCreated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Account Created!</CardTitle>
          <CardDescription>
            Your account has been created successfully. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={() => window.location.href = '/auth'}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Account Setup</CardTitle>
        <CardDescription>
          Your payment was successful! Create your account to access your membership benefits.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={customerEmail || ''}
            disabled
            className="bg-gray-50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={generatePassword}
            className="flex-1"
          >
            Generate Password
          </Button>
          <Button
            onClick={handleCreateAccount}
            disabled={isLoading || !fullName || !password || !confirmPassword}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Your account will be linked to your successful payment and subscription.
        </p>
      </CardContent>
    </Card>
  );
};

export default GuestAccountCreation;