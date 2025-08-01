
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MembershipBadge from "@/components/common/MembershipBadge";
import { Progress } from "@/components/ui/progress";
import { MembershipTier } from "@/types/auth";

interface MembershipCardProps {
  membershipTier: MembershipTier;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ membershipTier }) => {
  const navigate = useNavigate();
  
  const getTierInfo = (tier: MembershipTier) => {
    return { name: 'Premium Member', benefits: 15, used: 12, color: 'bg-gradient-to-r from-purple-600 to-blue-600' };
  };

  const tierInfo = getTierInfo(membershipTier);
  const usagePercentage = Math.round((tierInfo.used / tierInfo.benefits) * 100);
  const canUpgrade = false; // No upgrades needed for premium tier
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Membership</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Current Tier</p>
            <div className="flex items-center gap-2">
              <MembershipBadge type={membershipTier} />
              <span className="font-semibold">{tierInfo.name}</span>
            </div>
          </div>
          {canUpgrade && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard/membership')}
            >
              <span>Upgrade</span>
            </Button>
          )}
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Benefits Used</p>
          <Progress value={usagePercentage} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{tierInfo.used} of {tierInfo.benefits} benefits used</span>
            <span>{usagePercentage}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
