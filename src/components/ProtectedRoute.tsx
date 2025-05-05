
import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./layout/Layout";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  requiredRole?: "member" | "admin" | "professional";
  requiredTier?: "smart" | "core" | "vip";
  redirectPath?: string;
  children?: React.ReactNode;
}

// This component is used to protect routes based on authentication, roles and membership tiers
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = "member",
  requiredTier,
  redirectPath = "/auth",
  children,
}) => {
  const { user, isLoading: authLoading, userRole, membershipTier } = useAuth();
  const location = useLocation();
  const { subscription, isLoading: subscriptionLoading } = useSubscription(user?.id || null);
  const { toast } = useToast();

  // Show loading state if auth is still being determined
  if (authLoading || subscriptionLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // If user is not authenticated, redirect to login
  if (!user) {
    // Store the attempted path for post-login redirect
    sessionStorage.setItem('redirectAfterLogin', location.pathname);
    
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has the required role
  const hasRequiredRole =
    requiredRole === "member" ||
    (requiredRole === "admin" && userRole === "admin") ||
    (requiredRole === "professional" && userRole === "professional");

  if (!hasRequiredRole) {
    toast({
      title: "Access Denied",
      description: `This section requires ${requiredRole} privileges.`,
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user has the required membership tier
  if (requiredTier) {
    const tierLevels = {
      smart: 1,
      core: 2,
      vip: 3
    };
    
    const userTierLevel = tierLevels[membershipTier as keyof typeof tierLevels] || 0;
    const requiredTierLevel = tierLevels[requiredTier];
    
    if (userTierLevel < requiredTierLevel) {
      toast({
        title: "Upgrade Required",
        description: `This feature requires ${requiredTier} membership or higher.`,
        variant: "destructive",
      });
      
      return <Navigate to="/dashboard/membership" state={{ upgradeRequired: true }} replace />;
    }
  }

  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
