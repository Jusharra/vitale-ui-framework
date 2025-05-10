
import React from "react";
import { useAuth } from '@/context/AuthContext';
import { useRewards } from "@/hooks/useRewards";

// Import our refactored components
import WelcomeHeader from "./components/WelcomeHeader";
import MembershipCard from "./components/MembershipCard";
import RewardsCard from "./components/RewardsCard";
import DashboardTabs from "./components/DashboardTabs";
import { MembershipTier } from "@/types/auth";

const MemberDashboard: React.FC = () => {
  const { rewards, points, isLoading: rewardsLoading } = useRewards();
  const { profile, membershipTier } = useAuth();
  
  // Get user name from profile or use default
  const userName = profile?.full_name || "Member";
  
  // Use membershipTier from auth context or default to "smart"
  const userMembership = membershipTier || "smart" as MembershipTier;
  
  return (
    <div className="space-y-8">
      <WelcomeHeader 
        userName={userName} 
        userMembership={userMembership} 
      />

      <div className="grid gap-6 md:grid-cols-6">
        {/* Left column - membership & rewards */}
        <div className="md:col-span-2 space-y-6">
          <MembershipCard membershipTier={userMembership} />
          <RewardsCard points={points} isLoading={rewardsLoading} />
        </div>

        {/* Right column - tabs content */}
        <div className="md:col-span-4">
          <DashboardTabs />
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
