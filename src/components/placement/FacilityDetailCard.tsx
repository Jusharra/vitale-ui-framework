import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { MapPin, Phone, Mail, Clock, CheckCircle, Info, MessageSquare, Video, Calendar, Globe } from 'lucide-react';
import PlacementRequestButton from './PlacementRequestButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import ScheduleTourModal from './ScheduleTourModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    images?: string[]; // Array of image URLs
    videos?: string[]; // Array of video URLs
    status: string;
    featured?: boolean;
    phone?: string;
    email?: string;
    website?: string;
    hours?: string;
    virtual_tour_url?: string;
  };
}

const FacilityDetailCard = ({ facility }: FacilityDetailCardProps) => {
  // Use the images array if available, otherwise create an array with the single image_url
  const imageUrls = facility.images?.length ? facility.images : (facility.image_url ? [facility.image_url] : []);
  const videoUrls = facility.videos || [];
  const { toast } = useToast();
  const [messageText, setMessageText] = useState('');
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<'images' | 'videos'>('images');
  
  // If no images or videos are available, use a placeholder
  if (imageUrls.length === 0 && videoUrls.length === 0) {
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

  const handleEmailFacility = () => {
    if (facility.email) {
      window.location.href = `mailto:${facility.email}`;
    } else {
      toast({
        title: "No email available",
        description: "This facility hasn't provided an email address.",
        variant: "destructive",
      });
    }
  };

  const handleVisitWebsite = () => {
    if (facility.website) {
      window.open(facility.website, '_blank');
    } else {
      toast({
        title: "No website available",
        description: "This facility hasn't provided a website URL.",
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{facility.name}</CardTitle>
            <CardDescription>
              <div className="flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                {facility.location}
              </div>
            </CardDescription>
          </div>
          <Badge variant="outline">{facility.care_type}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          {/* Media type selector */}
          {videoUrls.length > 0 && (
            <div className="absolute top-2 right-2 z-10 bg-black/50 rounded-lg p-1">
              <div className="flex space-x-1">
                <Button 
                  size="sm" 
                  variant={activeMediaType === 'images' ? 'default' : 'outline'} 
                  onClick={() => setActiveMediaType('images')}
                  className="h-8 px-2 py-1"
                >
                  Photos
                </Button>
                <Button 
                  size="sm" 
                  variant={activeMediaType === 'videos' ? 'default' : 'outline'} 
                  onClick={() => setActiveMediaType('videos')}
                  className="h-8 px-2 py-1"
                >
                  Videos
                </Button>
              </div>
            </div>
          )}

          {/* Images Carousel */}
          {activeMediaType === 'images' && imageUrls.length > 0 && (
            <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg bg-black">
              <Carousel className="w-full">
                <CarouselContent>
                  {imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full flex items-center justify-center">
                        <div className="w-full h-[400px] flex items-center justify-center">
                          <img 
                            src={url} 
                            alt={`${facility.name} - Image ${index + 1}`} 
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          )}

          {/* Videos Carousel */}
          {activeMediaType === 'videos' && videoUrls.length > 0 && (
            <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden rounded-lg bg-black">
              <Carousel className="w-full">
                <CarouselContent>
                  {videoUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="w-full h-[400px] flex items-center justify-center">
                        <video 
                          src={url} 
                          controls
                          className="max-w-full max-h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          )}

          {/* No Videos Placeholder */}
          {activeMediaType === 'videos' && videoUrls.length === 0 && (
            <div className="h-64 w-full bg-muted flex items-center justify-center rounded-lg">
              <div className="text-center">
                <Video className="h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No videos available</p>
              </div>
            </div>
          )}
        </div>

        {/* Facility Description */}
        {facility.description && (
          <div>
            <h3 className="text-lg font-medium mb-2">About {facility.name}</h3>
            <p className="text-gray-700">{facility.description}</p>
          </div>
        )}
        
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
                  ? `${facility.spots_available} spots` 
                  : "Full"}
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
            
            {facility.website && (
              <div className="flex items-center gap-1 text-sm">
                <Globe className="h-4 w-4 text-indigo-600" />
                <span className="font-medium">Website:</span>
                <span className="truncate">{facility.website}</span>
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
            <h4 className="text-sm font-medium mb-2">Amenities</h4>
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
            Call Facility
          </Button>
          
          <Button variant="outline" onClick={handleEmailFacility}>
            <Mail className="h-4 w-4 mr-2" />
            Email Facility
          </Button>
          
          {facility.website && (
            <Button variant="outline" onClick={handleVisitWebsite}>
              <Globe className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
          )}
          
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

          <Button variant="outline" onClick={() => setIsTourModalOpen(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Tour
          </Button>
        </div>
        
        <PlacementRequestButton 
          facilityId={facility.id}
          facilityName={facility.name}
        />
      </CardFooter>

      <ScheduleTourModal 
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        facility={facility}
      />
    </Card>
  );
};

export default FacilityDetailCard;