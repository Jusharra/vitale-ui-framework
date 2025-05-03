
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, ArrowDownToLine, BarChart, FileSpreadsheet, Search, Users } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Mock data for the health tools usage dashboard
const healthToolUsage = [
  { id: 1, tool: "Health Risk Assessment", users: 1245, completionRate: 78, averageTime: "7:30" },
  { id: 2, tool: "Symptom Checker", users: 3789, completionRate: 92, averageTime: "3:15" },
  { id: 3, tool: "Medication Tracker", users: 957, completionRate: 65, averageTime: "5:45" },
  { id: 4, tool: "Sleep Analysis", users: 1624, completionRate: 73, averageTime: "8:20" },
  { id: 5, tool: "Mental Wellness Assessment", users: 2340, completionRate: 81, averageTime: "12:10" }
];

const recentUsage = [
  { id: 1, user: "Emily Johnson", tool: "Symptom Checker", date: "Today, 10:35 AM", completed: true },
  { id: 2, user: "Thomas Wilson", tool: "Mental Wellness Assessment", date: "Today, 9:12 AM", completed: true },
  { id: 3, user: "Sarah Davis", tool: "Medication Tracker", date: "Yesterday, 7:45 PM", completed: false },
  { id: 4, user: "James Miller", tool: "Health Risk Assessment", date: "Yesterday, 3:20 PM", completed: true },
  { id: 5, user: "Jessica Brown", tool: "Sleep Analysis", date: "May 2, 2025", completed: true },
  { id: 6, user: "Robert Taylor", tool: "Symptom Checker", date: "May 2, 2025", completed: false }
];

const AdminHealthToolUsage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [toolFilter, setToolFilter] = useState("all");

  // Filter data based on search query and tool filter
  const filteredUsage = recentUsage.filter(item => 
    (toolFilter === "all" || item.tool.toLowerCase().includes(toolFilter.toLowerCase())) &&
    (item.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
     item.tool.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Tools Usage</h1>
        <p className="text-muted-foreground">Analyze and manage member health tool interactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <BarChart className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            </div>
            <CardDescription>All health tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,457</div>
            <p className="text-xs text-muted-foreground">+5.3% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            </div>
            <CardDescription>Active members</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,732</div>
            <p className="text-xs text-muted-foreground">+2.7% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </div>
            <CardDescription>Average across all tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+1.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-medium">Flagged Results</CardTitle>
            </div>
            <CardDescription>Requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">-3.5% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      <Alert variant="default">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Attention Required</AlertTitle>
        <AlertDescription>
          The Mental Wellness Assessment is displaying a higher than normal number of flagged results. Consider reviewing the assessment criteria.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Tool Usage Analytics</CardTitle>
          <CardDescription>Performance metrics for all health assessment tools</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tool Name</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Completion Rate</TableHead>
                <TableHead className="text-right">Avg. Time</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthToolUsage.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.tool}</TableCell>
                  <TableCell className="text-right">{item.users.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.completionRate}%</TableCell>
                  <TableCell className="text-right">{item.averageTime}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Usage</CardTitle>
          <CardDescription>Latest member interactions with health tools</CardDescription>
          <div className="flex items-center gap-4 pt-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by member or tool..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Select value={toolFilter} onValueChange={setToolFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by tool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                <SelectItem value="health">Health Risk Assessment</SelectItem>
                <SelectItem value="symptom">Symptom Checker</SelectItem>
                <SelectItem value="medication">Medication Tracker</SelectItem>
                <SelectItem value="sleep">Sleep Analysis</SelectItem>
                <SelectItem value="mental">Mental Wellness</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsage.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.user}</TableCell>
                  <TableCell>{item.tool}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      item.completed 
                        ? "bg-green-100 text-green-800" 
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {item.completed ? "Completed" : "Abandoned"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsage.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No matching records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHealthToolUsage;
