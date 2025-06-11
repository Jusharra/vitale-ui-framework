import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar as CalendarIcon, Clock, Star, CheckCircle, MessageSquare, Video, ChevronLeft, User as UserIcon } from 'lucide-react';

interface Professional {
  id: string;
  name: string;
  first_name?: string;
  credentials?: string;
  email?: string;
  phone?: string;
  practice_name?: string;
  specialties?: string[];
  languages?: string[];
  specializations?: string[];
  service_area?: string;
  hourly_rate?: string;
  bio?: string;
  accepting_new_patients?: boolean;
  telehealth_enabled?: boolean;
  status: string;
  profile_image?: string;
  rating?: number;
  verified?: boolean;
  slug?: string;
}

interface ProfessionalDetailCardProps {
  partner: Professional;
}

const ProfessionalDetailCard: React.FC<ProfessionalDetailCardProps> = ({ partner }) => {
  const { toast } = useToast();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Early return if partner is not provided
  if (!partner) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Professional information not available.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  // Generate time slots (9 AM to 5 PM) with 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 16; hour++) {
      const hourFormatted = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      
      slots.push(`${hourFormatted}:00 ${period}`);
      slots.push(`${hourFormatted}:30 ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  
  const handleBookAppointment = () => {
    if (!date || !timeSlot) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date and time for your appointment",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Appointment Booked",
      description: `Your appointment with ${partner.name || 'the professional'} has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${timeSlot}.`,
    });
    
    setIsBookingDialogOpen(false);
    setDate(undefined);
    setTimeSlot(null);
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${partner.name || 'the professional'}.`,
    });
    
    setIsMessageDialogOpen(false);
    setMessageText('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={partner.profile_image || ''} alt={partner.name || 'Professional'} />
              <AvatarFallback className="text-xl">{getInitials(partner.name || '')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{partner.name || 'Professional'}</CardTitle>
              {partner.credentials && (
                <CardDescription className="text-base">{partner.credentials}</CardDescription>
              )}
              {partner.practice_name && (
                <p className="text-base font-medium mt-1">{partner.practice_name}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {partner.rating && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{partner.rating}</span>
              </div>
            )}
            {partner.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified Provider
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Professional Bio</h3>
                <p className="text-gray-700">{partner.bio || 'No bio available.'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partner.specialties && partner.specialties.length > 0 && (
                  <div>
                    <h4 className="text-base font-medium mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {partner.languages && partner.languages.length > 0 && (
                  <div>
                    <h4 className="text-base font-medium mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.languages.map((language, index) => (
                        <Badge key={index} variant="secondary">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {partner.service_area && (
                <div>
                  <h4 className="text-base font-medium mb-2">Service Area</h4>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{partner.service_area}</span>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="pt-4">
            <div className="space-y-4">
              {partner.specializations && partner.specializations.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {partner.specializations.map((specialization, index) => (
                      <Badge key={index} variant="outline">{specialization}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-2">Services Offered</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Consultations</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Initial Consultations</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Follow-up Appointments</span>
                      </li>
                      {partner.telehealth_enabled && (
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Telehealth Sessions</span>
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Additional Services</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Care Coordination</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Medication Management</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Health Education</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {partner.hourly_rate && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Pricing</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span>Hourly Rate:</span>
                      <span className="font-medium">{partner.hourly_rate}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      * Prices may vary based on specific services and insurance coverage.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="pt-4">
            <div className="space-y-4">
              {partner.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p>{partner.phone}</p>
                  </div>
                </div>
              )}
              
              {partner.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p>{partner.email}</p>
                  </div>
                </div>
              )}
              
              {partner.service_area && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Service Area</h4>
                    <p>{partner.service_area}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsMessageDialogOpen(true)}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                
                <Button 
                  className="w-full"
                  onClick={() => setIsBookingDialogOpen(true)}
                  disabled={!partner.accepting_new_patients}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>
              </div>
              
              {!partner.accepting_new_patients && (
                <p className="text-sm text-amber-600 text-center">
                  This provider is not currently accepting new patients.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => {
            document.getElementById('placements-top')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to List
        </Button>
        
        {partner.slug && (
          <Button asChild>
            <Link to={`/professional/${partner.slug}`}>
              View Full Profile
            </Link>
          </Button>
        )}
      </CardFooter>
      
      {/* Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Book Appointment with {partner.name || 'Professional'}</DialogTitle>
            <DialogDescription>
              Select your preferred date and time for your appointment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <div className="border rounded-md p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md"
                />
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Select Time</Label>
              {date ? (
                <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      variant={timeSlot === slot ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setTimeSlot(slot)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] border rounded-md bg-gray-50">
                  <p className="text-gray-500">Please select a date first</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Appointment Type</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="justify-start">
                  <UserIcon className="mr-2 h-4 w-4" />
                  In-Person Visit
                </Button>
                {partner.telehealth_enabled && (
                  <Button variant="outline" className="justify-start">
                    <Video className="mr-2 h-4 w-4" />
                    Telehealth
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea 
                id="reason" 
                placeholder="Briefly describe the reason for your appointment"
                className="mt-1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Message to {partner.name || 'Professional'}</DialogTitle>
            <DialogDescription>
              Your message will be sent directly to the provider.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter subject" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Type your message here..."
                className="mt-1 min-h-[150px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfessionalDetailCard;