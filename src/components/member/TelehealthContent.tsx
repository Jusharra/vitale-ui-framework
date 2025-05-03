
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Clock, Calendar as CalendarIcon, Video, VideoOff, User, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Mock data for healthcare partners
const healthcarePartners = [
  { id: 1, name: "Dr. Sarah Johnson", specialty: "Cardiology", availability: ["9:00 AM", "10:00 AM", "2:00 PM"], image: "/placeholder.svg" },
  { id: 2, name: "Dr. Michael Chen", specialty: "Primary Care", availability: ["11:00 AM", "1:00 PM", "3:00 PM"], image: "/placeholder.svg" },
  { id: 3, name: "Dr. Emily Rodriguez", specialty: "Dermatology", availability: ["10:00 AM", "12:00 PM", "4:00 PM"], image: "/placeholder.svg" },
];

// Mock data for upcoming sessions
const upcomingSessions = [
  { id: 1, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "May 12, 2025", time: "10:30 AM", status: "confirmed" },
  { id: 2, name: "Dr. Emily Rodriguez", specialty: "Dermatology", date: "May 18, 2025", time: "2:00 PM", status: "pending" },
];

// Mock data for past sessions
const pastSessions = [
  { id: 3, doctor: "Dr. Michael Chen", specialty: "Primary Care", date: "April 25, 2025", time: "11:30 AM", notes: "Follow-up in two weeks" },
  { id: 4, doctor: "Dr. Sarah Johnson", specialty: "Cardiology", date: "March 10, 2025", time: "9:00 AM", notes: "EKG results normal" },
];

const TelehealthContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showVipLock, setShowVipLock] = useState(true);
  const { toast } = useToast();

  // In a real app, we'd check the user's membership tier from context or API
  const userMembership = "smart"; // Mock value: This should be "vip" to unlock features

  const handleScheduleSession = () => {
    if (userMembership !== "vip") {
      toast({
        title: "VIP Membership Required",
        description: "Telehealth services are available exclusively for VIP members. Please upgrade your membership to access this feature.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPartner !== null && selectedDate && selectedTime) {
      const partner = healthcarePartners.find(p => p.id === selectedPartner);
      toast({
        title: "Session Scheduled",
        description: `Your telehealth session with ${partner?.name} has been scheduled for ${format(selectedDate, "PPP")} at ${selectedTime}.`,
      });
      
      // Reset selections
      setSelectedPartner(null);
      setSelectedTime(null);
    } else {
      toast({
        title: "Incomplete Selection",
        description: "Please select a healthcare partner, date, and time for your session.",
      });
    }
  };

  const handlePartnerSelect = (partnerId: number) => {
    setSelectedPartner(partnerId === selectedPartner ? null : partnerId);
    setSelectedTime(null);
  };

  // If user is not a VIP member, show the upgrade card
  if (userMembership !== "vip" && showVipLock) {
    return (
      <Card className="my-6 border-dashed border-2">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">VIP Exclusive Feature</CardTitle>
          <CardDescription>
            Telehealth services are available exclusively for VIP members
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center px-6">
          <div className="bg-muted rounded-full p-6 mb-4">
            <VideoOff className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="text-xl font-semibold">Upgrade to Unlock Telehealth</h3>
            <p className="text-muted-foreground">
              Enjoy unlimited virtual consultations with specialists, 24/7 access to healthcare professionals, and personalized care from anywhere.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" size="lg">Upgrade to VIP</Button>
          <Button variant="outline" size="lg" className="w-full" onClick={() => setShowVipLock(false)}>
            Preview Features
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {userMembership !== "vip" && (
        <div className="bg-amber-50 border-amber-200 border rounded-md p-4 text-amber-800 flex items-center space-x-3">
          <Bell className="h-5 w-5 flex-shrink-0" />
          <div className="flex-grow">
            <p className="font-medium">This is a preview of VIP features</p>
            <p className="text-sm">To schedule actual sessions, please upgrade to a VIP membership.</p>
          </div>
          <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={() => setShowVipLock(true)}>
            Exit Preview
          </Button>
        </div>
      )}

      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-4">Choose a Healthcare Partner</h2>
              <div className="space-y-4">
                {healthcarePartners.map((partner) => (
                  <Card 
                    key={partner.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:border-primary",
                      selectedPartner === partner.id ? "border-primary ring-1 ring-primary" : ""
                    )}
                    onClick={() => handlePartnerSelect(partner.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                          <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{partner.name}</CardTitle>
                          <CardDescription>{partner.specialty}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      {selectedPartner === partner.id && (
                        <div className="mt-2">
                          <p className="text-sm font-medium mb-2">Available Times</p>
                          <div className="flex flex-wrap gap-2">
                            {partner.availability.map((time) => (
                              <Badge 
                                key={time} 
                                variant={selectedTime === time ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTime(selectedTime === time ? null : time);
                                }}
                              >
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium mb-4">Select Date & Time</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Session Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date > new Date(new Date().setDate(new Date().getDate() + 30))}
                    className={cn("rounded-md border mx-auto", "p-3 pointer-events-auto")}
                  />
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Session Summary</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Provider:</span>
                      <span className="font-medium">
                        {selectedPartner 
                          ? healthcarePartners.find(p => p.id === selectedPartner)?.name 
                          : "Not selected"
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">
                        {selectedDate ? format(selectedDate, "PPP") : "Not selected"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">
                        {selectedTime || "Not selected"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    onClick={handleScheduleSession}
                    disabled={!selectedPartner || !selectedDate || !selectedTime}
                  >
                    Schedule Session
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-xl">{session.doctor}</CardTitle>
                    <Badge variant={session.status === "confirmed" ? "default" : "outline"}>
                      {session.status === "confirmed" ? "Confirmed" : "Pending"}
                    </Badge>
                  </div>
                  <CardDescription>{session.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <span>{session.date}</span>
                    <span className="mx-1">•</span>
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{session.time}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">Reschedule</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                  <Button className="flex-1 gap-2">
                    <Video className="h-4 w-4" />
                    Join Session
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <VideoOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-lg font-medium">No upcoming sessions</p>
                <p className="text-muted-foreground">Schedule a telehealth session to get started</p>
                <Button className="mt-4" onClick={() => document.querySelector('[value="schedule"]')?.click()}>
                  Schedule Now
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4 mt-6">
          {pastSessions.length > 0 ? (
            pastSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{session.doctor}</CardTitle>
                  <CardDescription>{session.specialty}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{session.date}</span>
                    <span className="mx-1 text-muted-foreground">•</span>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{session.time}</span>
                  </div>
                  <div className="bg-muted rounded-md p-3">
                    <p className="text-sm font-medium">Session Notes</p>
                    <p className="text-sm text-muted-foreground">{session.notes}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1">View Summary</Button>
                  <Button className="flex-1">Schedule Follow-up</Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <VideoOff className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-lg font-medium">No past sessions</p>
                <p className="text-muted-foreground">Your completed telehealth sessions will appear here</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TelehealthContent;
