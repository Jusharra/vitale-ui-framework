import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Calendar, CheckCircle, MessageSquare, Star, Clock, User, FileText, Video } from 'lucide-react';
import PlacementRequestButton from './PlacementRequestButton';

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
  professional: Professional;
}

const ProfessionalDetailCard: React.FC<ProfessionalDetailCardProps> = ({ professional }) => {
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleCallProfessional = () => {
    if (professional.phone) {
      window.location.href = `tel:${professional.phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "This professional hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  const handleEmailProfessional = () => {
    if (professional.email) {
      window.location.href = `mailto:${professional.email}`;
    } else {
      toast({
        title: "No email available",
        description: "This professional hasn't provided an email address.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the professional.",
      });
      setMessageText('');
    } else {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending.",
        variant: "destructive",
      });
    }
  };

  const handleBookAppointment = () => {
    toast({
      title: "Booking initiated",
      description: "You'll be redirected to the appointment booking page.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={professional.profile_image} alt={professional.name} />
              <AvatarFallback className="text-xl">{getInitials(professional.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{professional.name}</CardTitle>
                {professional.verified && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              <CardDescription>
                {professional.credentials && <span>{professional.credentials}</span>}
                {professional.practice_name && <span> • {professional.practice_name}</span>}
              </CardDescription>
              {professional.service_area && (
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {professional.service_area}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {professional.rating && (
              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-md">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-medium">{professional.rating}</span>
              </div>
            )}
            {professional.accepting_new_patients !== undefined && (
              <Badge variant={professional.accepting_new_patients ? "outline" : "secondary"} className={professional.accepting_new_patients ? "border-green-500 text-green-700" : ""}>
                {professional.accepting_new_patients ? 'Accepting New Patients' : 'Not Accepting New Patients'}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="specialties">Specialties</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Professional Bio</h3>
                <p className="text-gray-700">{professional.bio}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {professional.languages && professional.languages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {professional.languages.map((language, idx) => (
                        <Badge key={idx} variant="outline">{language}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {professional.hourly_rate && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Rate</h4>
                    <p className="text-gray-700">{professional.hourly_rate}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="specialties" className="pt-4">
            <div className="space-y-4">
              {professional.specialties && professional.specialties.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {professional.specializations && professional.specializations.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {professional.specializations.map((specialization, idx) => (
                      <Badge key={idx} variant="outline">{specialization}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="pt-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Available Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>In-person consultations</span>
                  </div>
                  {professional.telehealth_enabled && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Telehealth appointments</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Medical evaluations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Follow-up appointments</span>
                  </div>
                  {professional.specializations?.includes('Chronic Disease Management') && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Chronic disease management</span>
                    </div>
                  )}
                  {professional.specializations?.includes('Preventive Care') && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Preventive care</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professional.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-indigo-600" />
                <span>{professional.phone}</span>
              </div>
            )}
            {professional.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-indigo-600" />
                <span>{professional.email}</span>
              </div>
            )}
            {professional.practice_name && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-indigo-600" />
                <span>{professional.practice_name}</span>
              </div>
            )}
            {professional.telehealth_enabled && (
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-indigo-600" />
                <span>Telehealth Available</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleCallProfessional}>
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
        
        <Button variant="outline" onClick={handleEmailProfessional}>
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message {professional.name}</DialogTitle>
              <DialogDescription>
                Send a message to inquire about services or schedule a consultation.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea 
                placeholder="Type your message here..."
                className="min-h-[150px]"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Button onClick={handleBookAppointment}>
          <Calendar className="h-4 w-4 mr-2" />
          Book Appointment
        </Button>
        
        {professional.slug && (
          <Button variant="outline" asChild>
            <Link to={`/professional/${professional.slug}`}>View Full Profile</Link>
          </Button>
        )}
        
        <PlacementRequestButton 
          professionalId={professional.id}
          professionalName={professional.name}
          className="ml-auto"
        />
      </CardFooter>
    </Card>
  );
};

export default ProfessionalDetailCard;