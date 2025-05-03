
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Plus, Calendar as CalendarIcon, Clock3, User, FileText } from 'lucide-react';
import { useForm } from "react-hook-form";
import { format } from "date-fns";

// Mock appointment data
const appointments = [
  { 
    id: 1, 
    patientName: "Alice Johnson", 
    date: new Date(2025, 4, 5, 10, 30), 
    duration: 30, 
    reason: "Annual checkup",
    status: "confirmed"
  },
  { 
    id: 2, 
    patientName: "Robert Smith", 
    date: new Date(2025, 4, 5, 13, 15), 
    duration: 45, 
    reason: "Follow-up consultation",
    status: "confirmed"
  },
  { 
    id: 3, 
    patientName: "Emily Davis", 
    date: new Date(2025, 4, 6, 15, 45), 
    duration: 30, 
    reason: "Prescription review",
    status: "confirmed"
  },
  { 
    id: 4, 
    patientName: "Michael Wilson", 
    date: new Date(2025, 4, 8, 9, 0), 
    duration: 60, 
    reason: "New patient consultation",
    status: "pending"
  }
];

// Mock availability slots
const availabilitySlots = [
  { id: 1, day: "Monday", startTime: "09:00", endTime: "17:00" },
  { id: 2, day: "Tuesday", startTime: "09:00", endTime: "17:00" },
  { id: 3, day: "Wednesday", startTime: "09:00", endTime: "17:00" },
  { id: 4, day: "Thursday", startTime: "09:00", endTime: "17:00" },
  { id: 5, day: "Friday", startTime: "09:00", endTime: "15:00" }
];

const ProfessionalCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      day: "Monday",
      startTime: "09:00",
      endTime: "17:00"
    }
  });

  // Filter appointments for the selected date
  const appointmentsForSelectedDate = appointments.filter(appointment => 
    date && 
    appointment.date.getDate() === date.getDate() &&
    appointment.date.getMonth() === date.getMonth() &&
    appointment.date.getFullYear() === date.getFullYear()
  );

  // Get availability for the current day
  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const currentDayAvailability = date 
    ? availabilitySlots.find(slot => slot.day === getDayName(date)) 
    : null;

  // Handle setting availability
  const onSubmit = (data) => {
    console.log("New availability set:", data);
    setAvailabilityDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <Card className="md:w-[350px]">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Manage your schedule</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Dialog open={availabilityDialogOpen} onOpenChange={setAvailabilityDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Availability
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Your Availability</DialogTitle>
                  <DialogDescription>
                    Define your regular working hours for each day of the week.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="day"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Day</FormLabel>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            {...field}
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save Availability</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Appointment</DialogTitle>
                  <DialogDescription>
                    Create a new appointment on {date ? format(date, 'PPP') : 'selected date'}.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="patient" className="text-right">Patient</Label>
                    <Input id="patient" className="col-span-3" placeholder="Patient name" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">Time</Label>
                    <Input id="time" type="time" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="duration" className="text-right">Duration</Label>
                    <select id="duration" className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="reason" className="text-right">Reason</Label>
                    <Input id="reason" className="col-span-3" placeholder="Appointment reason" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Schedule Appointment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="appointments">
            <TabsList>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {date ? format(date, 'PPPP') : 'Select a date'}
                </h3>
                {currentDayAvailability && (
                  <div className="text-sm text-muted-foreground">
                    Working hours: {currentDayAvailability.startTime} - {currentDayAvailability.endTime}
                  </div>
                )}
              </div>

              {appointmentsForSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {appointmentsForSelectedDate.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <CardTitle className="text-base">{appointment.patientName}</CardTitle>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <CardDescription>
                          {format(appointment.date, 'h:mm a')} · {appointment.duration} mins
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{appointment.reason}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <User className="h-4 w-4 mr-2" />
                            View Patient
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Notes
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-muted/50">
                  <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">No appointments</h3>
                  <p className="text-sm text-muted-foreground">
                    No appointments scheduled for this date.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="availability">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Availability</CardTitle>
                  <CardDescription>
                    Your regular working hours for each day of the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {availabilitySlots.map((slot) => (
                      <div key={slot.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                        <div className="font-medium">{slot.day}</div>
                        <div className="text-sm">
                          <Clock3 className="h-4 w-4 inline mr-1" />
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setAvailabilityDialogOpen(true)}>
                    Edit Availability
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCalendar;
