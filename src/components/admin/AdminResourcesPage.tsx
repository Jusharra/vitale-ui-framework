import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminResources from '@/components/admin/AdminResources';

const AdminResourcesPage = () => {
  return (
    <Layout role="admin">
      <AdminResources />
    </Layout>
  );
};

export default AdminResourcesPage;