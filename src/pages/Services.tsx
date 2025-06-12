import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Clock, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Define Service interface
interface Service {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  duration?: string;
  image_url?: string;
  active: boolean;
  created_at?: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();
  const { membershipTier } = useAuth();

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch services from Supabase
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter services based on search term and category
  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get discount percentage based on membership tier
  const getDiscountPercentage = () => {
    switch (membershipTier) {
      case 'vip':
        return 20;
      case 'core':
        return 15;
      case 'smart':
        return 10;
      default:
        return 0;
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number) => {
    const discount = price * (getDiscountPercentage() / 100);
    return price - discount;
  };

  // Format price
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  // Handle booking service
  const handleBookService = (service: Service) => {
    toast({
      title: 'Booking initiated',
      description: `You're booking ${service.name}. This would redirect to the booking page.`,
    });
    // In a real app, this would redirect to a booking page or open a booking modal
  };

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Premium Health & Wellness Services
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Book exclusive services with your membership discount of {getDiscountPercentage()}%
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search services..." 
                className="pl-8 w-full md:w-[300px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all" onValueChange={setSelectedCategory}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="wellness">Wellness</TabsTrigger>
                <TabsTrigger value="aesthetic">Aesthetic</TabsTrigger>
                <TabsTrigger value="specialist">Specialist</TabsTrigger>
                <TabsTrigger value="therapy">Therapy</TabsTrigger>
                <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Services Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="overflow-hidden flex flex-col h-full">
                  {service.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={service.image_url} 
                        alt={service.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      {service.category && (
                        <Badge variant="outline" className={
                          service.category === 'aesthetic' ? 'bg-pink-50' : 
                          service.category === 'wellness' ? 'bg-green-50' : 
                          service.category === 'specialist' ? 'bg-blue-50' : 
                          service.category === 'therapy' ? 'bg-purple-50' : 
                          service.category === 'nutrition' ? 'bg-orange-50' : ''
                        }>
                          {service.category}
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                      {service.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{service.duration}</span>
                        </div>
                      )}
                      
                      {service.price && (
                        <div className="flex items-center gap-2 mt-4">
                          <div className="flex items-center">
                            <span className="font-medium text-lg">
                              {formatPrice(calculateDiscountedPrice(service.price))}
                            </span>
                            <span className="ml-2 text-sm line-through text-muted-foreground">
                              {formatPrice(service.price)}
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-auto flex items-center gap-1">
                            <Star className="h-3 w-3" /> {getDiscountPercentage()}% off
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleBookService(service)}>
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No services found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Membership Upgrade Banner */}
          {membershipTier !== 'vip' && (
            <div className="mt-16 bg-indigo-50 rounded-lg p-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Upgrade for More Benefits</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                  Upgrade to VIP membership to get 20% off all services and exclusive access to premium offerings.
                </p>
                <Button 
                  size="lg" 
                  className="mt-6"
                  onClick={() => window.location.href = '/membership'}
                >
                  Upgrade Membership
                </Button>
              </div>
            </div>
          )}

          {/* How It Works Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Browse Services</h3>
                <p className="text-gray-600">
                  Explore our range of premium health and wellness services.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Book Appointment</h3>
                <p className="text-gray-600">
                  Select a service and choose a convenient date and time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-5 -left-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Enjoy Your Service</h3>
                <p className="text-gray-600">
                  Experience premium care from our vetted professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;