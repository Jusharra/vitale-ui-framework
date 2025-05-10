
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemberDashboard from '@/components/dashboard/MemberDashboard';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <Layout role="member">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="member">
      <MemberDashboard />
    </Layout>
  );
};

export default Dashboard;
