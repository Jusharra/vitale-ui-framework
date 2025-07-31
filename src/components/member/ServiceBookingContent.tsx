import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Clock, CreditCard, Percent, Tag, Settings } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import MembershipBadge from '../common/MembershipBadge';
import ServicePreferencesForm from './ServicePreferencesForm';

// Type definitions
type ServiceCategory = "specialist" | "aesthetic" | "wellness";
type MembershipTier = "smart" | "core" | "vip";

interface Service {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  provider: string;
  price: number;
  duration: string;
  image: string;
}

// Mock data for services
const services: Service[] = [
  {
    id: 1,
    name: "Dermatology Consultation",
    description: "Comprehensive skin assessment and treatment recommendations",
    category: "specialist",
    provider: "Dr. Emily Chen",
    price: 15000, // In cents ($150.00)
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 2,
    name: "Botox Treatment",
    description: "Targeted wrinkle reduction treatment",
    category: "aesthetic",
    provider: "Dr. Michael Smith",
    price: 35000, // In cents ($350.00)
    duration: "30 min",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Nutritional Consultation",
    description: "Personalized dietary planning and advice",
    category: "wellness",
    provider: "Sarah Johnson, RD",
    price: 12000, // In cents ($120.00)
    duration: "60 min",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 4,
    name: "Facial Treatment",
    description: "Rejuvenating skincare treatment",
    category: "aesthetic",
    provider: "Lisa Wong",
    price: 18000, // In cents ($180.00)
    duration: "75 min",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 5,
    name: "Orthopedic Assessment",
    description: "Comprehensive joint and mobility evaluation",
    category: "specialist",
    provider: "Dr. James Rodriguez",
    price: 22000, // In cents ($220.00)
    duration: "45 min",
    image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d05150?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
  },
  {
    id: 6,
    name: "Massage Therapy",
    description: "Therapeutic massage for stress relief and muscle tension",
    category: "wellness",
    provider: "Robert Thompson",
    price: 9000, // In cents ($90.00)
    duration: "60 min",
    image: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
  },
];

// Helper function to get discount based on membership tier
const getDiscountPercentage = (membership: MembershipTier): number => {
  switch (membership) {
    case "vip":
      return 20;
    case "core":
      return 15;
    case "smart":
      return 10;
    default:
      return 0;
  }
};

const ServiceBookingContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("services");
  const [category, setCategory] = useState<ServiceCategory>("specialist");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const { toast } = useToast();
  
  // In a real app, this would come from context or API
  const userMembership: MembershipTier = "smart"; // Mock value
  
  // Generate time slots (9 AM to 5 PM) with 30-minute intervals
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      const hourFormatted = hour === 12 ? "12" : (hour % 12).toString();
      const period = hour < 12 ? "AM" : "PM";
      slots.push(`${hourFormatted}:00 ${period}`);
      slots.push(`${hourFormatted}:30 ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Filter services by category
  const filteredServices = services.filter(service => service.category === category);

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number): number => {
    const discountPercentage = getDiscountPercentage(userMembership);
    const discount = price * (discountPercentage / 100);
    return price - discount;
  };

  // Format price from cents to dollars
  const formatPrice = (cents: number): string => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsBookingMode(true);
  };

  const handleBookService = async () => {
    if (!selectedService || !date || !timeSlot) {
      toast({
        title: "Incomplete booking",
        description: "Please select a date and time to complete your booking.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would call a Supabase Edge Function
    // that creates a Stripe Checkout session with the discounted price
    try {
      // Mock Stripe checkout redirection
      toast({
        title: "Redirecting to payment...",
        description: "You'll now be redirected to complete your payment.",
      });
      
      // Simulate checkout process
      setTimeout(() => {
        toast({
          title: "Booking confirmed!",
          description: `Your appointment with ${selectedService.provider} on ${format(date, 'PPP')} at ${timeSlot} has been booked.`,
        });
        
        // Reset booking state
        setSelectedService(null);
        setDate(undefined);
        setTimeSlot(null);
        setIsBookingMode(false);
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "There was an error processing your booking. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBackToServices = () => {
    setIsBookingMode(false);
    setSelectedService(null);
    setDate(undefined);
    setTimeSlot(null);
    setActiveTab("services");
  };

  return (
    <div className="space-y-6">
      {!isBookingMode ? (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Services</h2>
              <p className="text-muted-foreground">
                As a <MembershipBadge type="premium" /> member, you receive {getDiscountPercentage("premium" as any)}% off all service bookings
              </p>
            </div>
          </div>

          <Tabs defaultValue="services" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="services">Available Services</TabsTrigger>
              <TabsTrigger value="preferences">My Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="mt-6">
              <Tabs defaultValue="specialist" className="w-full" onValueChange={(value) => setCategory(value as ServiceCategory)}>
                <TabsList className="grid w-full md:w-[400px] grid-cols-3">
                  <TabsTrigger value="specialist">Specialists</TabsTrigger>
                  <TabsTrigger value="aesthetic">Aesthetic</TabsTrigger>
                  <TabsTrigger value="wellness">Wellness</TabsTrigger>
                </TabsList>

                {["specialist", "aesthetic", "wellness"].map((categoryType) => (
                  <TabsContent key={categoryType} value={categoryType} className="mt-6">
                    {filteredServices.length === 0 ? (
                      <Card>
                        <CardContent className="py-10 text-center">
                          <p className="text-muted-foreground">No services available in this category</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                          <Card key={service.id} className="overflow-hidden flex flex-col h-full">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={service.image} 
                                alt={service.name} 
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{service.name}</CardTitle>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {service.duration}
                                </Badge>
                              </div>
                              <CardDescription>{service.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                              <p className="text-sm mb-1">Provider: {service.provider}</p>
                              <div className="flex items-center mt-2">
                                <div className="flex items-center">
                                  <span className="font-medium text-lg">
                                    {formatPrice(calculateDiscountedPrice(service.price))}
                                  </span>
                                  <span className="ml-2 text-sm line-through text-muted-foreground">
                                    {formatPrice(service.price)}
                                  </span>
                                </div>
                                <Badge variant="secondary" className="ml-auto flex items-center gap-1">
                                  <Percent className="h-3 w-3" /> {getDiscountPercentage(userMembership)}% off
                                </Badge>
                              </div>
                            </CardContent>
                            <CardFooter>
                              <Button onClick={() => handleServiceSelect(service)} className="w-full">Book Now</Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-6">
              <ServicePreferencesForm />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        selectedService && (
          <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Book {selectedService.name}</CardTitle>
                  <CardDescription>Select a date and time for your appointment</CardDescription>
                </div>
                <Button variant="outline" onClick={handleBackToServices}>Back to Services</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Service Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Provider:</span>
                        <span>{selectedService.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{selectedService.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Original Price:</span>
                        <span className="line-through">{formatPrice(selectedService.price)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Discounted Price:</span>
                        <span className="flex items-center">
                          {formatPrice(calculateDiscountedPrice(selectedService.price))}
                          <Badge variant="outline" className="ml-2 flex items-center gap-1">
                            <Percent className="h-3 w-3" /> {getDiscountPercentage(userMembership)}% off
                          </Badge>
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Select Date</h3>
                    <div className="border rounded-md">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Select Time</h3>
                  {date ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={timeSlot === slot ? "default" : "outline"}
                          className={cn(
                            "justify-start text-left font-normal",
                            timeSlot === slot && "text-primary-foreground"
                          )}
                          onClick={() => setTimeSlot(slot)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-muted">
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <CalendarIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-center text-muted-foreground">
                          Please select a date first
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="w-full p-4 border rounded-md bg-muted/50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Booking Summary</h3>
                    {date && timeSlot && (
                      <p className="text-sm text-muted-foreground">
                        {selectedService.name} on {format(date, 'PPPP')} at {timeSlot}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium">
                      {formatPrice(calculateDiscountedPrice(selectedService.price))}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getDiscountPercentage(userMembership)}% discount applied
                    </p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={handleBookService} 
                disabled={!date || !timeSlot} 
                className="w-full"
                size="lg"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Button>
            </CardFooter>
          </Card>
        )
      )}
    </div>
  );
};

export default ServiceBookingContent;
