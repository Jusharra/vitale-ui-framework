
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MessageSquare, FileText, User, Users, ListCheck, Briefcase, PiggyBank, CreditCard, Palette, Pill, Activity, Bell, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

// Mock data
const todaysAppointments = [
  { id: 1, patient: "Alice Johnson", reason: "Annual checkup", time: "10:30 AM", status: "confirmed" },
  { id: 2, patient: "Robert Smith", reason: "Follow-up consultation", time: "1:15 PM", status: "confirmed" },
  { id: 3, patient: "Emily Davis", reason: "Prescription review", time: "3:45 PM", status: "confirmed" }
];

const patientRequests = [
  { id: 1, patient: "Michael Wilson", type: "Prescription Refill", medication: "Lisinopril 10mg", urgent: true },
  { id: 2, patient: "Sarah Brown", type: "Medical Advice", description: "Persistent headache for 3 days", urgent: false }
];

const recentMessages = [
  { id: 1, patient: "Thomas Lee", preview: "Thank you for your help with my medication...", time: "2 hours ago" },
  { id: 2, patient: "Jessica Miller", preview: "When should I schedule my next appointment?", time: "Yesterday" }
];

const refillRequests = [
  { id: 1, patient: "Michael Wilson", medication: "Lisinopril 10mg", requestDate: "2025-05-02", status: "pending", urgent: true },
  { id: 2, patient: "Sarah Brown", medication: "Synthroid 75mcg", requestDate: "2025-05-03", status: "pending", urgent: false },
  { id: 3, patient: "David Taylor", medication: "Metformin 500mg", requestDate: "2025-05-01", status: "pending", urgent: true },
];

const symptomSubmissions = [
  { id: 1, patient: "Margaret Johnson", symptoms: "Persistent cough, fever", severity: "high", submittedDate: "2025-05-03", status: "new" },
  { id: 2, patient: "William Clark", symptoms: "Lower back pain", severity: "medium", submittedDate: "2025-05-02", status: "new" },
  { id: 3, patient: "Jennifer Davis", symptoms: "Migraine, sensitivity to light", severity: "high", submittedDate: "2025-05-01", status: "in-progress" },
];

const upcomingAppointments = [
  { id: 1, patient: "Alice Johnson", date: "2025-05-05", time: "10:30 AM", type: "In-person", status: "confirmed" },
  { id: 2, patient: "Robert Smith", date: "2025-05-05", time: "1:15 PM", type: "Telehealth", status: "confirmed" },
  { id: 3, patient: "Emily Davis", date: "2025-05-06", time: "9:00 AM", type: "In-person", status: "confirmed" },
  { id: 4, patient: "Thomas Lee", date: "2025-05-06", time: "2:30 PM", type: "Telehealth", status: "confirmed" },
];

const promotionMetrics = {
  totalOffers: 6,
  totalViews: 453,
  totalClaims: 87,
  conversionRate: 19.2,
  topPerforming: "Free Initial Consultation"
};

const earningsData = {
  mtd: 4250,
  previousMonth: 3780,
  percentChange: 12.4,
  consultations: 24,
  avgPerConsultation: 177
};

const alerts = [
  { id: 1, type: "prescription", message: "3 expired prescriptions require review", patient: "Multiple Patients", severity: "high" },
  { id: 2, type: "appointment", message: "Missed appointment with Sarah Brown", patient: "Sarah Brown", severity: "medium" },
  { id: 3, type: "triage", message: "2 high severity symptom reports awaiting response", patient: "Multiple Patients", severity: "high" },
];

const analyticsData = {
  patientRetention: 87,
  consultToBooking: 64,
  monthlyGrowth: 8.5
};

const ProfessionalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock professional data
  const professionalData = {
    name: "Dr. James Wilson",
    specialty: "Cardiology",
    todayAppointments: todaysAppointments.length,
    pendingRequests: patientRequests.length,
    assignedMembers: 42,
    unreadMessages: 5
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Professional Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {professionalData.name}</p>
        </div>
        <div className="space-x-2">
          <Button asChild>
            <Link to="/dashboard/professional/calendar">Calendar View</Link>
          </Button>
          <Button variant="outline">Export Schedule</Button>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="h-5 w-5 text-amber-600" />
            <h3 className="font-medium text-amber-800">Alerts Requiring Attention</h3>
          </div>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-2 rounded-md ${
                alert.severity === 'high' ? 'bg-red-50 text-red-800' : 
                alert.severity === 'medium' ? 'bg-amber-50 text-amber-800' : 
                'bg-blue-50 text-blue-800'
              }`}>
                {alert.type === 'prescription' && <Pill className="h-5 w-5 shrink-0" />}
                {alert.type === 'appointment' && <Calendar className="h-5 w-5 shrink-0" />}
                {alert.type === 'triage' && <Activity className="h-5 w-5 shrink-0" />}
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs">{alert.patient}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">{professionalData.assignedMembers}</CardTitle>
            <CardDescription>Assigned Members</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">{professionalData.todayAppointments}</CardTitle>
            <CardDescription>Today's Appointments</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">{professionalData.unreadMessages}</CardTitle>
            <CardDescription>Unread Messages</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <PiggyBank className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">${earningsData.mtd}</CardTitle>
            <CardDescription>
              Earnings MTD
              {earningsData.percentChange > 0 ? (
                <span className="text-green-600 text-xs ml-1">
                  +{earningsData.percentChange}%
                </span>
              ) : (
                <span className="text-red-600 text-xs ml-1">
                  {earningsData.percentChange}%
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="triage">Symptom Triage</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaysAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                      <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{appointment.patient}</p>
                          <span className="text-sm">{appointment.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/professional/calendar">View Full Calendar</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Patient Requests</CardTitle>
                <CardDescription>Recent requests requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientRequests.map((request) => (
                    <div key={request.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                      <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{request.patient}</p>
                          {request.urgent && (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Urgent</span>
                          )}
                        </div>
                        <p className="text-sm">{request.type}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.medication || request.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link to="/dashboard/professional/requests">Respond to Requests</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest communications from patients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0">
                      <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center shrink-0">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{message.patient}</p>
                          <span className="text-xs text-muted-foreground">{message.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.preview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Open Message Center</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Prescription Center</CardTitle>
                <CardDescription>Manage patient refill requests</CardDescription>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm">Export</Button>
                <Button size="sm">New Prescription</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {refillRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.patient}
                        {request.urgent && (
                          <Badge variant="destructive" className="ml-2">Urgent</Badge>
                        )}
                      </TableCell>
                      <TableCell>{request.medication}</TableCell>
                      <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === 'pending' ? "outline" : "default"}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Approve</Button>
                          <Button variant="ghost" size="sm">Deny</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View All Requests</Button>
              <Button variant="outline">View Expired Prescriptions</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Symptom Triage Tab */}
        <TabsContent value="triage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Button variant={activeTab === "triage" ? "default" : "outline"} className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4 text-red-500" />
              <span>High Severity</span>
              <Badge variant="outline" className="ml-auto">{symptomSubmissions.filter(s => s.severity === 'high').length}</Badge>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4 text-amber-500" />
              <span>Medium Severity</span>
              <Badge variant="outline" className="ml-auto">{symptomSubmissions.filter(s => s.severity === 'medium').length}</Badge>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Activity className="mr-2 h-4 w-4 text-blue-500" />
              <span>Low Severity</span>
              <Badge variant="outline" className="ml-auto">{symptomSubmissions.filter(s => s.severity === 'low' || !s.severity).length}</Badge>
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Symptom Triage</CardTitle>
              <CardDescription>Prioritize and respond to patient symptom submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Reported Symptoms</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {symptomSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        {submission.patient}
                      </TableCell>
                      <TableCell>{submission.symptoms}</TableCell>
                      <TableCell>
                        <Badge variant={
                          submission.severity === 'high' ? "destructive" :
                          submission.severity === 'medium' ? "outline" : "default"
                        }>
                          {submission.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(submission.submittedDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          submission.status === 'new' ? "destructive" : 
                          submission.status === 'in-progress' ? "outline" : "default"
                        }>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm">Respond</Button>
                          <Button variant="outline" size="sm">Schedule</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View All Submissions</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{upcomingAppointments.filter(a => a.date === "2025-05-05").length}</CardTitle>
                <CardDescription>Today's Appointments</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{upcomingAppointments.filter(a => a.type === "Telehealth").length}</CardTitle>
                <CardDescription>Telehealth Sessions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">{upcomingAppointments.filter(a => a.type === "In-person").length}</CardTitle>
                <CardDescription>In-person Visits</CardDescription>
              </CardHeader>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled patient appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">{appointment.patient}</TableCell>
                      <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>
                        <Badge variant={appointment.type === "Telehealth" ? "outline" : "default"}>
                          {appointment.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">
                          {appointment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {appointment.type === "Telehealth" ? (
                            <Button variant="default" size="sm">Join Session</Button>
                          ) : (
                            <Button variant="default" size="sm">Check In</Button>
                          )}
                          <Button variant="outline" size="sm">Reschedule</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/professional/calendar">View Calendar</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-green-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <Heart className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-4xl">{analyticsData.patientRetention}%</CardTitle>
                <CardDescription>Patient Retention</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={analyticsData.patientRetention} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-blue-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-4xl">{analyticsData.consultToBooking}%</CardTitle>
                <CardDescription>Consult-to-Booking Rate</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={analyticsData.consultToBooking} className="h-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <div className="bg-purple-100 w-10 h-10 rounded-md flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-4xl">+{analyticsData.monthlyGrowth}%</CardTitle>
                <CardDescription>Monthly Patient Growth</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={analyticsData.monthlyGrowth * 10} className="h-2" />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Your financial performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Month-to-Date</span>
                      <div className="text-right">
                        <span className="text-2xl font-semibold">${earningsData.mtd}</span>
                        {earningsData.percentChange > 0 ? (
                          <span className="text-green-600 text-xs ml-2">
                            +{earningsData.percentChange}% from last month
                          </span>
                        ) : (
                          <span className="text-red-600 text-xs ml-2">
                            {earningsData.percentChange}% from last month
                          </span>
                        )}
                      </div>
                    </div>
                    <Progress value={(earningsData.mtd / 5000) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium">Total Consultations</p>
                      <p className="text-2xl font-semibold">{earningsData.consultations}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Avg. per Consultation</p>
                      <p className="text-2xl font-semibold">${earningsData.avgPerConsultation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/dashboard/professional/earnings">View Detailed Report</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Promotion Performance</CardTitle>
                <CardDescription>How your promotions are performing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Total Promotions</p>
                      <p className="text-2xl font-semibold">{promotionMetrics.totalOffers}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Views</p>
                      <p className="text-2xl font-semibold">{promotionMetrics.totalViews}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Claims</p>
                      <p className="text-2xl font-semibold">{promotionMetrics.totalClaims}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Conversion Rate</p>
                      <p className="text-2xl font-semibold">{promotionMetrics.conversionRate}%</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium">Top Performing Offer</p>
                    <div className="bg-muted p-3 rounded-md mt-2">
                      <p className="font-medium">{promotionMetrics.topPerforming}</p>
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>42 claims</span>
                        <span>48.3% conversion</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Create New Promotion</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Member Management</CardTitle>
              <Badge variant="outline">New Feature</Badge>
            </div>
            <CardDescription>Manage assigned members and their patient relationships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-primary/10 w-12 h-12 rounded-md flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Member Manager</h3>
                <p className="text-sm text-muted-foreground">Schedule appointments, send messages, view health records</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link to="/dashboard/professional/member-manager">Go to Member Manager</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Tools of the Trade</CardTitle>
              <Badge variant="outline">New Resources</Badge>
            </div>
            <CardDescription>Financing, funding, and resources for your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <PiggyBank className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Research Funding</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">Grant opportunities up to $250K</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <CreditCard className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Equipment Financing</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">Special 0% financing for 12 months</p>
              </div>
              <div className="flex flex-col items-center p-4 border rounded-lg">
                <FileText className="h-8 w-8 mb-2 text-primary" />
                <h3 className="font-semibold">Licensing Support</h3>
                <p className="text-xs text-center text-muted-foreground mt-1">Streamlined multi-state processing</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link to="/dashboard/professional/tools">Explore All Resources</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* White-Label Option */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-primary/20">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>White-Label Concierge Platform</CardTitle>
            <Badge className="bg-primary/20 text-primary">Premium</Badge>
          </div>
          <CardDescription>Get your own branded concierge platform for your practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Palette className="h-10 w-10 text-primary mb-2" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Your Brand, Our Technology</h3>
              <p className="text-sm text-muted-foreground">
                Launch your own branded concierge platform with custom colors, logo, and domain.
                All the features you love, under your practice's brand.
              </p>
              <ul className="grid grid-cols-2 gap-2 text-sm mt-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Custom branding & colors</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Dedicated domain</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>All premium features</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg">
            Get Your Own Concierge Platform
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfessionalDashboard;
