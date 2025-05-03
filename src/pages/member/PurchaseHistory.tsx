
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import PurchaseHistoryContent from '@/components/member/PurchaseHistoryContent';

const PurchaseHistory = () => {
  return (
    <MemberPageLayout 
      title="Purchase History" 
      description="View your past services and treatments"
    >
      <PurchaseHistoryContent />
    </MemberPageLayout>
  );
};

export default PurchaseHistory;
