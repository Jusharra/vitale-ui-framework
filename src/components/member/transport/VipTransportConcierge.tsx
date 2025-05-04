
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

const VipTransportConcierge: React.FC = () => {
  return (
    <Card className="mt-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>VIP Transport Concierge</CardTitle>
          <Badge className="bg-primary/20 text-primary">VIP Exclusive</Badge>
        </div>
        <CardDescription>
          Let our AI assistant coordinate your medical transport needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Activity className="h-10 w-10 text-primary mb-2" />
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Automated Transport Service</h3>
            <p className="text-sm text-muted-foreground">
              As a VIP member, our AI assistant can automatically coordinate transport after your
              symptom triage or appointment scheduling.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Configure AI Transport Settings
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VipTransportConcierge;
