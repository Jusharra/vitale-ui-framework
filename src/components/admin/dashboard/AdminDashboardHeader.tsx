
import React from 'react';
import { Button } from "@/components/ui/button";

const AdminDashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and management</p>
      </div>
      <div className="space-x-2">
        <Button>
          <span>Generate Reports</span>
        </Button>
        <Button variant="outline">
          <span>System Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
