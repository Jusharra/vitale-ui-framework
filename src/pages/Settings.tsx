import React from 'react';
import RoleAwareLayout from '@/components/layout/RoleAwareLayout';
import GlobalSettings from '@/components/member/GlobalSettings';

const SettingsPage: React.FC = () => {
  return (
    <RoleAwareLayout>
      <GlobalSettings />
    </RoleAwareLayout>
  );
};

export default SettingsPage;