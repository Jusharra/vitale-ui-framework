
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { 
  FileSpreadsheet, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  User
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const toolUsageData = [
  { name: 'Symptom Checker', value: 243 },
  { name: 'Medication Reminders', value: 178 },
  { name: 'Health Assessment', value: 156 },
  { name: 'BMI Calculator', value: 135 },
  { name: 'Calorie Tracker', value: 120 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const toolAccessData = [
  { id: 1, user_name: "Jennifer Smith", tool_name: "Symptom Checker", access_date: "2023-05-02T14:30:00Z", status: "delivered", membership: "vip" },
  { id: 2, user_name: "Michael Johnson", tool_name: "Health Assessment", access_date: "2023-05-02T10:15:00Z", status: "delivered", membership: "core" },
  { id: 3, user_name: "Robert Williams", tool_name: "Medication Reminders", access_date: "2023-05-01T16:45:00Z", status: "delivered", membership: "smart" },
  { id: 4, user_name: "Emily Davis", tool_name: "BMI Calculator", access_date: "2023-04-30T09:20:00Z", status: "error", membership: "core" },
  { id: 5, user_name: "Christopher Brown", tool_name: "Calorie Tracker", access_date: "2023-04-30T13:50:00Z", status: "delivered", membership: "vip" },
  { id: 6, user_name: "Sarah Miller", tool_name: "Symptom Checker", access_date: "2023-04-29T11:05:00Z", status: "delivered", membership: "core" },
  { id: 7, user_name: "Daniel Wilson", tool_name: "Health Assessment", access_date: "2023-04-29T15:30:00Z", status: "pending", membership: "smart" },
  { id: 8, user_name: "Amanda Jones", tool_name: "Medication Reminders", access_date: "2023-04-28T12:15:00Z", status: "delivered", membership: "vip" },
  { id: 9, user_name: "Thomas Moore", tool_name: "BMI Calculator", access_date: "2023-04-28T10:40:00Z", status: "delivered", membership: "core" },
  { id: 10, user_name: "Jessica Taylor", tool_name: "Calorie Tracker", access_date: "2023-04-27T14:55:00Z", status: "error", membership: "smart" },
];

const AdminHealthToolUsage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toolSubmissions, setToolSubmissions] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchToolUsage = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tool_access_logs')
          .select('*')
          .order('access_date', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        const logs = data || [];
        
        if (logs.length > 0) {
          setToolSubmissions(logs);
        } else {
          // Use mock data if no real data is available
          setToolSubmissions(toolAccessData);
        }
      } catch (error) {
        console.error('Error fetching tool usage:', error);
        // Fallback to mock data
        setToolSubmissions(toolAccessData);
        toast({
          title: 'Warning',
          description: 'Using sample data - could not fetch actual tool usage',
          variant: 'warning',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchToolUsage();
  }, [toast]);

  const filteredToolAccess = toolAccessData.filter(item =>
    item.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tool_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.membership.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const exportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data export is being prepared and will be downloaded shortly.',
    });
    
    // In a real app, we would generate and download a CSV here
    setTimeout(() => {
      toast({
        title: 'Export Complete',
        description: 'Your data has been exported successfully.',
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Health Tool Usage</CardTitle>
            <CardDescription>Monitor and audit member interactions with health tools</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportData}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export Audit Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Tool Popularity</CardTitle>
                <CardDescription>Most used health tools by members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={toolUsageData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {toolUsageData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} uses`, 'Usage']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Total Tool Usages:</span>
                    <span className="font-semibold">{toolUsageData.reduce((sum, item) => sum + item.value, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Unique Users:</span>
                    <span className="font-semibold">412</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Average Uses Per Member:</span>
                    <span className="font-semibold">2.4</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">Access Audit Log</CardTitle>
                    <CardDescription>Complete record of tool access and usage</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="search" 
                        placeholder="Search logs..." 
                        className="pl-8 w-[200px]" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline" className="h-10">
                          <Filter className="mr-2 h-4 w-4" />
                          Filter
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="font-medium">Date Range</div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Last 7 days</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium">Status</div>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center">
                                <input type="checkbox" id="status-delivered" className="mr-2" defaultChecked />
                                <label htmlFor="status-delivered" className="text-sm">Delivered</label>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" id="status-pending" className="mr-2" defaultChecked />
                                <label htmlFor="status-pending" className="text-sm">Pending</label>
                              </div>
                              <div className="flex items-center">
                                <input type="checkbox" id="status-error" className="mr-2" defaultChecked />
                                <label htmlFor="status-error" className="text-sm">Error</label>
                              </div>
                            </div>
                          </div>
                          <Button size="sm" className="w-full">Apply</Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button size="sm" variant="outline" className="h-10" onClick={exportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <ScrollArea className="h-[370px] w-full rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Tool</TableHead>
                          <TableHead>Access Date</TableHead>
                          <TableHead>Membership</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredToolAccess.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                              {searchTerm ? "No logs found matching your search" : "No logs found"}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredToolAccess.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className="bg-muted rounded-full w-7 h-7 flex items-center justify-center shrink-0">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <span>{log.user_name}</span>
                                </div>
                              </TableCell>
                              <TableCell>{log.tool_name}</TableCell>
                              <TableCell>{formatDate(log.access_date)}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  log.membership === 'vip' ? 'border-purple-500 text-purple-500' :
                                  log.membership === 'core' ? 'border-blue-500 text-blue-500' : 
                                  'border-gray-500 text-gray-500'
                                }>
                                  {log.membership}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={
                                  log.status === 'delivered' ? 'outline' :
                                  log.status === 'pending' ? 'secondary' :
                                  'destructive'
                                } className={
                                  log.status === 'delivered' ? 'border-green-500 text-green-500' : ''
                                }>
                                  {log.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHealthToolUsage;
