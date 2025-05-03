
import React, { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';

interface MemberPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
}

const MemberPageLayout: React.FC<MemberPageLayoutProps> = ({ 
  children, 
  title,
  description
}) => {
  return (
    <Layout role="member">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </Layout>
  );
};

export default MemberPageLayout;
