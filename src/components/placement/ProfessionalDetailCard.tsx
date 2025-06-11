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
  slug: string;
  first_name?: string;
  credentials?: string;
  email?: string;
  phone?: string;
  practice_name?: string;
  practice_address?: any;
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
}

interface ProfessionalDetailCardProps {
  partner: Professional | null;
}

const ProfessionalDetailCard = ({ partner }: ProfessionalDetailCardProps) => {
  const { toast } = useToast();
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  
  // Early return if professional is not provided
  if (!partner) {
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
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleCallPartner = () => {
    if (partner.phone) {
      window.location.href = `tel:${partner.phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "This provider hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  const handleEmailPartner = () => {
    if (partner.email) {
      window.location.href = `mailto:${partner.email}`;
    } else {
      toast({
        title: "No email available",
        description: "This provider hasn't provided an email address.",
        variant: "destructive",
      });
    }
  };

  const handleCallCaregiver = () => {
    if (partner.phone) {
      window.location.href = `tel:${partner.phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "This caregiver hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={partner.profile_image || '/placeholder.svg'} alt={partner.name || 'Professional'} />
              <AvatarFallback className="text-xl">{getInitials(partner.name || '')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{partner.name || 'Unknown Professional'}</CardTitle>
              {partner.credentials && (
                <CardDescription className="text-base font-medium">{partner.credentials}</CardDescription>
              )}
              {partner.practice_name && (
                <p className="text-sm text-muted-foreground">{partner.practice_name}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {partner.verified && (
              <Badge className="bg-green-600">Verified</Badge>
            )}
            {partner.telehealth_enabled && (
              <Badge variant="outline">Telehealth Available</Badge>
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
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">About {partner.first_name || partner.name.split(' ')[0]}</h3>
                <p className="text-gray-700">{partner.bio || 'No bio available'}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partner.specialties && partner.specialties.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {partner.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {partner.languages && partner.languages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-2">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {partner.languages.map((language, index) => (
                        <Badge key={index} variant="secondary">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
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
              
              {partner.service_area && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Service Area</h3>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                    <span>{partner.service_area}</span>
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
                  {partner.hourly_rate && (
                    <div className="flex justify-between items-center">
                      <span>Rate:</span>
                      <span className="font-medium">{partner.hourly_rate}</span>
                    </div>
                  )}
                </div>
                
                {partner.telehealth_enabled && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      <Video className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="font-medium">Telehealth Sessions</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Virtual appointments via secure video conferencing.
                    </p>
                    {partner.hourly_rate && (
                      <div className="flex justify-between items-center">
                        <span>Rate:</span>
                        <span className="font-medium">{partner.hourly_rate}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
                  disabled={!partner.accepting_new_patients}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Book Appointment
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full md:col-span-2"
                  onClick={handleCallCaregiver}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Caregiver
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
      
      {/* Message Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Message to {partner.name}</DialogTitle>
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
            <Button onClick={() => {
              toast({
                title: "Message Sent",
                description: `Your message has been sent to ${partner.name}`,
              });
              setMessageText('');
              setIsMessageDialogOpen(false);
            }}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ProfessionalDetailCard;