
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from 'lucide-react';

interface Activity {
  id: number;
  activity: string;
  user: string;
  time: string;
  from?: string;
  to?: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
              <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{activity.activity}</p>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm">{activity.user}</p>
                {(activity.from && activity.to) && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Upgraded from {activity.from} to {activity.to}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <span>View All Activities</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentActivities;
