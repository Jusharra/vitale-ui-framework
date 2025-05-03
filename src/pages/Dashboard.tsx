
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemberDashboard from '@/components/dashboard/MemberDashboard';

const Dashboard = () => {
  return (
    <Layout role="member">
      <MemberDashboard />
    </Layout>
  );
};

export default Dashboard;
