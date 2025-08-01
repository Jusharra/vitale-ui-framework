import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminPartnerApprovals from '@/components/admin/AdminPartnerApprovals';

const AdminPartnerApprovalsPage = () => {
  return (
    <Layout role="admin">
      <AdminPartnerApprovals />
    </Layout>
  );
};

export default AdminPartnerApprovalsPage;