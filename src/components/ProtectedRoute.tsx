import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  requiredRole?: "member" | "admin" | "partner" | "professional";
  redirectPath?: string;
  children?: React.ReactNode;
}

// This component is used to protect routes based on authentication and roles
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = "member",
  redirectPath = "/auth",
  children,
}) => {
  const { user, isLoading, userRole, isAuthenticated, session, signOut } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState(0);
  const [hasInvalidToken, setHasInvalidToken] = useState(false);

  // Verify session validity with improved error handling
  useEffect(() => {
    const verifySession = async () => {
      // Don't attempt refresh if we already know the token is invalid
      if (hasInvalidToken || !session || isRefreshing) {
        return;
      }

      // Check if we've attempted a refresh recently (within the last 30 seconds)
      const now = Date.now();
      if (now - lastRefreshAttempt < 30000) {
        return; // Skip refresh if we've tried recently
      }
      
      setIsRefreshing(true);
      setLastRefreshAttempt(now);
      
      try {
        // Try to refresh the session to verify it's still valid
        const { error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error("Session refresh error:", error.message);
          
          // Handle invalid refresh token specifically
          if (error.message.includes("Invalid Refresh Token") || 
              error.message.includes("Refresh Token Not Found") ||
              error.message.includes("refresh_token_not_found")) {
            
            // Mark token as invalid to prevent further refresh attempts
            setHasInvalidToken(true);
            
            // Store the attempted path for post-login redirect
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            
            // Sign out the user to clear the invalid session
            await signOut();
            
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please sign in again.",
              variant: "destructive",
            });
            
            return;
          }
          
          // Only show toast for non-rate-limit errors
          if (!error.message.includes("rate limit")) {
            toast({
              title: "Session Error",
              description: "There was a problem with your session. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error verifying session:", error);
        
        // If the error is related to invalid tokens, handle it gracefully
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("Invalid Refresh Token") || 
            errorMessage.includes("Refresh Token Not Found") ||
            errorMessage.includes("refresh_token_not_found")) {
          
          setHasInvalidToken(true);
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          await signOut();
          
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please sign in again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsRefreshing(false);
      }
    };

    verifySession();
  }, [session, location.pathname, toast, isRefreshing, lastRefreshAttempt, signOut, hasInvalidToken]);

  // Reset invalid token flag when session changes (e.g., new login)
  useEffect(() => {
    if (session && hasInvalidToken) {
      setHasInvalidToken(false);
    }
  }, [session, hasInvalidToken]);

  // Show loading state if auth is still being determined
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    // Store the attempted path for post-login redirect
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has the required role
  const hasRequiredRole =
    requiredRole === "member" ||
    (requiredRole === "admin" && userRole === "admin") ||
    (requiredRole === "professional" && (userRole === "professional" || userRole === "partner")) ||
    (requiredRole === "partner" && userRole === "partner");

  if (!hasRequiredRole) {
    toast({
      title: "Access Denied",
      description: `This section requires ${requiredRole} privileges.`,
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;