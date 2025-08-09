import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, CheckCircle, User, Home, Star, Clock, Calendar, Phone, Mail, Video, MessageSquare, Ambulance, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FacilityDetailCard from '@/components/placement/FacilityDetailCard';
import ProfessionalDetailCard from '@/components/placement/ProfessionalDetailCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MarketplaceTransportBookingDialog from "@/components/marketplace/MarketplaceTransportBookingDialog";

// Interfaces
interface Facility {
  id: string;
  name: string;
  description?: string;
  location: string;
  care_type: string;
  price_range: string;
  spots_available: number;
  amenities?: string[];
  image_url?: string;
  images?: string[];
  videos?: string[];
  status: string;
  featured?: boolean;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  virtual_tour_url?: string;
}

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

interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
  delivery_available?: boolean;
  status?: string;
}

interface Transport {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  service_area?: string;
  services?: string;
  available_24_7?: boolean;
  wheelchair_accessible?: boolean;
  status?: string;
  rating?: number;
  profile_image?: string;
}

// Filter data
const careServices = [
  { id: 'ambulating', label: 'Ambulating' },
  { id: 'bathing', label: 'Bathing' },
  { id: 'dressing', label: 'Dressing' },
  { id: 'eating', label: 'Eating' },
  { id: 'hygiene', label: 'Hygiene/Grooming' },
  { id: 'meal_prep', label: 'Meal Preparation' },
  { id: 'showers', label: 'Showers' },
  { id: 'transferring', label: 'Transferring' },
  { id: 'medication', label: 'Medication Management' },
  { id: 'cleaning', label: 'Cleaning' },
  { id: 'laundry', label: 'Laundry' },
  { id: 'declutter', label: 'Declutter/Organization' },
  { id: 'transport', label: 'Transport to and from appointments' },
  { id: 'errands', label: 'Personal Errands' },
  { id: 'shopping', label: 'Grocery Shopping' }
];

const counties = {
  California: [
    'San Mateo County', 'Marin County', 'Santa Clara County', 'San Francisco County',
    'Contra Costa County', 'Alameda County', 'Alpine County', 'Napa County',
    'Santa Cruz County', 'Orange County', 'Placer County', 'El Dorado County',
    'Ventura County', 'Sonoma County', 'San Benito County', 'Santa Barbara County',
    'San Diego County', 'Monterey County', 'San Luis Obispo County', 'Los Angeles County'
  ],
  Texas: [
    'Travis County', 'Collin County', 'Tarrant County', 'Williamson County',
    'Fort Bend County', 'Montgomery County', 'Denton County', 'Harris County',
    'Dallas County', 'Bexar County'
  ]
};

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [careType, setCareType] = useState<string>('all');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'facilities' | 'professionals' | 'services' | 'pharmacies' | 'transport'>('facilities');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [availability, setAvailability] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [priceMin, setPriceMin] = useState<number>(0);
  const [priceMax, setPriceMax] = useState<number>(1000);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'email'
  });
  const { toast } = useToast();

  // Fetch data from database with real-time updates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch facilities
        const { data: facilitiesData, error: facilitiesError } = await supabase
          .from('care_facilities')
          .select('*')
          .eq('status', 'active')
          .order('featured', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (facilitiesError) {
          console.error('Error fetching facilities:', facilitiesError);
        } else {
          setFacilities(facilitiesData || []);
        }
        
        // Fetch professionals
        const { data: professionalsData, error: professionalsError } = await supabase
          .from('partners')
          .select('*')
          .eq('status', 'active')
          .order('verified', { ascending: false })
          .order('created_at', { ascending: false });
        
        if (professionalsError) {
          console.error('Error fetching professionals:', professionalsError);
        } else {
          setProfessionals(professionalsData || []);
        }

        // Fetch services
        const { data: servicesData, error: servicesError } = await supabase
          .from('services')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });
        
        if (servicesError) {
          console.error('Error fetching services:', servicesError);
        } else {
          setServices(servicesData || []);
        }

        // Fetch pharmacies
        const { data: pharmaciesData, error: pharmaciesError } = await supabase
          .from('pharmacies')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (pharmaciesError) {
          console.error('Error fetching pharmacies:', pharmaciesError);
        } else {
          setPharmacies(pharmaciesData || []);
        }

        // Fetch medical transport providers
        const { data: transportsData, error: transportsError } = await supabase
          .from('transports')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (transportsError) {
          console.error('Error fetching transports:', transportsError);
        } else {
          setTransports(transportsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load marketplace data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions
    const servicesChannel = supabase
      .channel('services-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'services'
        },
        (payload) => {
          console.log('Services updated:', payload);
          // Refetch services on any change
          if (payload.eventType === 'INSERT' && payload.new.active) {
            setServices(current => [payload.new as Service, ...current]);
          } else if (payload.eventType === 'UPDATE' && payload.new.active) {
            setServices(current => 
              current.map(service => 
                service.id === payload.new.id ? payload.new as Service : service
              )
            );
          } else if (payload.eventType === 'DELETE' || (payload.eventType === 'UPDATE' && !payload.new.active)) {
            setServices(current => 
              current.filter(service => service.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    const facilitiesChannel = supabase
      .channel('facilities-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'care_facilities'
        },
        (payload) => {
          console.log('Facilities updated:', payload);
          if (payload.eventType === 'INSERT' && payload.new.status === 'active') {
            setFacilities(current => [payload.new as Facility, ...current]);
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'active') {
            setFacilities(current => 
              current.map(facility => 
                facility.id === payload.new.id ? payload.new as Facility : facility
              )
            );
          } else if (payload.eventType === 'DELETE' || (payload.eventType === 'UPDATE' && payload.new.status !== 'active')) {
            setFacilities(current => 
              current.filter(facility => facility.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    const professionalsChannel = supabase
      .channel('professionals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'partners'
        },
        (payload) => {
          console.log('Professionals updated:', payload);
          if (payload.eventType === 'INSERT' && payload.new.status === 'active') {
            setProfessionals(current => [payload.new as Professional, ...current]);
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'active') {
            setProfessionals(current => 
              current.map(professional => 
                professional.id === payload.new.id ? payload.new as Professional : professional
              )
            );
          } else if (payload.eventType === 'DELETE' || (payload.eventType === 'UPDATE' && payload.new.status !== 'active')) {
            setProfessionals(current => 
              current.filter(professional => professional.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(facilitiesChannel);
      supabase.removeChannel(professionalsChannel);
    };
  }, [toast]);

  // Filter functions
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCareType = careType === 'all' || facility.care_type === careType;
    
    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = facility.location.includes(selectedState);
      if (selectedCounty !== 'all') {
        matchesLocation = facility.location.includes(selectedCounty);
      }
    }

    const matchesPriceRange = priceRange === 'all' || facility.price_range === priceRange;
    const matchesAvailability = availability === 'all' || 
      (availability === 'available' && facility.spots_available > 0) ||
      (availability === 'full' && facility.spots_available === 0);
    
    return matchesSearch && matchesCareType && matchesLocation && matchesPriceRange && matchesAvailability;
  });

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = 
      professional.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.service_area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.specialties?.some(specialty => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesSpecialty = careType === 'all' || 
      professional.specialties?.some(specialty => 
        specialty.toLowerCase().includes(careType.toLowerCase())
      );
    
    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = professional.service_area?.includes(selectedState) || false;
      if (selectedCounty !== 'all') {
        matchesLocation = professional.service_area?.includes(selectedCounty) || false;
      }
    }

    const matchesAvailability = availability === 'all' || 
      (availability === 'available' && professional.accepting_new_patients) ||
      (availability === 'full' && !professional.accepting_new_patients);
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesAvailability;
  });

  const filteredServices = services.filter(service => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = careType === 'all' || service.category === careType;
    
    const matchesPriceRange = (!service.price) || 
      (service.price >= priceMin && service.price <= priceMax);
    
    const matchesDuration = durationFilter === 'all' || 
      (durationFilter === 'short' && service.duration && service.duration.includes('30')) ||
      (durationFilter === 'medium' && service.duration && (service.duration.includes('60') || service.duration.includes('1 hour'))) ||
      (durationFilter === 'long' && service.duration && (service.duration.includes('90') || service.duration.includes('2 hour')));
    
    return matchesSearch && matchesCategory && matchesPriceRange && matchesDuration;
  });

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pharmacy.address && pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (pharmacy.hours && pharmacy.hours.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = pharmacy.address?.includes(selectedState) || false;
      if (selectedCounty !== 'all') {
        matchesLocation = pharmacy.address?.includes(selectedCounty) || false;
      }
    }

    const matchesAvailability = availability === 'all' ||
      (availability === 'available' && pharmacy.delivery_available) ||
      (availability === 'full' && !pharmacy.delivery_available);

    return matchesSearch && matchesLocation && matchesAvailability;
  });

  const filteredTransports = transports.filter((transport) => {
    const matchesSearch =
      transport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (transport.services && transport.services.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (transport.service_area && transport.service_area.toLowerCase().includes(searchQuery.toLowerCase()));

    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = transport.service_area?.includes(selectedState) || false;
      if (selectedCounty !== 'all') {
        matchesLocation = transport.service_area?.includes(selectedCounty) || false;
      }
    }

    const matchesAvailability = availability === 'all' ||
      (availability === 'available' && (transport.available_24_7 || transport.wheelchair_accessible)) ||
      availability === 'full';

    return matchesSearch && matchesLocation && matchesAvailability;
  });
  
  // Helper functions
  const toggleService = (serviceId: string) => {
    setSelectedServices(current => 
      current.includes(serviceId) 
        ? current.filter(id => id !== serviceId)
        : [...current, serviceId]
    );
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCounty('all');
  };

  const handleContactSubmit = () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Message sent!',
      description: 'We\'ll get back to you within 24 hours.',
    });

    setIsContactModalOpen(false);
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      preferredContact: 'email'
    });
  };

  const handlePayAndRequest = async (
    serviceKey: 'pharmacy_delivery' | 'medical_transport',
    providerType: string,
    providerId: string,
    providerName?: string
  ) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('create-marketplace-payment', {
        body: {
          service_key: serviceKey,
          provider_type: providerType,
          provider_id: providerId,
          provider_name: providerName,
        },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Marketplace checkout error:', err);
      toast({
        title: 'Checkout failed',
        description: err?.message || 'An error occurred during checkout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  if (selectedFacility) {
    return (
      <MainLayout>
        <div className="bg-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedFacility(null)}
              className="mb-6"
            >
              ← Back to Marketplace
            </Button>
            <FacilityDetailCard facility={selectedFacility} />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (selectedProfessional) {
    return (
      <MainLayout>
        <div className="bg-background py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProfessional(null)}
              className="mb-6"
            >
              ← Back to Marketplace
            </Button>
            <ProfessionalDetailCard partner={selectedProfessional} />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-background py-12" id="marketplace-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="lg:text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">
              Healthcare Marketplace
            </h1>
            <p className="mt-4 max-w-3xl text-xl text-muted-foreground lg:mx-auto">
              Discover trusted care facilities, healthcare professionals, pharmacies, medical transport, and premium services.
              Connect directly with providers and book consultations instantly.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-card p-6 rounded-lg shadow-sm border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Search marketplace..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={careType} onValueChange={setCareType}>
                <SelectTrigger>
                  <SelectValue placeholder="Category / Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {activeTab === 'facilities' && (
                    <>
                      <SelectItem value="Memory Care">Memory Care</SelectItem>
                      <SelectItem value="Assisted Living">Assisted Living</SelectItem>
                      <SelectItem value="Independent Living">Independent Living</SelectItem>
                      <SelectItem value="Long-Term Care">Long-Term Care</SelectItem>
                      <SelectItem value="Hospice Support">Hospice Support</SelectItem>
                    </>
                  )}
                  {activeTab === 'professionals' && (
                    <>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Caregiver">Caregiver</SelectItem>
                      <SelectItem value="Skilled Nurse">Skilled Nurse</SelectItem>
                      <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="Geriatric Care">Geriatric Care</SelectItem>
                      <SelectItem value="Primary Care">Primary Care</SelectItem>
                    </>
                  )}
                  {activeTab === 'services' && (
                    <>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="aesthetic">Aesthetic</SelectItem>
                      <SelectItem value="specialist">Specialist</SelectItem>
                      <SelectItem value="therapy">Therapy</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
                
                <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Get Help
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact Our Team</DialogTitle>
                      <DialogDescription>
                        Need help finding the right care? Our team is here to assist you.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Name *</Label>
                          <Input
                            id="name"
                            value={contactForm.name}
                            onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Tell us what kind of care you're looking for..."
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleContactSubmit}>Send Message</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            {showFilters && (
              <div className="mt-4 space-y-4">
                {/* Common filters for facilities and professionals */}
                {activeTab !== 'services' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Select value={selectedState} onValueChange={handleStateChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="Arizona">Arizona</SelectItem>
                        <SelectItem value="Nevada">Nevada</SelectItem>
                        <SelectItem value="Florida">Florida</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select 
                      value={selectedCounty} 
                      onValueChange={setSelectedCounty}
                      disabled={selectedState === 'all'}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectedState === 'all' ? "Select State First" : "Select County"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Counties</SelectItem>
                        {selectedState === 'California' && 
                          counties.California.map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))
                        }
                        {selectedState === 'Texas' && 
                          counties.Texas.map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>

                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Price Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="$">$ Budget-friendly</SelectItem>
                        <SelectItem value="$$">$$ Moderate</SelectItem>
                        <SelectItem value="$$$">$$$ Premium</SelectItem>
                        <SelectItem value="$$$$">$$$$ Luxury</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue placeholder="Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="available">Available Now</SelectItem>
                        <SelectItem value="full">Waitlist Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Enhanced filters for services */}
                {activeTab === 'services' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select value={durationFilter} onValueChange={setDurationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Durations</SelectItem>
                          <SelectItem value="short">Short (30 min)</SelectItem>
                          <SelectItem value="medium">Medium (60 min)</SelectItem>
                          <SelectItem value="long">Long (90+ min)</SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground min-w-fit">Price:</span>
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceMin}
                          onChange={(e) => setPriceMin(Number(e.target.value) || 0)}
                          className="w-20"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceMax}
                          onChange={(e) => setPriceMax(Number(e.target.value) || 1000)}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="facilities" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="facilities" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Care Facilities ({filteredFacilities.length})
              </TabsTrigger>
              <TabsTrigger value="professionals" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Healthcare Professionals ({filteredProfessionals.length})
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Premium Services ({filteredServices.length})
              </TabsTrigger>
              <TabsTrigger value="pharmacies" className="flex items-center gap-2">
                <Pill className="h-4 w-4" />
                Pharmacies ({filteredPharmacies.length})
              </TabsTrigger>
              <TabsTrigger value="transport" className="flex items-center gap-2">
                <Ambulance className="h-4 w-4" />
                Medical Transport ({filteredTransports.length})
              </TabsTrigger>
            </TabsList>

            {/* Facilities Tab */}
            <TabsContent value="facilities">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredFacilities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFacilities.map((facility) => (
                    <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedFacility(facility)}>
                      {facility.image_url && (
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={facility.image_url} 
                            alt={facility.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{facility.name}</CardTitle>
                          {facility.featured && (
                            <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {facility.location}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Badge variant="outline">{facility.care_type}</Badge>
                          <p className="text-sm text-muted-foreground">{facility.description}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{facility.price_range}</span>
                            <span className="text-sm text-muted-foreground">
                              {facility.spots_available > 0 ? `${facility.spots_available} spots` : 'Full'}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            if (facility.phone) window.location.href = `tel:${facility.phone}`;
                          }}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            if (facility.email) window.location.href = `mailto:${facility.email}`;
                          }}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="flex-1">View Details</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No care facilities found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setCareType('all');
                      setSelectedState('all');
                      setSelectedCounty('all');
                      setPriceRange('all');
                      setAvailability('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Professionals Tab */}
            <TabsContent value="professionals">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredProfessionals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfessionals.map((professional) => (
                    <Card key={professional.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedProfessional(professional)}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                            {professional.profile_image ? (
                              <img src={professional.profile_image} alt={professional.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{professional.name}</CardTitle>
                            {professional.credentials && (
                              <CardDescription>{professional.credentials}</CardDescription>
                            )}
                            {professional.rating && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-medium">{professional.rating}</span>
                              </div>
                            )}
                          </div>
                          {professional.verified && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {professional.specialties && professional.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {professional.specialties.slice(0, 3).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{specialty}</Badge>
                              ))}
                              {professional.specialties.length > 3 && (
                                <Badge variant="outline" className="text-xs">+{professional.specialties.length - 3} more</Badge>
                              )}
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground line-clamp-2">{professional.bio}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{professional.service_area}</span>
                          </div>
                          {professional.hourly_rate && (
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{professional.hourly_rate}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <div className="flex gap-2 w-full">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            if (professional.phone) window.location.href = `tel:${professional.phone}`;
                          }}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            if (professional.email) window.location.href = `mailto:${professional.email}`;
                          }}>
                            <Mail className="h-4 w-4" />
                          </Button>
                          {professional.telehealth_enabled && (
                            <Button variant="outline" size="sm">
                              <Video className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm" className="flex-1">View Profile</Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No healthcare professionals found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setCareType('all');
                      setSelectedState('all');
                      setSelectedCounty('all');
                      setAvailability('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                      <CardContent>
                        <div className="space-y-2">
                          {service.duration && (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{service.duration}</span>
                            </div>
                          )}
                          
                          {service.price && (
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-lg">
                                {formatPrice(service.price)}
                              </span>
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Star className="h-3 w-3" /> Premium
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No services found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setCareType('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Pharmacies Tab */}
            <TabsContent value="pharmacies">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredPharmacies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPharmacies.map((pharmacy) => (
                    <Card key={pharmacy.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                          {pharmacy.delivery_available && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivery Available</Badge>
                          )}
                        </div>
                        {pharmacy.address && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {pharmacy.address}
                          </CardDescription>
                        )}
                        {pharmacy.hours && (
                          <CardDescription>{pharmacy.hours}</CardDescription>
                        )}
                      </CardHeader>
                      <CardFooter>
                        <div className="flex gap-2 w-full justify-between items-center">
                          <div className="flex gap-2">
                            {pharmacy.address && (
                              <Button variant="outline" size="sm" onClick={() => window.open(`https://www.google.com/maps?q=${encodeURIComponent(pharmacy.address!)}`, '_blank')}>
                                Directions
                              </Button>
                            )}
                            {pharmacy.phone && (
                              <Button variant="outline" size="sm" onClick={() => (window.location.href = `tel:${pharmacy.phone}`)}>
                                <Phone className="h-4 w-4" />
                              </Button>
                            )}
                            {pharmacy.email && (
                              <Button variant="outline" size="sm" onClick={() => (window.location.href = `mailto:${pharmacy.email}`)}>
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                            <span className="text-sm text-muted-foreground">Members-only service</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Pill className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No pharmacies found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setCareType('all');
                      setSelectedState('all');
                      setSelectedCounty('all');
                      setAvailability('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Medical Transport Tab */}
            <TabsContent value="transport">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredTransports.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTransports.map((transport) => (
                    <Card key={transport.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{transport.name}</CardTitle>
                          <div className="flex gap-2">
                            {transport.available_24_7 && (
                              <Badge variant="outline" className="text-xs">24/7</Badge>
                            )}
                            {transport.wheelchair_accessible && (
                              <Badge variant="outline" className="text-xs">Wheelchair</Badge>
                            )}
                          </div>
                        </div>
                        {transport.service_area && (
                          <CardDescription className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {transport.service_area}
                          </CardDescription>
                        )}
                        {transport.services && (
                          <CardDescription>{transport.services}</CardDescription>
                        )}
                      </CardHeader>
                      <CardFooter>
                        <div className="flex gap-2 w-full justify-between items-center">
                          <div className="flex gap-2">
                            {transport.phone && (
                              <Button variant="outline" size="sm" onClick={() => (window.location.href = `tel:${transport.phone}`)}>
                                <Phone className="h-4 w-4" />
                              </Button>
                            )}
                            {transport.email && (
                              <Button variant="outline" size="sm" onClick={() => (window.location.href = `mailto:${transport.email}`)}>
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <MarketplaceTransportBookingDialog transport={{ id: transport.id, name: transport.name }} />
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ambulance className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg text-muted-foreground">No medical transport providers found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setCareType('all');
                      setSelectedState('all');
                      setSelectedCounty('all');
                      setAvailability('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* How It Works Section */}
          <div className="mt-16 bg-card p-8 rounded-lg border">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground">How Our Marketplace Works</h2>
              <p className="text-muted-foreground mt-2">Connect with trusted providers in three simple steps</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-3">Browse & Compare</h3>
                <p className="text-muted-foreground">
                  Explore verified care facilities, healthcare professionals, and premium services with detailed profiles and reviews.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-3">Connect Directly</h3>
                <p className="text-muted-foreground">
                  Contact providers directly through our platform or schedule consultations and tours instantly.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3">Get Care</h3>
                <p className="text-muted-foreground">
                  Receive personalized care from our network of trusted professionals and facilities.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-primary text-primary-foreground p-8 rounded-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Need Personalized Assistance?</h2>
            <p className="text-lg mb-6 opacity-90">
              Our concierge team can help you find the perfect care solution for your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" onClick={() => setIsContactModalOpen(true)}>
                <MessageSquare className="h-5 w-5 mr-2" />
                Contact Our Team
              </Button>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Phone className="h-5 w-5 mr-2" />
                Call (555) 123-4567
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Marketplace;