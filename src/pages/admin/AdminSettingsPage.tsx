
import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminSystemSettings from '@/components/admin/AdminSystemSettings';

const AdminSettingsPage = () => {
  return (
    <Layout role="admin">
      <AdminSystemSettings />
    </Layout>
  );
};

export default AdminSettingsPage;
