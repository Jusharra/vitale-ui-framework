import React from 'react';
import Layout from '@/components/layout/Layout';
import MemberManagerContent from '@/components/professional/MemberManagerContent';
import { useAuth } from '@/context/AuthContext';

const MemberManagerPage: React.FC = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Manager</h1>
          <p className="text-muted-foreground">
            Manage your assigned members, appointments, and communications
          </p>
        </div>
        <MemberManagerContent />
      </div>
    </Layout>
  );
};

export default MemberManagerPage;