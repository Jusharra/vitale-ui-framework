import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, FileText, User, Users, ListCheck, Briefcase, PiggyBank, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

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

const ProfessionalDashboard: React.FC = () => {
  // Mock professional data
  const professionalData = {
    name: "Dr. James Wilson",
    specialty: "Cardiology",
    todayAppointments: todaysAppointments.length,
    pendingRequests: patientRequests.length
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <ListCheck className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">{patientRequests.length}</CardTitle>
            <CardDescription>Pending Patient Requests</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">{recentMessages.length}</CardTitle>
            <CardDescription>Unread Messages</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="bg-primary/10 w-10 h-10 rounded-md flex items-center justify-center mb-2">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-4xl">12</CardTitle>
            <CardDescription>Financing Opportunities</CardDescription>
          </CardHeader>
        </Card>
      </div>

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

      <div className="bg-muted rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Need to refer a patient?</h3>
            <p className="text-sm text-muted-foreground">Use our specialist network for quick referrals</p>
          </div>
        </div>
        <Button>Make a Referral</Button>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
