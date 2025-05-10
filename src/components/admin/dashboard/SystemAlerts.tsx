
import React from 'react';
import { Bell, PiggyBank, Users, Activity } from 'lucide-react';

interface AlertItem {
  id: number;
  type: 'payment' | 'partner' | 'symptom';
  message: string;
  severity: 'high' | 'medium' | 'low';
}

interface SystemAlertsProps {
  alerts: AlertItem[];
}

const SystemAlerts: React.FC<SystemAlertsProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="h-5 w-5 text-amber-600" />
        <h3 className="font-medium text-amber-800">System Alerts</h3>
      </div>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.id} className={`flex items-start gap-3 p-2 rounded-md ${
            alert.severity === 'high' ? 'bg-red-50 text-red-800' : 
            alert.severity === 'medium' ? 'bg-amber-50 text-amber-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            {alert.type === 'payment' && <PiggyBank className="h-5 w-5 shrink-0" />}
            {alert.type === 'partner' && <Users className="h-5 w-5 shrink-0" />}
            {alert.type === 'symptom' && <Activity className="h-5 w-5 shrink-0" />}
            <p className="text-sm">{alert.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlerts;
