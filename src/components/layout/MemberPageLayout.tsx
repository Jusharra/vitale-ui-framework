
import React, { ReactNode } from 'react';
import Layout from '@/components/layout/Layout';

interface MemberPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  subtitle?: string;
  contentClassName?: string;
}

const MemberPageLayout: React.FC<MemberPageLayoutProps> = ({ 
  children, 
  title,
  description,
  subtitle,
  contentClassName = ""
}) => {
  return (
    <Layout role="member">
      <div className={`space-y-6 ${contentClassName}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {children}
      </div>
    </Layout>
  );
};

export default MemberPageLayout;
