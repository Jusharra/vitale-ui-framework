
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import HealthInsightsContent from '@/components/member/HealthInsightsContent';

const HealthInsights = () => {
  return (
    <MemberPageLayout 
      title="Health Insights" 
      description="Your personalized health data and recommendations"
    >
      <HealthInsightsContent />
    </MemberPageLayout>
  );
};

export default HealthInsights;
