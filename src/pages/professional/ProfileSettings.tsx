import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfileSettingsContent from '@/components/professional/ProfileSettingsContent';
import { useAuth } from '@/context/AuthContext';

const ProfileSettingsPage = () => {
  const { userRole } = useAuth();
  // Ensure we use the correct role for layout - both professional and partner should use professional layout
  const layoutRole = (userRole === 'partner' || userRole === 'professional') ? 'professional' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <ProfileSettingsContent />
    </Layout>
  );
};

export default ProfileSettingsPage;