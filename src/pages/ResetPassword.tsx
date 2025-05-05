
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Validation schema for password reset
const resetPasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hashError, setHashError] = useState<string | null>(null);
  
  // Get hash from URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (!hash) {
      setHashError("No reset token found in URL. Please use the link from your email.");
    }
  }, []);

  // Reset password form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      
      // Extract the hash from the URL
      const hash = window.location.hash.substring(1);
      
      if (!hash) {
        throw new Error("No reset token found. Please use the link from your email.");
      }

      // Update password using the hash from the URL
      const { error } = await supabase.auth.updateUser({ 
        password: values.password 
      });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      
      toast({
        title: "Password reset successful!",
        description: "Your password has been updated. You can now log in with your new password.",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
      
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {hashError ? (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {hashError}
              </AlertDescription>
            </Alert>
          ) : isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Password Reset Successful!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Your password has been updated. You will be redirected to the login page shortly.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your new password" 
                          {...field} 
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your new password" 
                          {...field}
                          autoComplete="new-password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => navigate("/auth")}>
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPassword;
