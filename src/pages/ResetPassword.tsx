import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

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
  const [hashError, setHashError] = useState<string | null>(null);
  const [hasCheckedHash, setHasCheckedHash] = useState(false);

  // Reset password form
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Get URL hash to extract token
  useEffect(() => {
    const checkHash = async () => {
      try {
        console.log("Checking hash and URL parameters for password reset");
        
        // First check URL hash (fragment part)
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        // Also check URL search parameters
        const queryParams = new URLSearchParams(window.location.search);
        
        // Debug logging
        console.log("Hash parameters:", Object.fromEntries(params.entries()));
        console.log("Query parameters:", Object.fromEntries(queryParams.entries()));
        console.log("Full URL:", window.location.href);
        
        // Check if there's a type and access_token in hash
        if (params.get('type') === 'recovery' && params.get('access_token')) {
          console.log("Found recovery parameters in hash");
          
          // Set the access token in session storage for Supabase
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          
          if (accessToken) {
            // Set the session manually
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });
            
            if (error) {
              console.error("Error setting session:", error);
              setHashError("Error processing reset link. Please try again.");
            } else {
              console.log("Session set successfully");
            }
          }
          
          setHasCheckedHash(true);
          return;
        }
        
        // Check if there's a token in search params (some email clients modify the URL)
        if (queryParams.get('token')) {
          console.log("Found token in query parameters");
          
          // Try to use the token to set the session
          const token = queryParams.get('token');
          if (token) {
            try {
              // This is a fallback approach - might not work with all Supabase configurations
              const { error } = await supabase.auth.refreshSession({ refresh_token: token });
              if (error) {
                console.error("Error refreshing with token:", error);
              }
            } catch (tokenError) {
              console.error("Error processing token:", tokenError);
            }
          }
          
          setHasCheckedHash(true);
          return;
        }
        
        // Check for type=recovery in query params (another possible format)
        if (queryParams.get('type') === 'recovery') {
          console.log("Found recovery type in query parameters");
          setHasCheckedHash(true);
          return;
        }
        
        // No valid parameters found
        console.error("No valid reset parameters found in URL");
        setHashError("Invalid or missing reset link parameters. Please check your email and click the link again.");
        setHasCheckedHash(true);
        
      } catch (error) {
        console.error("Error parsing reset parameters:", error);
        setHashError("Unable to process password reset link");
        setHasCheckedHash(true);
      }
    };

    checkHash();
  }, [location]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setIsLoading(true);
      
      console.log("Attempting to update password");
      
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Password updated successfully");
      
      toast({
        title: "Password updated",
        description: "Your password has been reset successfully",
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while resetting your password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasCheckedHash && !hashError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Processing Reset Link</CardTitle>
            <CardDescription>
              Please wait while we process your password reset link...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                        <Input type="password" placeholder="••••••••" {...field} />
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
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Resetting Password..." : "Reset Password"}
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