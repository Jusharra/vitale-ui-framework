
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Mock data
const upcomingAppointments = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "May 10, 2025", time: "10:30 AM", status: "confirmed" },
  { id: 2, doctor: "Dr. Michael Chen", specialty: "Primary Care", date: "May 15, 2025", time: "2:00 PM", status: "confirmed" },
  { id: 3, doctor: "Dr. Emily Rodriguez", specialty: "Dermatology", date: "May 22, 2025", time: "1:15 PM", status: "pending" },
];

const pastAppointments = [
  { id: 4, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "April 10, 2025", time: "11:30 AM", notes: "Follow-up in one month" },
  { id: 5, doctor: "Dr. James Wilson", specialty: "Orthopedics", date: "March 22, 2025", time: "9:00 AM", notes: "Physical therapy recommended" },
  { id: 6, doctor: "Dr. Michael Chen", specialty: "Primary Care", date: "February 15, 2025", time: "3:30 PM", notes: "Annual checkup completed" },
];

const Appointments = () => {
  return (
    <MemberPageLayout 
      title="Appointments" 
      description="Schedule and manage your healthcare appointments"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>May 2025</span>
          </Button>
          <Button variant="outline">Filter</Button>
        </div>
        <Button>Book Appointment</Button>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-xl">{appointment.doctor}</CardTitle>
                  <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>
                    {appointment.status === "confirmed" ? "Confirmed" : "Pending"}
                  </Badge>
                </div>
                <CardDescription>{appointment.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{appointment.date}</span>
                  <span className="mx-1">•</span>
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{appointment.time}</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">Reschedule</Button>
                <Button variant="outline" className="flex-1">Cancel</Button>
                <Button className="flex-1">Check In</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="past" className="space-y-4 mt-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{appointment.doctor}</CardTitle>
                <CardDescription>{appointment.specialty}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{appointment.date}</span>
                  <span className="mx-1 text-muted-foreground">•</span>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{appointment.time}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-start gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">View Summary</Button>
                <Button className="flex-1">Book Follow-up</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Appointments;
