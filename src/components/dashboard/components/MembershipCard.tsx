
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
  membershipTier: string;
}

const MembershipCard: React.FC<MembershipCardProps> = ({ membershipTier }) => {
  const navigate = useNavigate();
  
  // Cast the string to MembershipTier type to fix the TypeScript error
  const typedMembershipTier = membershipTier as MembershipTier;
  
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
              <MembershipBadge type={typedMembershipTier} />
              <span className="font-semibold capitalize">{membershipTier}</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard/membership')}
          >
            Upgrade
          </Button>
        </div>

        <div>
          <p className="text-sm font-medium mb-1">Benefits Used</p>
          <Progress value={45} className="h-2" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>3 of 7 benefits used</span>
            <span>45%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MembershipCard;
