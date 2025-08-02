
import React from 'react';
import MembershipDistribution from './MembershipDistribution';
import QuickActions from './QuickActions';
import RecentActivities from './RecentActivities';

interface MembershipTier {
  tier: string;
  count: number;
  percentage: number;
}

interface Activity {
  id: number;
  activity: string;
  user: string;
  time: string;
  from?: string;
  to?: string;
}

interface OverviewTabProps {
  membershipBreakdown: MembershipTier[];
  recentActivities: Activity[];
}

interface OverviewTabExtendedProps extends OverviewTabProps {
  isLoading?: boolean;
}

const OverviewTab: React.FC<OverviewTabExtendedProps> = ({ 
  membershipBreakdown, 
  recentActivities,
  isLoading = false
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MembershipDistribution membershipBreakdown={membershipBreakdown} isLoading={isLoading} />
        </div>
        <QuickActions />
      </div>

      <RecentActivities activities={recentActivities} />
    </div>
  );
};

export default OverviewTab;
