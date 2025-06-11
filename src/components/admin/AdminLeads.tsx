import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Users,
  UserCheck,
  BarChart2,
  PieChart,
  Download,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

const membershipData = [
  { month: 'Jan', smart: 45, core: 28, vip: 12 },
  { month: 'Feb', smart: 52, core: 30, vip: 15 },
  { month: 'Mar', smart: 61, core: 35, vip: 18 },
  { month: 'Apr', smart: 67, core: 40, vip: 22 },
  { month: 'May', smart: 75, core: 45, vip: 25 },
  { month: 'Jun', smart: 80, core: 52, vip: 28 },
];

const leadAssignmentData = [
  { partner: 'Dr. Wilson', assigned: 23, converted: 17, pending: 6 },
  { partner: 'Dr. Roberts', assigned: 19, converted: 12, pending: 7 },
  { partner: 'Dr. Lee', assigned: 21, converted: 16, pending: 5 },
  { partner: 'Dr. Garcia', assigned: 18, converted: 10, pending: 8 },
  { partner: 'Dr. Patel', assigned: 25, converted: 20, pending: 5 },
];

const partnerEarningsData = [
  { month: 'Jan', earnings: 12450 },
  { month: 'Feb', earnings: 14250 },
  { month: 'Mar', earnings: 15800 },
  { month: 'Apr', earnings: 16500 },
  { month: 'May', earnings: 18200 },
  { month: 'Jun', earnings: 19500 },
];

const AdminLeads: React.FC = () => {
  const { data: leadAssignments, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['leadAssignments'],
    queryFn: async () => {
      // Fixed query: Using proper foreign key relationship syntax
      const { data, error } = await supabase
        .from('lead_assignments')
        .select(`
          id,
          lead_id,
          partner_id,
          assigned_at,
          status,
          profile_id,
          leads!lead_id(id, first_name, last_name, email, status)
        `)
        .limit(50);
      
      if (error) throw error;
      return data || [];
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Analytics & Management</CardTitle>
        <CardDescription>View lead assignments, member analytics, and partner earnings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="leads">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leads" className="flex gap-2 items-center">
              <UserCheck className="h-4 w-4" />
              <span>Lead Assignments</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              <span>Member Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex gap-2 items-center">
              <BarChart2 className="h-4 w-4" />
              <span>Partner Earnings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="mt-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Top Partners by Conversion</CardTitle>
                    <CardDescription>Lead assignment and conversion metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={leadAssignmentData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="partner" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="assigned" stackId="a" fill="#8884d8" name="Assigned" />
                          <Bar dataKey="converted" stackId="a" fill="#82ca9d" name="Converted" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Recent Lead Assignments</CardTitle>
                        <CardDescription>Latest leads assigned to partners</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80 w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Partner</TableHead>
                            <TableHead>Lead</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {isLeadsLoading ? (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                Loading...
                              </TableCell>
                            </TableRow>
                          ) : leadAssignments && leadAssignments.length > 0 ? (
                            leadAssignments.map((assignment: any) => (
                              <TableRow key={assignment.id}>
                                <TableCell>
                                  {assignment.partner_id || 'Unknown Partner'}
                                </TableCell>
                                <TableCell>
                                  {assignment.leads ? 
                                    `${assignment.leads.first_name} ${assignment.leads.last_name}` : 
                                    'Unknown Lead'}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={assignment.leads?.status === 'converted' ? 'outline' : 'secondary'}
                                      className={assignment.leads?.status === 'converted' ? 'border-green-500 text-green-500' : ''}>
                                    {assignment.leads?.status || 'Unknown'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {new Date(assignment.assigned_at).toLocaleDateString()}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center">
                                No lead assignments found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Membership Growth</CardTitle>
                    <CardDescription>Monthly membership growth by tier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={membershipData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="smart" stroke="#8884d8" activeDot={{ r: 8 }} name="Smart Access" />
                          <Line type="monotone" dataKey="core" stroke="#82ca9d" name="Core Concierge" />
                          <Line type="monotone" dataKey="vip" stroke="#ffc658" name="VIP Executive" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Member Demographics</CardTitle>
                        <CardDescription>Membership distribution and insights</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Smart Access</span>
                            <span className="text-sm text-muted-foreground">1,453 members</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-primary"
                              style={{ width: '57%' }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">57%</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Core Concierge</span>
                            <span className="text-sm text-muted-foreground">782 members</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-primary"
                              style={{ width: '31%' }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">31%</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">VIP Executive</span>
                            <span className="text-sm text-muted-foreground">313 members</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className="h-2.5 rounded-full bg-primary"
                              style={{ width: '12%' }}
                            ></div>
                          </div>
                          <span className="text-xs text-muted-foreground">12%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold">68%</div>
                          <div className="text-xs text-muted-foreground">Retention Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">24%</div>
                          <div className="text-xs text-muted-foreground">Upgrade Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">8%</div>
                          <div className="text-xs text-muted-foreground">Churn Rate</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Partner Earnings Overview</CardTitle>
                    <CardDescription>Monthly earnings for all partners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={partnerEarningsData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => `$${value}`} />
                          <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
                          <Legend />
                          <Bar dataKey="earnings" fill="#8884d8" name="Monthly Earnings" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Top Earning Partners</CardTitle>
                        <CardDescription>Based on last 30 days of activity</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-80 w-full">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Partner Name</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead>Sessions</TableHead>
                            <TableHead>Avg. Rating</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Dr. Sarah Wilson</TableCell>
                            <TableCell>$4,250</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell>4.9</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Dr. Michael Chen</TableCell>
                            <TableCell>$3,875</TableCell>
                            <TableCell>28</TableCell>
                            <TableCell>4.8</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Dr. Jessica Roberts</TableCell>
                            <TableCell>$3,650</TableCell>
                            <TableCell>26</TableCell>
                            <TableCell>4.7</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Dr. Thomas Garcia</TableCell>
                            <TableCell>$3,420</TableCell>
                            <TableCell>24</TableCell>
                            <TableCell>4.9</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Dr. Aisha Patel</TableCell>
                            <TableCell>$3,150</TableCell>
                            <TableCell>22</TableCell>
                            <TableCell>4.8</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Dr. James Lee</TableCell>
                            <TableCell>$2,980</TableCell>
                            <TableCell>20</TableCell>
                            <TableCell>4.6</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminLeads;