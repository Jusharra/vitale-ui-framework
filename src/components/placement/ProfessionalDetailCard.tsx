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
import { MapPin, Phone, Mail, Calendar as CalendarIcon, Clock, Star, CheckCircle, MessageSquare, Video, User as UserIcon, Award, Stethoscope } from 'lucide-react';

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
  professional: Professional | null;
}

const ProfessionalDetailCard = ({ professional }: ProfessionalDetailCardProps) => {
  const { toast } = useToast();
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  
  // Early return if professional is not provided
  if (!professional) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            Professional information not available
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
      description: `Your message has been sent to ${professional.name}.`,
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
              <AvatarImage src={professional.profile_image || '/placeholder.svg'} alt={professional.name || 'Professional'} />
              <AvatarFallback className="text-xl">{getInitials(professional.name || '')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{professional.name || 'Unknown Professional'}</CardTitle>
              {professional.credentials && (
                <CardDescription className="text-base">{professional.credentials}</CardDescription>
              )}
              {professional.practice_name && (
                <p className="text-base font-medium mt-1">{professional.practice_name}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {professional.rating && (
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                <span className="ml-1 font-medium">{professional.rating}</span>
              </div>
            )}
            
            {professional.verified && (
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
                <p className="text-gray-700">{professional.bio || 'No bio available'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {professional.specialties && professional.specialties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {professional.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {professional.languages && professional.languages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {professional.languages.map((language, index) => (
                        <Badge key={index} variant="secondary">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {professional.specializations && professional.specializations.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.specializations.map((specialization, index) => (
                      <Badge key={index} variant="outline">{specialization}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="pt-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <UserIcon className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="font-medium">In-Person Consultations</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Face-to-face appointments at the provider's office or your location.
                  </p>
                  {professional.hourly_rate && (
                    <div className="flex justify-between items-center">
                      <span>Rate:</span>
                      <span className="font-medium">{professional.hourly_rate}</span>
                    </div>
                  )}
                </div>
                
                {professional.telehealth_enabled && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Video className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-medium">Telehealth Sessions</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Virtual appointments via secure video conferencing.
                    </p>
                    {professional.hourly_rate && (
                      <div className="flex justify-between items-center">
                        <span>Rate:</span>
                        <span className="font-medium">{professional.hourly_rate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="pt-4">
            <div className="space-y-4">
              {professional.phone && (
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Phone</h4>
                    <p>{professional.phone}</p>
                  </div>
                </div>
              )}
              
              {professional.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Email</h4>
                    <p>{professional.email}</p>
                  </div>
                </div>
              )}
              
              {professional.service_area && (
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <h4 className="font-medium">Service Area</h4>
                    <p>{professional.service_area}</p>
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
                  onClick={() => window.location.href = `tel:${professional.phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Caregiver
                </Button>
              </div>
              
              {!professional.accepting_new_patients && (
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
        
        {professional.slug && (
          <Button asChild>
            <Link to={`/professional/${professional.slug}`}>
              View Full Profile
            </Link>
          </Button>
        )}
      </CardFooter>
      
      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Message to {professional.name}</DialogTitle>
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