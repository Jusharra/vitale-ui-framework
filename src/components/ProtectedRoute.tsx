import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./layout/Layout";
import { useToast } from "@/hooks/use-toast";

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
  const { user, isLoading, userRole, isAuthenticated } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

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