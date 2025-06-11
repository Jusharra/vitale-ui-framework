import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminProfessionals from '@/components/admin/AdminProfessionals';

const AdminProfessionalsPage = () => {
  return (
    <Layout role="admin">
      <AdminProfessionals />
    </Layout>
  );
};

export default AdminProfessionalsPage;