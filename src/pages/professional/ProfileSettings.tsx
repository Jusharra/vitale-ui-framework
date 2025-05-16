import React from 'react';
import Layout from '@/components/layout/Layout';
import ProfileSettingsContent from '@/components/professional/ProfileSettingsContent';
import { useAuth } from '@/context/AuthContext';

const ProfileSettingsPage = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <ProfileSettingsContent />
    </Layout>
  );
};

export default ProfileSettingsPage;