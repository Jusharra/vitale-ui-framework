import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Dashboard from '@/pages/Dashboard';

// DashboardRouter component to handle routing based on user role
const DashboardRouter = () => {
  const { userRole, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Route based on user role
  if (userRole === 'admin') {
    return <Navigate to="/dashboard/admin" replace />;
  } else if (userRole === 'professional' || userRole === 'partner') {
    return <Navigate to="/dashboard/professional" replace />;
  } else {
    // Default to member dashboard
    return <Dashboard />;
  }
};

export default DashboardRouter;