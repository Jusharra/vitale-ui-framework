import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Award, Users, Briefcase, Settings, FileText } from 'lucide-react';

const QuickActions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Admin operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          <Button className="justify-start" onClick={() => window.location.href = "/dashboard/admin/vacations"}>
            <Home className="mr-2 h-4 w-4" />
            <span>Manage Vacation Packages</span>
          </Button>
          <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/promotions"}>
            <Award className="mr-2 h-4 w-4" />
            <span>Manage Promotions & Offers</span>
          </Button>
          <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/leads"}>
            <Users className="mr-2 h-4 w-4" />
            <span>Member Analytics</span>
          </Button>
          <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/care-teams"}>
            <Briefcase className="mr-2 h-4 w-4" />
            <span>Manage Care Teams</span>
          </Button>
          <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/facilities"}>
            <Home className="mr-2 h-4 w-4" />
            <span>Manage Facilities</span>
          </Button>
          <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/blog"}>
            <FileText className="mr-2 h-4 w-4" />
            <span>Manage Blog Posts</span>
          </Button>
          <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/settings"}>
            <Settings className="mr-2 h-4 w-4" />
            <span>System Settings</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;