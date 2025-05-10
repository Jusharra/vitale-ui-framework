
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MembershipBadge from "@/components/common/MembershipBadge";
import { MembershipTier } from "@/types/auth";

interface WelcomeHeaderProps {
  userName: string;
  userMembership: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, userMembership }) => {
  const navigate = useNavigate();
  
  // Cast the string to MembershipTier type to fix the TypeScript error
  const typedMembershipTier = userMembership as MembershipTier;
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}</h1>
        <p className="text-muted-foreground">Here's what's happening with your health today.</p>
      </div>
      <div className="flex items-center gap-2">
        <MembershipBadge type={typedMembershipTier} size="lg" />
        <Button variant="outline" onClick={() => navigate('/dashboard/membership')}>View Benefits</Button>
      </div>
    </div>
  );
};

export default WelcomeHeader;
