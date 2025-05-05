
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "./layout/Layout";
import { useSubscription } from "@/hooks/useSubscription";

interface ProtectedRouteProps {
  requiredRole?: "member" | "admin" | "professional";
  redirectPath?: string;
  children?: React.ReactNode;
}

// This component is used to protect routes based on authentication and roles
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole = "member",
  redirectPath = "/auth",
  children,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const { subscription, isLoading: isLoadingSubscription } = useSubscription();

  // Show loading state if auth is still being determined
  if (isLoading || isLoadingSubscription) {
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
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Check if user has the required role
  // For member routes, all authenticated users have access
  // For admin routes, only admin users have access
  // For professional routes, only professional users have access
  const hasRequiredRole =
    requiredRole === "member" ||
    (requiredRole === "admin" && user.role === "admin") ||
    (requiredRole === "professional" && user.role === "professional");

  if (!hasRequiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children or outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
