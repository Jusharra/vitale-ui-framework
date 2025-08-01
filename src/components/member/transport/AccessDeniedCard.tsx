
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

const AccessDeniedCard: React.FC = () => {
  return (
    <Card className="bg-muted/50 border-dashed">
      <CardHeader>
        <CardTitle>Premium Feature: Medical Transport</CardTitle>
        <CardDescription>
          Medical transport booking is available to Premium members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-6 text-center">
          <Car className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Upgrade to Premium Membership</h3>
          <p className="text-muted-foreground mb-4">
            Get access to medical transport services and coordination.
          </p>
          <Button onClick={() => window.location.href = '/member/membership'}>
            <span>Upgrade Membership</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessDeniedCard;
