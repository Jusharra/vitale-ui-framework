
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthMetric {
  name: string;
  value: string;
  status: string;
}

interface HealthTabProps {
  healthMetrics: HealthMetric[];
}

const HealthTab: React.FC<HealthTabProps> = ({ healthMetrics }) => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-primary" />
          Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {healthMetrics.map((metric, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div>
                <h4 className="font-medium text-sm">{metric.name}</h4>
                <p className="text-lg font-semibold">{metric.value}</p>
              </div>
              <Badge
                variant={
                  metric.status === "normal"
                    ? "outline"
                    : metric.status === "elevated"
                    ? "secondary"
                    : "destructive"
                }
              >
                {metric.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/health-insights")}
        >
          <span>View Health Insights</span>
        </Button>
        <Button onClick={() => navigate("/dashboard/health-tools")}>
          <span>Health Tools</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HealthTab;
