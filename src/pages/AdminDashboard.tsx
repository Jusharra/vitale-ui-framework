
import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const AdminPage = () => {
  return (
    <Layout role="admin">
      <AdminDashboard />
    </Layout>
  );
};

export default AdminPage;
