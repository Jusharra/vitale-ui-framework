import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, CheckCircle, User, Home, Star, Clock, Phone, Mail, MessageSquare, Ambulance, Pill, Stethoscope, UserCheck, Heart, FlaskConical, Activity, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FacilityDetailCard from '@/components/placement/FacilityDetailCard';
import ProfessionalDetailCard from '@/components/placement/ProfessionalDetailCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import MarketplaceTransportBookingDialog from "@/components/marketplace/MarketplaceTransportBookingDialog";
import MarketplaceServiceBookingDialog from "@/components/marketplace/MarketplaceServiceBookingDialog";
import { Helmet } from 'react-helmet';
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
        
        // Fetch professionals via secure RPC
        const { data: professionalsData, error: professionalsError } = await (supabase as any)
          .rpc('get_public_partners', { p_limit: 100 });
        
        if (professionalsError) {
          console.error('Error fetching professionals:', professionalsError);
        } else {
          setProfessionals((professionalsData as any[]) || []);
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
          const pick = (row: any) => ({
            id: row.id,
            slug: row.slug,
            name: row.name,
            practice_name: row.practice_name,
            specialties: row.specialties,
            languages: row.languages,
            service_area: row.service_area,
            hourly_rate: row.hourly_rate,
            bio: row.bio,
            accepting_new_patients: row.accepting_new_patients,
            telehealth_enabled: row.telehealth_enabled,
            status: row.status,
            profile_image: row.profile_image,
            rating: row.rating,
            verified: row.verified,
            credentials: row.credentials,
          });

          if (payload.eventType === 'INSERT' && payload.new.status === 'active') {
            setProfessionals(current => [pick(payload.new), ...current]);
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'active') {
            setProfessionals(current =>
              current.map(professional =>
                professional.id === payload.new.id ? pick(payload.new) as any : professional
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

  // Reset category when switching tabs to avoid mismatched filters
  useEffect(() => {
    setCareType('all');
  }, [activeTab]);

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

    const matchesCategory = careType === 'all' ||
      (careType === 'delivery' && pharmacy.delivery_available) ||
      (careType === 'in_store' && pharmacy.delivery_available === false);

    return matchesSearch && matchesLocation && matchesAvailability && matchesCategory;
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

    const matchesCategory = careType === 'all' ||
      (careType === 'wheelchair_accessible' && !!transport.wheelchair_accessible) ||
      (careType === 'available_24_7' && !!transport.available_24_7) ||
      (careType === 'non_emergency' && (transport.services?.toLowerCase().includes('non-emergency') || transport.services?.toLowerCase().includes('non emergency'))) ||
      (careType === 'ambulance' && transport.services?.toLowerCase().includes('ambulance'));

    return matchesSearch && matchesLocation && matchesAvailability && matchesCategory;
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

  const PHONE_NUMBER = '(888) 400-2273';
  const PHONE_HREF = 'tel:+18884002273';

  const CATEGORIES = [
    {
      icon: Stethoscope,
      name: 'Physicians',
      description: 'Board-certified MDs for home, hotel, and office visits.',
      details: [
        'Acute illness evaluation and diagnosis',
        'Medication management and prescriptions',
        'Chronic disease check-ins and monitoring',
        'Post-hospitalization follow-up visits',
      ],
    },
    {
      icon: UserCheck,
      name: 'Nurse Practitioners',
      description: 'Advanced practice nurses with prescription authority for same-day visits.',
      details: [
        'Evaluation, diagnosis, and treatment',
        'Prescription and medication adjustments',
        'Wellness and preventive care visits',
        'Lab coordination and follow-up',
      ],
    },
    {
      icon: Heart,
      name: 'Registered Nurses',
      description: 'Licensed RNs for clinical care at your location.',
      details: [
        'Post-surgical wound care and monitoring',
        'IV therapy and medication administration',
        'Patient education and care coordination',
        'Vital signs and clinical assessment',
      ],
    },
    {
      icon: FlaskConical,
      name: 'Mobile Labs',
      description: 'On-site specimen collection and lab coordination.',
      details: [
        'Blood draws at your home, hotel, or office',
        'Specimen collection and processing',
        'Results coordinated directly with your provider',
        'No lab visit required',
      ],
    },
    {
      icon: Home,
      name: 'Home Care Providers',
      description: 'Vetted aides and care coordinators for daily support.',
      details: [
        'Activities of daily living (ADL) assistance',
        'Companion care and supervision',
        'Medication reminders and scheduling',
        'Family caregiver coordination',
      ],
    },
    {
      icon: Activity,
      name: 'Specialty Services',
      description: 'Expanded clinical and care management services.',
      details: [
        'IV hydration and infusion therapy',
        'Hospice coordination and placement',
        'Assisted living placement guidance',
        'Concierge health program management',
      ],
    },
  ];

  return (
    <MainLayout>
      <Helmet>
        <title>Provider Network Access | Vitalé Health Concierge</title>
        <meta name="description" content="Access Vitalé's coordinated network of independent licensed healthcare professionals — physicians, nurse practitioners, registered nurses, mobile labs, and more. Request coordination today." />
        <link rel="canonical" href="https://vitalehealthconcierge.doctor/marketplace" />
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-primary text-sm font-semibold uppercase tracking-widest">
            Healthcare Coordination &amp; Access Platform
          </p>
          <h1 className="text-4xl md:text-5xl font-bold font-playfair leading-tight">
            Access Our Coordinated<br className="hidden md:block" /> Provider Network
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Vitalé gives you access to a vetted network of independent licensed healthcare professionals.
            We coordinate the right provider for your need — you don't browse a list, you make one call.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-xl px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-[0_4px_24px_hsl(var(--brand-gold)/0.5)]"
            >
              <Phone className="h-5 w-5" /> {PHONE_NUMBER}
            </a>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="text-sm text-white/60 hover:text-white/90 underline transition-colors"
            >
              Prefer a callback? Submit a request →
            </button>
          </div>
          <p className="text-white/35 text-xs">
            Available 24/7 · Real coordinator answers · No hold queues
          </p>
        </div>
      </section>

      {/* ── NETWORK ASSET NOTICE ── */}
      <section className="bg-muted/40 border-b border-border px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-start gap-3 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p>
            <strong className="text-foreground">Provider details are not listed publicly.</strong>{' '}
            Vitalé coordinates access on your behalf — matching you to the right licensed professional
            based on your need, location, and urgency. Provider information is shared after coordination is confirmed.
          </p>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">Provider Categories</h2>
          <p className="text-muted-foreground mb-10 max-w-xl">
            Tell us which type of provider you need. We'll identify the nearest available licensed professional
            and coordinate the visit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map(({ icon: Icon, name, description, details }) => (
              <div key={name} className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-base">{name}</h3>
                </div>

                <p className="text-sm text-muted-foreground">{description}</p>

                <ul className="space-y-1.5 flex-1">
                  {details.map(d => (
                    <li key={d} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{d}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setContactForm(prev => ({
                      ...prev,
                      message: `I'd like to request access to a ${name} in my area.`,
                    }));
                    setIsContactModalOpen(true);
                  }}
                  className="mt-2 w-full flex items-center justify-center gap-2 border border-primary text-primary font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Request a {name} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY WE COORDINATE ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/40 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <h2 className="text-3xl md:text-4xl font-bold font-playfair">
                Why we coordinate instead of list
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Vitalé is a healthcare coordination and access platform — not a provider directory.
                We deliberately don't publish individual provider profiles, contact information, or
                availability listings.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This protects you and the providers in our network. When you call us, we match
                you to the right professional based on your clinical need, location, and urgency —
                not based on whoever ranked highest in a search result.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The result: better matches, faster dispatch, and providers who aren't fielding
                unqualified direct contacts all day.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Vetted before dispatch',
                  body: 'Every provider in our network is licensed, insured, and background-verified before we coordinate a single visit.',
                },
                {
                  icon: Clock,
                  title: 'Matched to your need',
                  body: 'We route based on clinical fit, proximity, and current availability — not a static directory listing.',
                },
                {
                  icon: Lock,
                  title: 'Your information stays private',
                  body: "Provider details are shared after coordination is confirmed. You're never handed a list and told 'good luck.'",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-0.5">{title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW ACCESS WORKS ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair mb-3">How Access Works</h2>
          <p className="text-muted-foreground mb-12">Three steps from your call to a provider at your door.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {[
              { num: '1', title: 'You Request', body: 'Call us or submit a request. Tell us what type of provider you need, where you are, and how urgently.' },
              { num: '2', title: 'We Match & Dispatch', body: 'We identify the nearest available licensed professional who fits your clinical need and confirm their dispatch.' },
              { num: '3', title: 'Provider Arrives', body: 'The provider contacts you to confirm visit details, then arrives at your home, hotel, office, or any location.' },
            ].map(step => (
              <div key={step.num} className="rounded-2xl border border-border bg-card p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                  {step.num}
                </div>
                <h3 className="font-bold text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[hsl(var(--brand-ink))] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-playfair">Ready to Request a Provider?</h2>
          <p className="text-white/70 text-lg">
            One call connects you to our coordinated network. A real coordinator answers 24/7.
          </p>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center justify-center gap-3 bg-[hsl(var(--brand-gold))] text-[hsl(var(--brand-ink))] font-bold text-2xl md:text-3xl px-10 py-5 rounded-xl hover:brightness-110 transition-all shadow-[0_6px_30px_hsl(var(--brand-gold)/0.5)]"
          >
            <Phone className="h-7 w-7" /> {PHONE_NUMBER}
          </a>
          <p className="text-white/40 text-sm">
            Available 24/7 · Real coordinator answers · No hold queues
          </p>
        </div>
      </section>

      {/* ── CONTACT / REQUEST MODAL ── */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Provider Access</DialogTitle>
            <DialogDescription>
              Tell us what you need and a coordinator will follow up to match you with the right provider.
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
              <Label htmlFor="message">What do you need? *</Label>
              <Textarea
                id="message"
                value={contactForm.message}
                onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Describe the type of provider or service you're looking for..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleContactSubmit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Marketplace;
