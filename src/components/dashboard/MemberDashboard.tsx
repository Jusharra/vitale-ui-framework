
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FeatureCard from '../common/FeatureCard';
import { Calendar, FileText, MessageSquare, Settings, User, Users } from 'lucide-react';
import MembershipBadge from '../common/MembershipBadge';

// Mock data
const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "May 10, 2025", time: "10:30 AM" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Primary Care", date: "May 15, 2025", time: "2:00 PM" },
];

const alerts = [
  { id: 1, title: "Prescription Refill", message: "Your medication is ready for pickup", date: "May 5, 2025" },
  { id: 2, title: "Appointment Confirmation", message: "Your appointment has been confirmed", date: "May 4, 2025" },
];

const MemberDashboard: React.FC = () => {
  // Mock user data - in a real app this would come from auth context or API
  const userData = {
    name: "John Doe",
    membership: "smart" as "smart" | "core" | "vip",
    nextAppointment: upcomingAppointments[0],
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userData.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your health today.</p>
        </div>
        <div className="flex items-center gap-2">
          <MembershipBadge type={userData.membership} size="lg" />
          <Button variant="outline">View Benefits</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled medical appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-3 pb-4 last:pb-0 last:border-0 border-b">
                    <div className="bg-primary/10 p-2 rounded-md shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                      <p className="text-sm mt-1">{appointment.date} at {appointment.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming appointments</p>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full">Book Appointment</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Important health notifications</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.map((alert) => (
              <div key={alert.id} className="pb-4 mb-4 last:mb-0 last:pb-0 border-b last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium">{alert.title}</p>
                  <span className="text-xs text-muted-foreground">{alert.date}</span>
                </div>
                <p className="text-sm text-muted-foreground">{alert.message}</p>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Alerts</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center">
                <FileText className="h-5 w-5 mb-1" />
                <span>Request Prescription</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center">
                <MessageSquare className="h-5 w-5 mb-1" />
                <span>Message Provider</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center">
                <User className="h-5 w-5 mb-1" />
                <span>Update Profile</span>
              </Button>
              <Button variant="outline" className="flex flex-col h-24 justify-center items-center text-center">
                <Settings className="h-5 w-5 mb-1" />
                <span>Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold tracking-tight mt-8">Health Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          title="Symptom Checker"
          description="Check your symptoms and get recommendations"
          icon={FileText}
        />
        <FeatureCard
          title="Virtual Consultation"
          description="Connect with a healthcare provider via video"
          icon={User}
        />
        <FeatureCard
          title="Specialist Referral"
          description="Get referred to the right specialist quickly"
          icon={Users}
          locked
          requiresUpgrade="core"
        />
      </div>

      <div className="bg-muted rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 sm:mb-0">
          <div className="bg-background w-12 h-12 rounded-full flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Need help with something?</h3>
            <p className="text-sm text-muted-foreground">Our AI health assistant is ready to answer your questions</p>
          </div>
        </div>
        <Button>Ask Health Assistant</Button>
      </div>
    </div>
  );
};

export default MemberDashboard;
