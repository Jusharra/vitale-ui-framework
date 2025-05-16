import React from 'react';
import Layout from '@/components/layout/Layout';
import ToolsOfTradeContent from '@/components/professional/ToolsOfTradeContent';
import { useAuth } from '@/context/AuthContext';

const ToolsOfTradePage: React.FC = () => {
  const { userRole } = useAuth();
  const layoutRole = userRole === 'partner' ? 'partner' : 'professional';
  
  return (
    <Layout role={layoutRole}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tools of the Trade</h1>
          <p className="text-muted-foreground">
            Financing, funding opportunities, and resources for your practice
          </p>
        </div>
        <ToolsOfTradeContent />
      </div>
    </Layout>
  );
};

export default ToolsOfTradePage;