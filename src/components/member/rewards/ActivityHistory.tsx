
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
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({ activities }) => {
  const { t } = useTranslation();
  
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
