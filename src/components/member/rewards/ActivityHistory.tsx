
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ActivityItem {
  id: string;
  date: string;
  action: string;
  points: number;
}

interface ActivityHistoryProps {
  history: ActivityItem[];
  onViewComplete: () => void;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ history, onViewComplete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>Your rewards activity and points earned</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">{item.action}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">+{item.points}</p>
                  <p className="text-sm text-muted-foreground">points</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onViewComplete}>
          View Complete History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityHistory;
