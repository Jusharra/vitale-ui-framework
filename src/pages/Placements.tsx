import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FacilityDetailCard from '@/components/placement/FacilityDetailCard';
import PlacementRequestButton from '@/components/placement/PlacementRequestButton';

// Mock data for facilities
const mockFacilities = [
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
];

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
  const [facilities, setFacilities] = useState(mockFacilities);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showServiceFilters, setShowServiceFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const { toast } = useToast();

  // Fetch facilities from database (in a real implementation)
  useEffect(() => {
    const fetchFacilities = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, this would fetch from the database
        // For now, we'll use the mock data
        setFacilities(mockFacilities);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load facilities',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
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
              Assisted Living & Care Communities
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Find the perfect care community for your loved one with our concierge placement service.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search facilities..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
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
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">Need Help Finding the Perfect Community?</h2>
                <p className="text-indigo-700">
                  Our concierge placement service matches your loved one with the ideal care facility based on their unique needs.
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
                    <span className="text-indigo-800">Personalized matching with trusted facilities</span>
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

          {/* Tabs for Featured vs All Facilities */}
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="all">All Facilities</TabsTrigger>
              <TabsTrigger value="featured">Featured Facilities</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading facilities...</p>
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
                    <p className="text-gray-600">No facilities found matching your criteria.</p>
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
                  <p className="mt-4 text-gray-600">Loading featured facilities...</p>
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
                    <p className="text-gray-600">No featured facilities found matching your criteria.</p>
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

          {/* How Our Placement Works */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">How Our Placement Service Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Unlike traditional agencies, Vitale offers families concierge placement options with the power of perks, speed, and advocacy. We only work with trusted homes and ensure you get the best care—and we get paid only when we've earned it.
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
                  Our team matches your needs with trusted facilities and advocates for the best possible care and pricing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Seamless Transition</h3>
                <p className="text-gray-600">
                  We coordinate tours, handle paperwork, and ensure a smooth transition to the selected facility.
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
                  Our standard placement service has no upfront fee for families. We're paid by the facility after a successful placement. For expedited service, a $497 concierge deposit unlocks priority matching and additional benefits.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How long does the placement process take?</h3>
                <p className="text-gray-600">
                  Standard placements typically take 72-96 hours from initial request to facility recommendations. Our expedited concierge service provides matches within 24-48 hours for urgent situations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What areas do you serve?</h3>
                <p className="text-gray-600">
                  We currently provide placement services throughout California and Texas, with a focus on major metropolitan areas and surrounding counties.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What types of facilities do you work with?</h3>
                <p className="text-gray-600">
                  We partner with a wide range of senior living options including memory care, assisted living, independent living, skilled nursing facilities, and hospice care providers.
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