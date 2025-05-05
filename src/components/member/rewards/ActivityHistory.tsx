
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from '@/utils/i18n';

interface Activity {
  id: number | string;
  date: string;
  action: string;
  points: number;
}

interface ActivityHistoryProps {
  activities: Activity[];
  isLoading?: boolean;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities, isLoading }) => {
  const { t } = useTranslation();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('rewards.history')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-10 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('rewards.history')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-between pb-4 border-b last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary">+{activity.points}</p>
                <p className="text-sm text-muted-foreground">{t('rewards.points')}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHistory;
