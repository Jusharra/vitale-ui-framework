
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemberManagerContent from '@/components/professional/MemberManagerContent';

const MemberManagerPage: React.FC = () => {
  return (
    <Layout role="professional">
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
