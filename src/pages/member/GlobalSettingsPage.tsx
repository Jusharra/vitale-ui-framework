
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import GlobalSettings from '@/components/member/GlobalSettings';

const GlobalSettingsPage = () => {
  return (
    <Layout role="member">
      <MemberPageLayout title="Global Settings">
        <GlobalSettings />
      </MemberPageLayout>
    </Layout>
  );
};

export default GlobalSettingsPage;
