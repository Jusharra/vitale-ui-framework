import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Phone, Mail, Clock, CheckCircle, Info, MessageSquare, Video } from 'lucide-react';
import PlacementRequestButton from './PlacementRequestButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';

interface FacilityDetailCardProps {
  facility: {
    id: string;
    name: string;
    description?: string;
    location: string;
    care_type: string;
    price_range: string;
    spots_available: number;
    amenities?: string[];
    image_url?: string;
    status: string;
    featured?: boolean;
    phone?: string;
    email?: string;
    hours?: string;
    images?: string[]; // Array of image URLs for the carousel
    virtual_tour_url?: string; // URL for virtual tour
  };
}

const FacilityDetailCard: React.FC<FacilityDetailCardProps> = ({ facility }) => {
  // Use the images array if available, otherwise create an array with the single image_url
  const imageUrls = facility.images || (facility.image_url ? [facility.image_url] : []);
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  
  // If no images are available, use a placeholder
  if (imageUrls.length === 0) {
    imageUrls.push('https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg');
  }

  const handleCallFacility = () => {
    if (facility.phone) {
      window.location.href = `tel:${facility.phone}`;
    } else {
      toast({
        title: "No phone number available",
        description: "This facility hasn't provided a phone number.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the facility administrator.",
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

  const handleVirtualTour = () => {
    if (facility.virtual_tour_url) {
      window.open(facility.virtual_tour_url, '_blank');
    } else {
      toast({
        title: "Virtual tour not available",
        description: "This facility doesn't have a virtual tour available yet.",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <Carousel className="w-full">
          <CarouselContent>
            {imageUrls.map((url, index) => (
              <CarouselItem key={index}>
                <div className="h-64 w-full">
                  <img 
                    src={url} 
                    alt={`${facility.name} - Image ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
        
        {facility.featured && (
          <Badge className="absolute top-4 right-4 bg-indigo-600">
            Featured
          </Badge>
        )}
      </div>
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{facility.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              {facility.location}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {facility.care_type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <p className="text-gray-700">{facility.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <Info className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">Price Range:</span>
              <span>{facility.price_range}</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <CheckCircle className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">Availability:</span>
              <span>
                {facility.spots_available > 0 
                  ? `${facility.spots_available} spots available` 
                  : "Currently full"}
              </span>
            </div>
            
            {facility.phone && (
              <div className="flex items-center gap-1 text-sm">
                <Phone className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Phone:</span>
                <span>{facility.phone}</span>
              </div>
            )}
            
            {facility.email && (
              <div className="flex items-center gap-1 text-sm">
                <Mail className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Email:</span>
                <span>{facility.email}</span>
              </div>
            )}
            
            {facility.hours && (
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Hours:</span>
                <span>{facility.hours}</span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {facility.amenities && facility.amenities.map((amenity, idx) => (
                <Badge key={idx} variant="outline">{amenity}</Badge>
              ))}
              {(!facility.amenities || facility.amenities.length === 0) && (
                <p className="text-sm text-muted-foreground">No amenities listed</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="font-medium text-indigo-800 mb-2">Placement Information</h3>
          <p className="text-sm text-indigo-700 mb-3">
            Unlike traditional agencies, Vitale offers families concierge placement options with the power of perks, speed, and advocacy. We only work with trusted homes and ensure you get the best care.
          </p>
          <div className="flex items-center text-sm text-indigo-800">
            <CheckCircle className="h-4 w-4 mr-2 text-indigo-600" />
            <span>No upfront fee required for standard placement</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCallFacility}>
            <Phone className="h-4 w-4 mr-2" />
            Contact Facility
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
                <DialogTitle>Message {facility.name}</DialogTitle>
                <DialogDescription>
                  Send a message to the facility administrator. They will respond to you directly.
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
          
          <Button variant="outline" onClick={handleVirtualTour}>
            <Video className="h-4 w-4 mr-2" />
            Virtual Tour
          </Button>
        </div>
        
        <PlacementRequestButton 
          facilityId={facility.id}
          facilityName={facility.name}
        />
      </CardFooter>
    </Card>
  );
};

export default FacilityDetailCard;