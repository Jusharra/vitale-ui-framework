import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ProfilePage from '@/pages/ProfilePage';

const ProfileRedirect: React.FC = () => {
  const { userRole, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  // Redirect professionals and partners to their specific profile page
  if (userRole === 'professional' || userRole === 'partner') {
    return <Navigate to="/dashboard/professional/profile" replace />;
  }
  
  // For members and other roles, show the general profile page
  return <ProfilePage />;
};

export default ProfileRedirect;