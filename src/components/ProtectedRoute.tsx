
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'member' | 'professional' | 'admin';
  requiredTier?: 'smart' | 'core' | 'vip';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requiredTier
}) => {
  const { isAuthenticated, isLoading, userRole, membershipTier } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, but remember where they were trying to go
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    if (userRole === 'professional') {
      return <Navigate to="/dashboard/professional" replace />;
    }
    if (userRole === 'member') {
      return <Navigate to="/dashboard" replace />;
    }
    // If somehow they have an invalid role
    return <Navigate to="/" replace />;
  }

  // Check tier if required (only applies to members)
  if (requiredTier && userRole === 'member') {
    const tierLevels = {
      'smart': 1,
      'core': 2,
      'vip': 3
    };
    
    const userTierLevel = membershipTier ? tierLevels[membershipTier] : 0;
    const requiredTierLevel = tierLevels[requiredTier];
    
    if (userTierLevel < requiredTierLevel) {
      // Redirect to upgrade page
      return <Navigate to="/dashboard/membership" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
