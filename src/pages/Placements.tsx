import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, CheckCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FacilityDetailCard from '@/components/placement/FacilityDetailCard';
import PlacementRequestButton from '@/components/placement/PlacementRequestButton';
import PartnerDetailCard from '@/components/placement/PartnerDetailCard';

// Define the Facility interface
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
  images?: string[]; // Array of image URLs
  videos?: string[]; // Array of video URLs
  status: string;
  featured?: boolean;
  phone?: string;
  email?: string;
  website?: string;
  hours?: string;
  virtual_tour_url?: string;
}

// Define the Partner interface
interface Partner {
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
  slug?: string;
}

// Define care services for filtering
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

// California and Texas counties
const counties = {
  California: [
    'San Mateo County',
    'Marin County',
    'Santa Clara County',
    'San Francisco County',
    'Contra Costa County',
    'Alameda County',
    'Alpine County',
    'Napa County',
    'Santa Cruz County',
    'Orange County',
    'Placer County',
    'El Dorado County',
    'Ventura County',
    'Sonoma County',
    'San Benito County',
    'Santa Barbara County',
    'San Diego County',
    'Monterey County',
    'San Luis Obispo County',
    'Los Angeles County'
  ],
  Texas: [
    'Travis County',
    'Collin County',
    'Tarrant County',
    'Williamson County',
    'Fort Bend County',
    'Montgomery County',
    'Denton County',
    'Harris County',
    'Dallas County',
    'Bexar County'
  ]
};

const Placements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [careType, setCareType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showServiceFilters, setShowServiceFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [viewType, setViewType] = useState<'facilities' | 'professionals'>('facilities');
  const { toast } = useToast();

  // Fetch facilities and partners from database
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch active facilities from the database
        const { data: facilitiesData, error: facilitiesError } = await supabase
          .from('care_facilities')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (facilitiesError) throw facilitiesError;
        
        // Fetch active partners from the database
        const { data: partnersData, error: partnersError } = await supabase
          .from('partners')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (partnersError) throw partnersError;
        
        if (facilitiesData && facilitiesData.length > 0) {
          setFacilities(facilitiesData);
        } else {
          // If no facilities found in the database, use mock data
          console.log("No facilities found in database, using mock data");
          setFacilities([
            {
              id: '1',
              name: 'Sunset Gardens Memory Care',
              description: 'Specialized memory care facility with 24/7 support, secure environment, and personalized care plans.',
              location: 'San Mateo County, CA',
              care_type: 'Memory Care',
              price_range: '$6,500/month',
              spots_available: 3,
              amenities: ['24/7 Care', 'Secure Environment', 'Memory Programs'],
              image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
              status: 'active',
              featured: true,
              phone: '(555) 123-4567',
              email: 'info@sunsetgardens.com',
              hours: 'Open 24/7 for tours by appointment',
              images: [
                'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
                'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
                'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg'
              ],
              virtual_tour_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
              id: '2',
              name: 'Oakridge Senior Living',
              description: 'Luxury senior living community with independent and assisted living options, fine dining, and resort-style amenities.',
              location: 'Orange County, CA',
              care_type: 'Long-Term Care',
              price_range: '$4,800/month',
              spots_available: 7,
              amenities: ['Fine Dining', 'Resort Amenities', 'Independent Living'],
              image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
              status: 'active',
              featured: false,
              phone: '(555) 234-5678',
              email: 'info@oakridgesenior.com',
              hours: '8:00 AM - 8:00 PM',
              images: [
                'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
                'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg',
                'https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg'
              ],
              virtual_tour_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
              id: '3',
              name: 'Serenity Hospice House',
              description: 'Compassionate end-of-life care in a peaceful setting with private rooms, family accommodations, and 24/7 medical support.',
              location: 'Travis County, TX',
              care_type: 'Hospice Support',
              price_range: 'Insurance accepted',
              spots_available: 1,
              amenities: ['Private Rooms', 'Family Accommodations', '24/7 Medical Support'],
              image_url: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg',
              status: 'active',
              featured: false,
              phone: '(555) 345-6789',
              email: 'care@serenityhospice.org',
              hours: 'Open 24/7',
              images: [
                'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg',
                'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg',
                'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg'
              ],
              virtual_tour_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
              id: '4',
              name: 'Golden Years Assisted Living',
              description: 'Upscale assisted living community with personalized care plans, luxury amenities, and a vibrant social calendar.',
              location: 'Los Angeles County, CA',
              care_type: 'Assisted Living',
              price_range: '$5,200/month',
              spots_available: 5,
              amenities: ['Personalized Care', 'Luxury Amenities', 'Social Activities'],
              image_url: 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg',
              status: 'active',
              featured: true,
              phone: '(555) 456-7890',
              email: 'info@goldenyears.com',
              hours: '9:00 AM - 7:00 PM',
              images: [
                'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg',
                'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
                'https://images.pexels.com/photos/3825586/pexels-photo-3825586.jpeg'
              ],
              virtual_tour_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            },
            {
              id: '5',
              name: 'Lakeside Retirement Village',
              description: 'Active adult community with lakefront views, independent living cottages, and comprehensive wellness programs.',
              location: 'Collin County, TX',
              care_type: 'Independent Living',
              price_range: '$3,800/month',
              spots_available: 12,
              amenities: ['Lakefront Views', 'Private Cottages', 'Wellness Programs'],
              image_url: 'https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg',
              status: 'active',
              featured: false,
              phone: '(555) 567-8901',
              email: 'info@lakesideretirement.com',
              hours: '8:00 AM - 6:00 PM',
              images: [
                'https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg',
                'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
                'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg'
              ],
              virtual_tour_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
            }
          ]);
        }
        
        if (partnersData && partnersData.length > 0) {
          setPartners(partnersData);
        } else {
          // If no partners found in the database, use mock data
          console.log("No partners found in database, using mock data");
          setPartners([
            {
              id: '1',
              name: 'Dr. Sarah Johnson',
              first_name: 'Sarah',
              credentials: 'MD',
              email: 'sarah.johnson@example.com',
              phone: '(555) 123-4567',
              practice_name: 'Johnson Family Medicine',
              specialties: ['Family Medicine', 'Geriatric Care'],
              service_area: 'San Mateo County, CA',
              bio: 'Board-certified family physician with over 15 years of experience in geriatric care.',
              accepting_new_patients: true,
              telehealth_enabled: true,
              status: 'active',
              profile_image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
              rating: 4.9,
              verified: true,
              slug: 'dr-sarah-johnson'
            },
            {
              id: '2',
              name: 'Dr. Michael Chen',
              first_name: 'Michael',
              credentials: 'MD',
              email: 'michael.chen@example.com',
              phone: '(555) 234-5678',
              practice_name: 'Chen Internal Medicine',
              specialties: ['Internal Medicine', 'Cardiology'],
              service_area: 'Santa Clara County, CA',
              bio: 'Experienced internist specializing in cardiac care for seniors.',
              accepting_new_patients: true,
              telehealth_enabled: true,
              status: 'active',
              profile_image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
              rating: 4.8,
              verified: true,
              slug: 'dr-michael-chen'
            },
            {
              id: '3',
              name: 'Dr. Emily Rodriguez',
              first_name: 'Emily',
              credentials: 'MD',
              email: 'emily.rodriguez@example.com',
              phone: '(555) 345-6789',
              practice_name: 'Rodriguez Neurology',
              specialties: ['Neurology', 'Memory Care'],
              service_area: 'Los Angeles County, CA',
              bio: 'Neurologist specializing in memory disorders and dementia care.',
              accepting_new_patients: true,
              telehealth_enabled: true,
              status: 'active',
              profile_image: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
              rating: 4.9,
              verified: true,
              slug: 'dr-emily-rodriguez'
            },
            {
              id: '4',
              name: 'Dr. James Wilson',
              first_name: 'James',
              credentials: 'MD',
              email: 'james.wilson@example.com',
              phone: '(555) 456-7890',
              practice_name: 'Wilson Geriatric Care',
              specialties: ['Geriatric Medicine', 'Palliative Care'],
              service_area: 'Travis County, TX',
              bio: 'Geriatrician with a focus on comprehensive care for elderly patients.',
              accepting_new_patients: true,
              telehealth_enabled: false,
              status: 'active',
              profile_image: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg',
              rating: 4.7,
              verified: true,
              slug: 'dr-james-wilson'
            },
            {
              id: '5',
              name: 'Dr. Lisa Thompson',
              first_name: 'Lisa',
              credentials: 'MD',
              email: 'lisa.thompson@example.com',
              phone: '(555) 567-8901',
              practice_name: 'Thompson Psychiatry',
              specialties: ['Psychiatry', 'Geriatric Psychiatry'],
              service_area: 'Collin County, TX',
              bio: 'Psychiatrist specializing in mental health care for older adults.',
              accepting_new_patients: false,
              telehealth_enabled: true,
              status: 'active',
              profile_image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
              rating: 4.8,
              verified: true,
              slug: 'dr-lisa-thompson'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load facilities and partners',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Filter facilities based on search query, care type, location, and services
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = 
      facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      facility.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCareType = careType === 'all' || facility.care_type === careType;
    
    // Match by state and county
    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = facility.location.includes(selectedState);
      
      if (selectedCounty !== 'all') {
        matchesLocation = facility.location.includes(selectedCounty);
      }
    } else if (location !== 'all') {
      matchesLocation = facility.location.includes(location);
    }
    
    // For demo purposes, we'll assume all facilities match the selected services
    // In a real implementation, you would check if the facility provides the selected services
    const matchesServices = selectedServices.length === 0 || true;
    
    return matchesSearch && matchesCareType && matchesLocation && matchesServices;
  });

  // Filter partners based on search query, location, and services
  const filteredPartners = partners.filter(partner => {
    const matchesSearch = 
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.service_area?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.specialties?.some(specialty => specialty.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Match by state and county
    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = partner.service_area?.includes(selectedState) || false;
      
      if (selectedCounty !== 'all') {
        matchesLocation = partner.service_area?.includes(selectedCounty) || false;
      }
    } else if (location !== 'all') {
      matchesLocation = partner.service_area?.includes(location) || false;
    }
    
    // For demo purposes, we'll assume all partners match the selected services
    // In a real implementation, you would check if the partner provides the selected services
    const matchesServices = selectedServices.length === 0 || true;
    
    return matchesSearch && matchesLocation && matchesServices;
  });

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(current => 
      current.includes(serviceId) 
        ? current.filter(id => id !== serviceId)
        : [...current, serviceId]
    );
  };

  // Handle state change
  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedCounty('all');
  };

  return (
    <MainLayout>
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Care Communities & Healthcare Professionals
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Find the perfect care community or healthcare professional for your loved one with our concierge placement service.
            </p>
          </div>

          {/* View Type Selector */}
          <div className="mb-8">
            <Tabs defaultValue="facilities" onValueChange={(value) => setViewType(value as 'facilities' | 'professionals')}>
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="facilities">Care Facilities</TabsTrigger>
                <TabsTrigger value="professionals">Healthcare Professionals</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder={viewType === 'facilities' ? "Search facilities..." : "Search professionals..."}
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {viewType === 'facilities' && (
                <Select value={careType} onValueChange={setCareType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Care Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Care Types</SelectItem>
                    <SelectItem value="Memory Care">Memory Care</SelectItem>
                    <SelectItem value="Assisted Living">Assisted Living</SelectItem>
                    <SelectItem value="Independent Living">Independent Living</SelectItem>
                    <SelectItem value="Long-Term Care">Long-Term Care</SelectItem>
                    <SelectItem value="Hospice Support">Hospice Support</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {viewType === 'professionals' && (
                <Select value={careType} onValueChange={setCareType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specialties</SelectItem>
                    <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                    <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                    <SelectItem value="Geriatric Medicine">Geriatric Medicine</SelectItem>
                    <SelectItem value="Neurology">Neurology</SelectItem>
                    <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                    <SelectItem value="Cardiology">Cardiology</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showFilters ? 'Hide Filters' : 'More Filters'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowServiceFilters(!showServiceFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showServiceFilters ? 'Hide Services' : 'Services Needed'}
                </Button>
              </div>
            </div>
            
            {showFilters && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
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
              </div>
            )}
            
            {showServiceFilters && (
              <div className="mt-4 p-4 border rounded-md bg-white">
                <h3 className="font-medium mb-3">Services Needed for Patient</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {careServices.map((service) => (
                    <div key={service.id} className="flex items-start space-x-2">
                      <Checkbox 
                        id={service.id} 
                        checked={selectedServices.includes(service.id)}
                        onCheckedChange={() => toggleService(service.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={service.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {service.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {selectedServices.length > 0 && (
                      <span>{selectedServices.length} services selected</span>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedServices([])}
                    disabled={selectedServices.length === 0}
                  >
                    Clear Services
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Concierge Placement Banner */}
          <div className="mb-8 bg-indigo-50 border border-indigo-100 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">Need Help Finding the Perfect {viewType === 'facilities' ? 'Community' : 'Professional'}?</h2>
                <p className="text-indigo-700">
                  Our concierge placement service matches your loved one with the ideal {viewType === 'facilities' ? 'care community' : 'healthcare professional'} based on their unique needs.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-indigo-800">No upfront fee for standard placement</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-indigo-800">Expedited options available for urgent needs</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-indigo-800">Personalized matching with trusted {viewType === 'facilities' ? 'communities' : 'professionals'}</span>
                  </div>
                </div>
              </div>
              <div className="shrink-0">
                <PlacementRequestButton size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Request Placement Assistance
                </PlacementRequestButton>
              </div>
            </div>
          </div>

          {viewType === 'facilities' ? (
            /* Tabs for Featured vs All Facilities */
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="all">All Communities</TabsTrigger>
                <TabsTrigger value="featured">Featured Communities</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading communities...</p>
                  </div>
                ) : filteredFacilities.length > 0 ? (
                  <div className="space-y-8">
                    {filteredFacilities.map((facility) => (
                      <div key={facility.id}>
                        {selectedFacility?.id === facility.id ? (
                          <FacilityDetailCard facility={facility} />
                        ) : (
                          <Card className="overflow-hidden">
                            <div className="md:flex">
                              <div className="md:w-1/3 h-48 md:h-auto">
                                <img 
                                  src={facility.image_url} 
                                  alt={facility.name} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="md:w-2/3 p-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-xl font-semibold">{facility.name}</h3>
                                    <div className="flex items-center text-gray-500 mt-1">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{facility.location}</span>
                                    </div>
                                  </div>
                                  <Badge variant="outline">{facility.care_type}</Badge>
                                </div>
                                
                                <p className="mt-4 text-gray-600 line-clamp-2">{facility.description}</p>
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {facility.amenities?.slice(0, 3).map((amenity, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="mt-6 flex justify-between items-center">
                                  <div>
                                    <span className="font-semibold">{facility.price_range}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                      {facility.spots_available > 0 
                                        ? `${facility.spots_available} spots available` 
                                        : "Currently full"}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setSelectedFacility(facility)}
                                    >
                                      View Details
                                    </Button>
                                    <PlacementRequestButton 
                                      facilityId={facility.id}
                                      facilityName={facility.name}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">No communities found matching your criteria.</p>
                      <Button className="mt-4" onClick={() => {
                        setSearchQuery('');
                        setCareType('all');
                        setLocation('all');
                        setSelectedServices([]);
                        setSelectedState('all');
                        setSelectedCounty('all');
                      }}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="featured" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading featured communities...</p>
                  </div>
                ) : filteredFacilities.filter(f => f.featured).length > 0 ? (
                  <div className="space-y-8">
                    {filteredFacilities
                      .filter(facility => facility.featured)
                      .map((facility) => (
                        <div key={facility.id}>
                          {selectedFacility?.id === facility.id ? (
                            <FacilityDetailCard facility={facility} />
                          ) : (
                            <Card className="overflow-hidden">
                              <div className="md:flex">
                                <div className="md:w-1/3 h-48 md:h-auto">
                                  <img 
                                    src={facility.image_url} 
                                    alt={facility.name} 
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="md:w-2/3 p-6">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-xl font-semibold">{facility.name}</h3>
                                      <div className="flex items-center text-gray-500 mt-1">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{facility.location}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge variant="outline">{facility.care_type}</Badge>
                                      <Badge className="bg-indigo-600">Featured</Badge>
                                    </div>
                                  </div>
                                  
                                  <p className="mt-4 text-gray-600 line-clamp-2">{facility.description}</p>
                                  
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {facility.amenities?.slice(0, 3).map((amenity, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {amenity}
                                      </Badge>
                                    ))}
                                  </div>
                                  
                                  <div className="mt-6 flex justify-between items-center">
                                    <div>
                                      <span className="font-semibold">{facility.price_range}</span>
                                      <span className="text-sm text-gray-500 ml-2">
                                        {facility.spots_available > 0 
                                          ? `${facility.spots_available} spots available` 
                                          : "Currently full"}
                                      </span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        onClick={() => setSelectedFacility(facility)}
                                      >
                                        View Details
                                      </Button>
                                      <PlacementRequestButton 
                                        facilityId={facility.id}
                                        facilityName={facility.name}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">No featured communities found matching your criteria.</p>
                      <Button className="mt-4" onClick={() => {
                        setSearchQuery('');
                        setCareType('all');
                        setLocation('all');
                        setSelectedServices([]);
                        setSelectedState('all');
                        setSelectedCounty('all');
                      }}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            /* Professionals View */
            <Tabs defaultValue="all" className="mb-8">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="all">All Professionals</TabsTrigger>
                <TabsTrigger value="verified">Verified Professionals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading healthcare professionals...</p>
                  </div>
                ) : filteredPartners.length > 0 ? (
                  <div className="space-y-8">
                    {filteredPartners.map((partner) => (
                      <div key={partner.id}>
                        {selectedPartner?.id === partner.id ? (
                          <PartnerDetailCard partner={partner} />
                        ) : (
                          <Card className="overflow-hidden">
                            <div className="md:flex">
                              <div className="md:w-1/4 h-48 md:h-auto flex items-center justify-center p-4">
                                {partner.profile_image ? (
                                  <img 
                                    src={partner.profile_image} 
                                    alt={partner.name} 
                                    className="h-32 w-32 object-cover rounded-full"
                                  />
                                ) : (
                                  <div className="h-32 w-32 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <User className="h-16 w-16 text-indigo-600" />
                                  </div>
                                )}
                              </div>
                              <div className="md:w-3/4 p-6">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="text-xl font-semibold">{partner.name}</h3>
                                    <div className="flex items-center text-gray-500 mt-1">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{partner.service_area || 'Service area not specified'}</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    {partner.verified && (
                                      <Badge className="bg-green-600">Verified</Badge>
                                    )}
                                    {partner.telehealth_enabled && (
                                      <Badge variant="outline">Telehealth</Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="mt-4 text-gray-600 line-clamp-2">{partner.bio}</p>
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                  {partner.specialties?.slice(0, 3).map((specialty, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {specialty}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <div className="mt-6 flex justify-between items-center">
                                  <div>
                                    {partner.rating && (
                                      <div className="flex items-center">
                                        <span className="font-semibold">{partner.rating}</span>
                                        <span className="text-yellow-500 ml-1">★</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                          {partner.accepting_new_patients 
                                            ? "Accepting new patients" 
                                            : "Not accepting new patients"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      onClick={() => setSelectedPartner(partner)}
                                    >
                                      View Details
                                    </Button>
                                    <PlacementRequestButton 
                                      facilityId={partner.id}
                                      facilityName={partner.name}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">No healthcare professionals found matching your criteria.</p>
                      <Button className="mt-4" onClick={() => {
                        setSearchQuery('');
                        setCareType('all');
                        setLocation('all');
                        setSelectedServices([]);
                        setSelectedState('all');
                        setSelectedCounty('all');
                      }}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="verified" className="mt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading verified professionals...</p>
                  </div>
                ) : filteredPartners.filter(p => p.verified).length > 0 ? (
                  <div className="space-y-8">
                    {filteredPartners
                      .filter(partner => partner.verified)
                      .map((partner) => (
                        <div key={partner.id}>
                          {selectedPartner?.id === partner.id ? (
                            <PartnerDetailCard partner={partner} />
                          ) : (
                            <Card className="overflow-hidden">
                              <div className="md:flex">
                                <div className="md:w-1/4 h-48 md:h-auto flex items-center justify-center p-4">
                                  {partner.profile_image ? (
                                    <img 
                                      src={partner.profile_image} 
                                      alt={partner.name} 
                                      className="h-32 w-32 object-cover rounded-full"
                                    />
                                  ) : (
                                    <div className="h-32 w-32 bg-indigo-100 rounded-full flex items-center justify-center">
                                      <User className="h-16 w-16 text-indigo-600" />
                                    </div>
                                  )}
                                </div>
                                <div className="md:w-3/4 p-6">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-xl font-semibold">{partner.name}</h3>
                                      <div className="flex items-center text-gray-500 mt-1">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        <span>{partner.service_area || 'Service area not specified'}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Badge className="bg-green-600">Verified</Badge>
                                      {partner.telehealth_enabled && (
                                        <Badge variant="outline">Telehealth</Badge>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <p className="mt-4 text-gray-600 line-clamp-2">{partner.bio}</p>
                                  
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {partner.specialties?.slice(0, 3).map((specialty, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {specialty}
                                      </Badge>
                                    ))}
                                  </div>
                                  
                                  <div className="mt-6 flex justify-between items-center">
                                    <div>
                                      {partner.rating && (
                                        <div className="flex items-center">
                                          <span className="font-semibold">{partner.rating}</span>
                                          <span className="text-yellow-500 ml-1">★</span>
                                          <span className="text-sm text-gray-500 ml-2">
                                            {partner.accepting_new_patients 
                                              ? "Accepting new patients" 
                                              : "Not accepting new patients"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="outline" 
                                        onClick={() => setSelectedPartner(partner)}
                                      >
                                        View Details
                                      </Button>
                                      <PlacementRequestButton 
                                        facilityId={partner.id}
                                        facilityName={partner.name}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-gray-600">No verified professionals found matching your criteria.</p>
                      <Button className="mt-4" onClick={() => {
                        setSearchQuery('');
                        setCareType('all');
                        setLocation('all');
                        setSelectedServices([]);
                        setSelectedState('all');
                        setSelectedCounty('all');
                      }}>
                        Clear Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* How Our Placement Works */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">How Our Placement Service Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Unlike traditional agencies, Vitalé offers families concierge placement options with the power of perks, speed, and advocacy. We only work with trusted {viewType === 'facilities' ? 'homes' : 'professionals'} and ensure you get the best care—and we get paid only when we've earned it.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Tell Us Your Needs</h3>
                <p className="text-gray-600">
                  Share your loved one's care requirements, preferences, and any special considerations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">We Match & Advocate</h3>
                <p className="text-gray-600">
                  Our team matches your needs with trusted {viewType === 'facilities' ? 'communities' : 'professionals'} and advocates for the best possible care and pricing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Seamless Transition</h3>
                <p className="text-gray-600">
                  We coordinate {viewType === 'facilities' ? 'tours' : 'appointments'}, handle paperwork, and ensure a smooth transition to the selected {viewType === 'facilities' ? 'community' : 'care provider'}.
                </p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <PlacementRequestButton size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                Start Your Placement Journey
              </PlacementRequestButton>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How does your placement fee work?</h3>
                <p className="text-gray-600">
                  Our standard placement service has no upfront fee for families. We're paid by the {viewType === 'facilities' ? 'community' : 'professional'} after a successful placement. For expedited service, a $497 concierge deposit unlocks priority matching and additional benefits.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How long does the placement process take?</h3>
                <p className="text-gray-600">
                  Standard placements typically take 72-96 hours from initial request to {viewType === 'facilities' ? 'community' : 'professional'} recommendations. Our expedited concierge service provides matches within 24-48 hours for urgent situations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What areas do you serve?</h3>
                <p className="text-gray-600">
                  We currently provide placement services throughout California and Texas, with a focus on major metropolitan areas and surrounding counties.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What types of {viewType === 'facilities' ? 'facilities' : 'professionals'} do you work with?</h3>
                <p className="text-gray-600">
                  {viewType === 'facilities' 
                    ? 'We partner with a wide range of senior living options, including memory care, assisted living, independent living, skilled nursing communities, and hospice care providers.'
                    : 'We work with a variety of healthcare professionals, including primary care physicians, geriatricians, neurologists, psychiatrists, and other specialists who focus on elder care.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Placements;