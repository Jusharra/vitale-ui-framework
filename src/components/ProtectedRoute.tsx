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
  const { user, isLoading, userRole, isAuthenticated, session } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshAttempt, setLastRefreshAttempt] = useState(0);

  // Verify session validity with rate-limiting protection
  useEffect(() => {
    const verifySession = async () => {
      if (session && !isRefreshing) {
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
            
            // Only show toast for non-rate-limit errors
            if (!error.message.includes("rate limit")) {
              toast({
                title: "Session Expired",
                description: "Your session has expired. Please sign in again.",
                variant: "destructive",
              });
            }
            
            // Store the attempted path for post-login redirect
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
          }
        } catch (error) {
          console.error("Error verifying session:", error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    verifySession();
  }, [session, location.pathname, toast, isRefreshing, lastRefreshAttempt]);

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