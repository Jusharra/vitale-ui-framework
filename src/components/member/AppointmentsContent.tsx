
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, CalendarPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";

// Mock data for medical appointments
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

// Mock data for service bookings
const upcomingBookings = [
  { 
    id: 1, 
    service: "Dermatology Consultation", 
    provider: "Dr. Emily Chen",
    category: "specialist",
    date: "May 12, 2025", 
    time: "2:30 PM", 
    status: "confirmed",
    price: "$135.00",
    originalPrice: "$150.00"
  },
  { 
    id: 2, 
    service: "Facial Treatment", 
    provider: "Lisa Wong",
    category: "aesthetic",
    date: "May 18, 2025", 
    time: "10:00 AM", 
    status: "confirmed",
    price: "$162.00",
    originalPrice: "$180.00"
  },
];

const pastBookings = [
  { 
    id: 3, 
    service: "Massage Therapy", 
    provider: "Robert Thompson",
    category: "wellness",
    date: "April 5, 2025", 
    time: "3:00 PM", 
    notes: "Focused on lower back",
    price: "$81.00",
    originalPrice: "$90.00"
  },
  { 
    id: 4, 
    service: "Nutritional Consultation", 
    provider: "Sarah Johnson, RD",
    category: "wellness",
    date: "March 20, 2025", 
    time: "11:45 AM", 
    notes: "Meal plan provided",
    price: "$108.00",
    originalPrice: "$120.00"
  },
];

type ViewType = 'all' | 'appointments' | 'bookings';

const AppointmentsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [view, setView] = useState<ViewType>('all');
  const { toast } = useToast();

  const handleCheckIn = (id: number) => {
    toast({
      title: "Check-in successful",
      description: "You're all set for your appointment.",
    });
  };
  
  const handleReschedule = (id: number) => {
    toast({
      title: "Reschedule request sent",
      description: "We'll contact you soon to confirm a new time.",
    });
  };
  
  const handleCancel = (id: number) => {
    toast({
      title: "Cancellation request sent",
      description: "Your appointment has been cancelled.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>May 2025</span>
          </Button>
          <select 
            className="px-3 py-1.5 rounded border bg-background"
            value={view}
            onChange={(e) => setView(e.target.value as ViewType)}
          >
            <option value="all">All</option>
            <option value="appointments">Medical Appointments</option>
            <option value="bookings">Service Bookings</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/dashboard/telehealth'}>
            Book Medical Appointment
          </Button>
          <Button onClick={() => window.location.href = '/dashboard/service-booking'}>
            Book Service
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          {(view === 'all' || view === 'appointments') && upcomingAppointments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical Appointments</h3>
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
                    <Button variant="outline" className="flex-1" onClick={() => handleReschedule(appointment.id)}>Reschedule</Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleCancel(appointment.id)}>Cancel</Button>
                    <Button className="flex-1" onClick={() => handleCheckIn(appointment.id)}>Check In</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {(view === 'all' || view === 'bookings') && upcomingBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Service Bookings</h3>
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-xl">{booking.service}</CardTitle>
                      <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                        {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                      </Badge>
                    </div>
                    <CardDescription>{booking.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{booking.date}</span>
                      <span className="mx-1">•</span>
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${booking.category === 'aesthetic' ? 'bg-pink-50' : booking.category === 'wellness' ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {booking.category === 'aesthetic' ? 'Aesthetic' : booking.category === 'wellness' ? 'Wellness' : 'Specialist'}
                      </Badge>
                      <span className="text-sm font-medium">{booking.price}</span>
                      <span className="text-xs line-through text-muted-foreground">{booking.originalPrice}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleReschedule(booking.id)}>Reschedule</Button>
                    <Button variant="outline" className="flex-1" onClick={() => handleCancel(booking.id)}>Cancel</Button>
                    <Button className="flex-1" onClick={() => handleCheckIn(booking.id)}>Check In</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {((view === 'all' && upcomingAppointments.length === 0 && upcomingBookings.length === 0) || 
            (view === 'appointments' && upcomingAppointments.length === 0) ||
            (view === 'bookings' && upcomingBookings.length === 0)) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarPlus className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming {view === 'appointments' ? 'medical appointments' : view === 'bookings' ? 'service bookings' : 'appointments or bookings'}</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {view === 'appointments' ? 
                    'Schedule a medical appointment with one of our healthcare providers.' :
                    view === 'bookings' ?
                    'Book a service with one of our specialists or wellness providers.' :
                    'Schedule a medical appointment or book a service to get started.'
                  }
                </p>
                <div className="flex gap-2 mt-4">
                  {(view === 'all' || view === 'appointments') && (
                    <Button variant="outline" onClick={() => window.location.href = '/dashboard/telehealth'}>
                      Book Medical Appointment
                    </Button>
                  )}
                  {(view === 'all' || view === 'bookings') && (
                    <Button onClick={() => window.location.href = '/dashboard/service-booking'}>
                      Book Service
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4 mt-4">
          {(view === 'all' || view === 'appointments') && pastAppointments.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Medical Appointments</h3>
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
            </div>
          )}
          
          {(view === 'all' || view === 'bookings') && pastBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Service Bookings</h3>
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{booking.service}</CardTitle>
                    <CardDescription>{booking.provider}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{booking.date}</span>
                      <span className="mx-1 text-muted-foreground">•</span>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={`${booking.category === 'aesthetic' ? 'bg-pink-50' : booking.category === 'wellness' ? 'bg-green-50' : 'bg-blue-50'}`}>
                        {booking.category === 'aesthetic' ? 'Aesthetic' : booking.category === 'wellness' ? 'Wellness' : 'Specialist'}
                      </Badge>
                      <span className="text-sm font-medium">{booking.price}</span>
                      <span className="text-xs line-through text-muted-foreground">{booking.originalPrice}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-start gap-2 mt-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1" />
                      <div>
                        <p className="text-sm font-medium">Notes</p>
                        <p className="text-sm text-muted-foreground">{booking.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1">View Receipt</Button>
                    <Button className="flex-1">Book Again</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          {((view === 'all' && pastAppointments.length === 0 && pastBookings.length === 0) || 
            (view === 'appointments' && pastAppointments.length === 0) ||
            (view === 'bookings' && pastBookings.length === 0)) && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No past {view === 'appointments' ? 'medical appointments' : view === 'bookings' ? 'service bookings' : 'appointments or bookings'}</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Your appointment history will appear here once you've completed appointments.
                </p>
                <div className="flex gap-2 mt-4">
                  {(view === 'all' || view === 'appointments') && (
                    <Button variant="outline" onClick={() => window.location.href = '/dashboard/telehealth'}>
                      Book Medical Appointment
                    </Button>
                  )}
                  {(view === 'all' || view === 'bookings') && (
                    <Button onClick={() => window.location.href = '/dashboard/service-booking'}>
                      Book Service
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsContent;
