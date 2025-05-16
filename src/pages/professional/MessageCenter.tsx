import React from 'react';
import Layout from '@/components/layout/Layout';
import MessageCenterContent from '@/components/professional/MessageCenterContent';
import { useAuth } from '@/context/AuthContext';

const MessageCenter: React.FC = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message Center</h1>
          <p className="text-muted-foreground">
            Communicate with members and administrators
          </p>
        </div>
        <MessageCenterContent />
      </div>
    </Layout>
  );
};

export default MessageCenter;