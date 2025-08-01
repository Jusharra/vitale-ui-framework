import React, { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/context/AuthContext';

interface RoleAwareLayoutProps {
  children: ReactNode;
}

const RoleAwareLayout: React.FC<RoleAwareLayoutProps> = ({ children }) => {
  const { userRole } = useAuth();
  
  // Use the user's actual role for the layout
  const effectiveRole = userRole || 'member';
  
  return (
    <Layout role={effectiveRole}>
      {children}
    </Layout>
  );
};

export default RoleAwareLayout;