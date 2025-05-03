
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Users, 
  Settings,
  LayoutDashboard,
  Award,
  Briefcase,
  CalendarPlus,
  FileSpreadsheet,
  Home
} from 'lucide-react';

// Mock data
const systemStats = {
  totalMembers: 2548,
  totalProfessionals: 164,
  activeSubscriptions: 1897,
  pendingApprovals: 12
};

const membershipBreakdown = [
  { tier: "Smart Access", count: 1453, percentage: 57 },
  { tier: "Core Concierge", count: 782, percentage: 31 },
  { tier: "VIP Executive", count: 313, percentage: 12 }
];

const recentActivities = [
  { id: 1, activity: "New professional registration", user: "Dr. Rebecca Chen", time: "1 hour ago" },
  { id: 2, activity: "Membership upgrade", user: "Thomas Wilson", time: "3 hours ago", from: "Smart", to: "Core" },
  { id: 3, activity: "New member registration", user: "Emily Johnson", time: "5 hours ago" },
  { id: 4, activity: "Membership cancellation", user: "Robert Davis", time: "Yesterday" }
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="space-x-2">
          <Button>Generate Reports</Button>
          <Button variant="outline">System Settings</Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-4xl">{systemStats.totalMembers}</CardTitle>
              <CardDescription>Total Members</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                <User className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-4xl">{systemStats.totalProfessionals}</CardTitle>
              <CardDescription>Healthcare Professionals</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-4xl">{systemStats.activeSubscriptions}</CardTitle>
              <CardDescription>Active Subscriptions</CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                <Settings className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-4xl">{systemStats.pendingApprovals}</CardTitle>
              <CardDescription>Pending Approvals</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Membership Distribution</CardTitle>
                <CardDescription>Breakdown by membership tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {membershipBreakdown.map((item) => (
                    <div key={item.tier}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{item.tier}</span>
                        <span className="text-sm text-muted-foreground">{item.count} members</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Detailed Report</Button>
              </CardFooter>
            </Card>
          </div>
          
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
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
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
            <Button variant="outline" className="w-full">View All Activities</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
