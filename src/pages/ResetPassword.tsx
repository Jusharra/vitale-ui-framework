import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ResetPasswordCard from '@/components/auth/ResetPasswordCard';
import { ResetPasswordFormValues } from '@/components/auth/ResetPasswordForm';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [hashError, setHashError] = useState<string | null>(null);
  const [hasCheckedHash, setHasCheckedHash] = useState(false);

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
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-2">Processing Reset Link</h2>
            <p className="text-muted-foreground mb-4">
              Please wait while we process your password reset link...
            </p>
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <ResetPasswordCard
          onSubmit={onSubmit}
          isLoading={isLoading}
          error={hashError}
          onBackToLogin={() => navigate("/auth")}
        />
      </Card>
    </div>
  );
};

export default ResetPassword;