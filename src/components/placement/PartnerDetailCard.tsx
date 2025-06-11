import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MapPin, CheckCircle, User, Calendar, Globe, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PlacementRequestButton from './PlacementRequestButton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PartnerDetailCardProps {
  partner: {
    id: string;
    name: string;
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
  };
}

const PartnerDetailCard = ({ partner }: PartnerDetailCardProps) => {
  const { toast } = useToast();

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

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={partner.profile_image} />
              <AvatarFallback className="text-lg bg-indigo-100 text-indigo-600">
                {getInitials(partner.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{partner.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {partner.service_area || 'Service area not specified'}
                </div>
              </CardDescription>
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
        {/* Professional Bio */}
        {partner.bio && (
          <div>
            <h3 className="text-lg font-medium mb-2">About {partner.first_name || partner.name.split(' ')[0]}</h3>
            <p className="text-gray-700">{partner.bio}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {partner.practice_name && (
              <div className="flex items-center gap-1 text-sm">
                <User className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Practice:</span>
                <span>{partner.practice_name}</span>
              </div>
            )}
            
            {partner.hourly_rate && (
              <div className="flex items-center gap-1 text-sm">
                <CheckCircle className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Rate:</span>
                <span>{partner.hourly_rate}</span>
              </div>
            )}
            
            {partner.phone && (
              <div className="flex items-center gap-1 text-sm">
                <Phone className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Phone:</span>
                <span>{partner.phone}</span>
              </div>
            )}
            
            {partner.email && (
              <div className="flex items-center gap-1 text-sm">
                <Mail className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Email:</span>
                <span>{partner.email}</span>
              </div>
            )}
          </div>
          
          <div>
            <Tabs defaultValue="specialties">
              <TabsList className="w-full">
                <TabsTrigger value="specialties">Specialties</TabsTrigger>
                <TabsTrigger value="languages">Languages</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specialties" className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {partner.specialties && partner.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline">{specialty}</Badge>
                  ))}
                  {(!partner.specialties || partner.specialties.length === 0) && (
                    <p className="text-sm text-muted-foreground">No specialties listed</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="languages" className="pt-2">
                <div className="flex flex-wrap gap-2">
                  {partner.languages && partner.languages.map((language, idx) => (
                    <Badge key={idx} variant="outline">{language}</Badge>
                  ))}
                  {(!partner.languages || partner.languages.length === 0) && (
                    <p className="text-sm text-muted-foreground">No languages listed</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="font-medium text-indigo-800 mb-2">Placement Information</h3>
          <p className="text-sm text-indigo-700 mb-3">
            Our concierge service can help you connect with {partner.first_name || partner.name.split(' ')[0]} and other healthcare professionals that match your needs.
          </p>
          <div className="flex items-center text-sm text-indigo-800">
            <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
            <span>No upfront fee required for standard placement</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCallPartner}>
            <Phone className="h-4 w-4 mr-2" />
            Call Provider
          </Button>
          
          <Button variant="outline" onClick={handleEmailPartner}>
            <Mail className="h-4 w-4 mr-2" />
            Email Provider
          </Button>
          
          {partner.telehealth_enabled && (
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              Schedule Telehealth
            </Button>
          )}
          
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
        
        <PlacementRequestButton 
          facilityId={partner.id}
          facilityName={partner.name}
        />
      </CardFooter>
    </Card>
  );
};

export default PartnerDetailCard;