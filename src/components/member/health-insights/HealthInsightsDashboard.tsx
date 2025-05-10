
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Weight, AlertTriangle, Brain } from "lucide-react";

interface HealthInsightsDashboardProps {
  setActiveTab: (tab: string) => void;
}

const HealthInsightsDashboard: React.FC<HealthInsightsDashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("vitals")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Activity className="h-5 w-5 mr-2 text-primary" />
            Vital Signs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Track your important health metrics</p>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("weight")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Weight className="h-5 w-5 mr-2 text-primary" />
            Weight Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Monitor your weight trends</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("allergies")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-primary" />
            Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Review your allergy information</p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:bg-muted/50" onClick={() => setActiveTab("mental")}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Mental Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Track your mental wellness</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthInsightsDashboard;
