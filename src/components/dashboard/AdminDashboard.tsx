
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Users, 
  Settings,
  LayoutDashboard,
  Award,
  Briefcase,
  CalendarPlus,
  FileSpreadsheet,
  Home,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart,
  PiggyBank,
  Bell,
  Gift,
  Tag
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";

// Mock data
const systemStats = {
  totalMembers: 2548,
  totalProfessionals: 164,
  activeSubscriptions: 1897,
  pendingApprovals: 12,
  revenue: {
    mtd: 145320,
    ytd: 1243789
  },
  newLeadsThisWeek: 38,
  referralConversions: 24
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

const leadStats = {
  newLeads: 86,
  qualifiedLeads: 42,
  convertedLeads: 24,
  conversionRate: 27.9,
  sources: [
    { name: "Organic Search", count: 38, percentage: 44 },
    { name: "Referral", count: 24, percentage: 28 },
    { name: "Social Media", count: 12, percentage: 14 },
    { name: "Paid Ads", count: 12, percentage: 14 }
  ]
};

const partnerStats = {
  topPerformers: [
    { name: "Dr. Sarah Johnson", revenue: 12450, specialties: ["Cardiology"] },
    { name: "Dr. Michael Chen", revenue: 9780, specialties: ["Primary Care"] },
    { name: "Dr. Rebecca Miller", revenue: 8950, specialties: ["Neurology"] }
  ],
  totalRevenue: 145320,
  activePartners: 132
};

const rewardsStats = {
  totalIssued: 1245,
  totalRedeemed: 876,
  popularRewards: [
    { name: "Hotel Stay Voucher", claims: 245 },
    { name: "Premium Membership Discount", claims: 187 },
    { name: "Spa Treatment", claims: 156 }
  ]
};

const promotionStats = {
  totalActive: 14,
  clickThrough: 34.7,
  claimRate: 22.5,
  sources: [
    { name: "In-App", percentage: 65 },
    { name: "Email", percentage: 22 },
    { name: "SMS", percentage: 13 }
  ]
};

// System alerts mock
const systemAlerts = [
  { id: 1, type: "payment", message: "3 failed subscription payments require attention", severity: "high" },
  { id: 2, type: "partner", message: "5 partners inactive for more than 14 days", severity: "medium" },
  { id: 3, type: "symptom", message: "12 high-severity symptom reports awaiting triage", severity: "high" }
];

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

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

      {/* System Alerts Section */}
      {systemAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium text-amber-800">System Alerts</h3>
          </div>
          <div className="space-y-2">
            {systemAlerts.map((alert) => (
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
      )}

      {/* Overview Cards */}
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
            <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-4xl">${(systemStats.revenue.mtd / 1000).toFixed(1)}k</CardTitle>
            <CardDescription>Revenue MTD</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-blue-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-4xl">{systemStats.newLeadsThisWeek}</CardTitle>
            <CardDescription>New Leads This Week</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-purple-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-4xl">{systemStats.referralConversions}</CardTitle>
            <CardDescription>Referral Conversions</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
                  <Button className="justify-start" variant="outline" onClick={() => window.location.href = "/dashboard/admin/settings"}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>System Settings</span>
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
        </TabsContent>
        
        {/* Leads Tab */}
        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{leadStats.newLeads}</CardTitle>
                <CardDescription>New Leads</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{leadStats.qualifiedLeads}</CardTitle>
                <CardDescription>Qualified Leads</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{leadStats.convertedLeads}</CardTitle>
                <CardDescription>Converted Leads</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{leadStats.conversionRate}%</CardTitle>
                <CardDescription>Conversion Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
              <CardDescription>Where leads are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leadStats.sources.map((source) => (
                  <div key={source.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{source.name}</span>
                      <span className="text-sm">{source.count} leads ({source.percentage}%)</span>
                    </div>
                    <Progress value={source.percentage} />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Generate Lead Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Partners</CardTitle>
                <CardDescription>By revenue generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnerStats.topPerformers.map((partner, idx) => (
                    <div key={idx} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {partner.specialties.map((specialty, i) => (
                            <span 
                              key={i}
                              className="bg-blue-50 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${partner.revenue}</p>
                        <p className="text-xs text-muted-foreground">Revenue MTD</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Partner Overview</CardTitle>
                <CardDescription>Active partners and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Active Partners</span>
                      <span className="text-2xl font-semibold">{partnerStats.activePartners}</span>
                    </div>
                    <Progress value={(partnerStats.activePartners / systemStats.totalProfessionals) * 100} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round((partnerStats.activePartners / systemStats.totalProfessionals) * 100)}% of total partners
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Total Partner Revenue</span>
                      <span className="text-2xl font-semibold">${partnerStats.totalRevenue}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Last 30 Days
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Manage Partners
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-amber-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <Gift className="h-5 w-5 text-amber-600" />
                </div>
                <CardTitle className="text-4xl">{rewardsStats.totalIssued}</CardTitle>
                <CardDescription>Total Rewards Issued</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-4xl">{rewardsStats.totalRedeemed}</CardTitle>
                <CardDescription>Rewards Redeemed</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-blue-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <BarChart className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-4xl">
                  {Math.round((rewardsStats.totalRedeemed / rewardsStats.totalIssued) * 100)}%
                </CardTitle>
                <CardDescription>Redemption Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Rewards</CardTitle>
              <CardDescription>Based on redemption frequency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardsStats.popularRewards.map((reward, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                        ${idx === 0 ? 'bg-amber-100 text-amber-600' : 
                          idx === 1 ? 'bg-slate-100 text-slate-600' : 
                          'bg-orange-100 text-orange-600'}`}>
                        {idx + 1}
                      </div>
                      <span className="font-medium">{reward.name}</span>
                    </div>
                    <span className="font-medium">{reward.claims} claims</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Add New Reward</Button>
              <Button>Manage All Rewards</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Promotions Tab */}
        <TabsContent value="promotions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-indigo-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <Tag className="h-5 w-5 text-indigo-600" />
                </div>
                <CardTitle className="text-4xl">{promotionStats.totalActive}</CardTitle>
                <CardDescription>Active Promotions</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-violet-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-violet-600" />
                </div>
                <CardTitle className="text-4xl">{promotionStats.clickThrough}%</CardTitle>
                <CardDescription>Average Click Rate</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <Gift className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-4xl">{promotionStats.claimRate}%</CardTitle>
                <CardDescription>Average Claim Rate</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Promotion Sources</CardTitle>
              <CardDescription>Where promotions are being claimed from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {promotionStats.sources.map((source) => (
                  <div key={source.name} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{source.name}</span>
                      <span className="text-sm">{source.percentage}%</span>
                    </div>
                    <Progress value={source.percentage} />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard/admin/promotions"}>
                Manage Promotions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
