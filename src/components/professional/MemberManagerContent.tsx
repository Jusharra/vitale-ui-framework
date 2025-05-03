
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Search, MessageSquare, Calendar as CalendarIcon, Clock, User, FileText, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data for members
const mockMembers = [
  { 
    id: 1, 
    name: "Alice Johnson", 
    age: 38, 
    email: "alice@example.com", 
    phone: "(555) 123-4567", 
    memberSince: "Jan 2025", 
    lastVisit: "May 1, 2025", 
    status: "active",
    healthIssues: ["Hypertension", "Allergies"],
    medications: ["Lisinopril 10mg", "Loratadine 10mg"]
  },
  { 
    id: 2, 
    name: "Robert Smith", 
    age: 45, 
    email: "robert@example.com", 
    phone: "(555) 987-6543", 
    memberSince: "Feb 2025", 
    lastVisit: "Apr 28, 2025", 
    status: "active",
    healthIssues: ["Type 2 Diabetes", "High Cholesterol"],
    medications: ["Metformin 500mg", "Atorvastatin 20mg"]
  },
  { 
    id: 3, 
    name: "Emily Davis", 
    age: 29, 
    email: "emily@example.com", 
    phone: "(555) 456-7890", 
    memberSince: "Mar 2025", 
    lastVisit: "Apr 22, 2025", 
    status: "active",
    healthIssues: ["Asthma", "Eczema"],
    medications: ["Albuterol inhaler", "Hydrocortisone cream"]
  },
  { 
    id: 4, 
    name: "Michael Wilson", 
    age: 52, 
    email: "michael@example.com", 
    phone: "(555) 789-0123", 
    memberSince: "Dec 2024", 
    lastVisit: "Apr 15, 2025", 
    status: "inactive",
    healthIssues: ["Arthritis", "GERD"],
    medications: ["Ibuprofen 800mg", "Omeprazole 20mg"]
  }
];

const MemberManagerContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  
  const form = useForm({
    defaultValues: {
      date: new Date(),
      time: "10:00",
      duration: "30",
      notes: ""
    }
  });

  // Filter members based on search query
  const filteredMembers = mockMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assigned Members</CardTitle>
          <CardDescription>Manage your assigned members and their care</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.age} years old</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'active' ? 'default' : 'outline'}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.lastVisit}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedMember(member);
                          setAppointmentDialogOpen(true);
                        }}>
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setSelectedMember(member);
                          setMessageDialogOpen(true);
                        }}>
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => setSelectedMember(member)}
                        >
                          <User className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No members found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Member Details */}
      {selectedMember && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedMember.name}</CardTitle>
                  <CardDescription>Member since {selectedMember.memberSince}</CardDescription>
                </div>
                <Badge variant={selectedMember.status === 'active' ? 'default' : 'outline'}>
                  {selectedMember.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMember.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedMember.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Last visit: {selectedMember.lastVisit}</span>
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setAppointmentDialogOpen(true)}>
                    Schedule Appointment
                  </Button>
                  <Button variant="outline" onClick={() => setMessageDialogOpen(true)}>
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="issues">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="issues">Health Issues</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="visits">Recent Visits</TabsTrigger>
                </TabsList>
                <TabsContent value="issues" className="space-y-4 mt-4">
                  {selectedMember.healthIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <span>{issue}</span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="medications" className="space-y-4 mt-4">
                  {selectedMember.medications.map((medication, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <span>{medication}</span>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="visits" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>General Checkup</span>
                    <span className="text-sm text-muted-foreground">{selectedMember.lastVisit}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Blood Test Review</span>
                    <span className="text-sm text-muted-foreground">Apr 15, 2025</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span>Consultation</span>
                    <span className="text-sm text-muted-foreground">Mar 28, 2025</span>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-6">
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Records
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message to {selectedMember?.name}</DialogTitle>
            <DialogDescription>
              Your message will be sent directly to the member's portal inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="Message subject" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                className="min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setMessageDialogOpen(false)}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Appointment Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Appointment with {selectedMember?.name}</DialogTitle>
            <DialogDescription>
              Set up a new appointment for this member.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="time" className="text-sm font-medium">Time</label>
                  <Input 
                    id="time" 
                    type="time" 
                    defaultValue="10:00"
                    {...form.register("time")}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="duration" className="text-sm font-medium">Duration</label>
                  <select 
                    id="duration"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...form.register("duration")}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">60 minutes</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">Appointment Notes</label>
                <textarea 
                  id="notes"
                  className="min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Add appointment notes here..."
                  {...form.register("notes")}
                />
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button type="submit" onClick={() => setAppointmentDialogOpen(false)}>Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberManagerContent;
