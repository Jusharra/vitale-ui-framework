import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Filter, CheckCircle, User, Home, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FacilityDetailCard from '@/components/placement/FacilityDetailCard';
import PlacementRequestButton from '@/components/placement/PlacementRequestButton';
import ProfessionalCard from '@/components/placement/ProfessionalCard';
import ProfessionalDetailCard from '@/components/placement/ProfessionalDetailCard';

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

// Define the Professional interface
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

// Budget ranges for facilities
const facilityBudgetRanges = [
  { id: 'budget-1', label: 'Under $3,000/month', min: 0, max: 3000 },
  { id: 'budget-2', label: '$3,000 - $5,000/month', min: 3000, max: 5000 },
  { id: 'budget-3', label: '$5,000 - $7,000/month', min: 5000, max: 7000 },
  { id: 'budget-4', label: '$7,000 - $10,000/month', min: 7000, max: 10000 },
  { id: 'budget-5', label: 'Over $10,000/month', min: 10000, max: 100000 }
];

// Budget ranges for professionals
const professionalBudgetRanges = [
  { id: 'rate-1', label: 'Under $50/hour', min: 0, max: 50 },
  { id: 'rate-2', label: '$50 - $100/hour', min: 50, max: 100 },
  { id: 'rate-3', label: '$100 - $150/hour', min: 100, max: 150 },
  { id: 'rate-4', label: '$150 - $200/hour', min: 150, max: 200 },
  { id: 'rate-5', label: 'Over $200/hour', min: 200, max: 1000 }
];

// Helper function to extract numeric price from string
const extractNumericPrice = (priceString: string): number => {
  if (!priceString) return 0;
  const matches = priceString.match(/\$?([\d,]+)/);
  if (matches && matches[1]) {
    return parseInt(matches[1].replace(/,/g, ''), 10);
  }
  return 0;
};

const Placements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [careType, setCareType] = useState<string>('all');
  const [location, setLocation] = useState<string>('all');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showServiceFilters, setShowServiceFilters] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [contentType, setContentType] = useState<'facilities' | 'professionals'>('facilities');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<string>('all');
  const [customBudgetRange, setCustomBudgetRange] = useState<[number, number]>([0, 10000]);
  const [useCustomBudget, setUseCustomBudget] = useState(false);
  const { toast } = useToast();

  // Fetch facilities and professionals from database
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
        
        if (facilitiesError) {
          console.error('Error fetching facilities:', facilitiesError);
          toast({
            title: 'Error',
            description: 'Failed to load facilities',
            variant: 'destructive',
          });
        } else {
          setFacilities(facilitiesData || []);
        }
        
        // Fetch active professionals from the database
        const { data: professionalsData, error: professionalsError } = await supabase
          .from('partners')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });
        
        if (professionalsError) {
          console.error('Error fetching professionals:', professionalsError);
          toast({
            title: 'Error',
            description: 'Failed to load healthcare professionals',
            variant: 'destructive',
          });
        } else {
          console.log('Fetched professionals:', professionalsData);
          setProfessionals(professionalsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load placement options',
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
      (facility.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
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
    
    // Budget filtering
    let matchesBudget = true;
    if (useCustomBudget) {
      // Use custom budget range slider values
      const facilityPrice = extractNumericPrice(facility.price_range);
      matchesBudget = facilityPrice >= customBudgetRange[0] && facilityPrice <= customBudgetRange[1];
    } else if (selectedBudgetRange !== 'all') {
      // Use predefined budget ranges
      const selectedRange = facilityBudgetRanges.find(range => range.id === selectedBudgetRange);
      if (selectedRange) {
        const facilityPrice = extractNumericPrice(facility.price_range);
        matchesBudget = facilityPrice >= selectedRange.min && facilityPrice <= selectedRange.max;
      }
    }
    
    // For demo purposes, we'll assume all facilities match the selected services
    // In a real implementation, you would check if the facility provides the selected services
    const matchesServices = selectedServices.length === 0 || true;
    
    return matchesSearch && matchesCareType && matchesLocation && matchesServices && matchesBudget;
  });

  // Filter professionals based on search query, specialties, and location
  const filteredProfessionals = professionals.filter(professional => {
    if (!professional) return false;
    
    // Safely check if properties exist before using toLowerCase
    const nameMatch = professional.name ? 
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
    const bioMatch = professional.bio ? 
      professional.bio.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
    const serviceAreaMatch = professional.service_area ? 
      professional.service_area.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    
    const specialtiesMatch = professional.specialties && Array.isArray(professional.specialties) ? 
      professional.specialties.some(specialty => 
        specialty && specialty.toLowerCase().includes(searchQuery.toLowerCase())
      ) : false;
    
    const matchesSearch = nameMatch || bioMatch || serviceAreaMatch || specialtiesMatch;
    
    // Match by specialty (using careType as specialty filter)
    const matchesSpecialty = careType === 'all' || 
      (professional.specialties && Array.isArray(professional.specialties) ? 
        professional.specialties.some(specialty => 
          specialty && specialty.toLowerCase().includes(careType.toLowerCase())
        ) : false);
    
    // Match by state and county
    let matchesLocation = true;
    if (selectedState !== 'all') {
      matchesLocation = professional.service_area ? 
        professional.service_area.includes(selectedState) : false;
      
      if (selectedCounty !== 'all') {
        matchesLocation = professional.service_area ? 
          professional.service_area.includes(selectedCounty) : false;
      }
    } else if (location !== 'all') {
      matchesLocation = professional.service_area ? 
        professional.service_area.includes(location) : false;
    }
    
    // Budget filtering for professionals
    let matchesBudget = true;
    if (useCustomBudget) {
      // Use custom budget range slider values
      const hourlyRate = extractNumericPrice(professional.hourly_rate || '');
      matchesBudget = hourlyRate >= customBudgetRange[0] && hourlyRate <= customBudgetRange[1];
    } else if (selectedBudgetRange !== 'all') {
      // Use predefined budget ranges
      const selectedRange = professionalBudgetRanges.find(range => range.id === selectedBudgetRange);
      if (selectedRange) {
        const hourlyRate = extractNumericPrice(professional.hourly_rate || '');
        matchesBudget = hourlyRate >= selectedRange.min && hourlyRate <= selectedRange.max;
      }
    }
    
    // For demo purposes, we'll assume all professionals match the selected services
    const matchesServices = selectedServices.length === 0 || true;
    
    return matchesSearch && matchesSpecialty && matchesLocation && matchesServices && matchesBudget;
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

  // Handle budget range change
  const handleBudgetRangeChange = (value: string) => {
    setSelectedBudgetRange(value);
    setUseCustomBudget(false);
  };

  // Handle custom budget slider change
  const handleCustomBudgetChange = (values: number[]) => {
    setCustomBudgetRange([values[0], values[1]]);
    setUseCustomBudget(true);
    setSelectedBudgetRange('all');
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="bg-white py-12" id="placements-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Care Communities & Healthcare Professionals
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Find the perfect care solution for your loved one with our concierge placement service.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={careType} onValueChange={setCareType}>
                <SelectTrigger>
                  <SelectValue placeholder={contentType === 'facilities' ? "Care Type" : "Specialty"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {contentType === 'facilities' ? "Care Types" : "Specialties"}</SelectItem>
                  {contentType === 'facilities' ? (
                    <>
                      <SelectItem value="Memory Care">Memory Care</SelectItem>
                      <SelectItem value="Assisted Living">Assisted Living</SelectItem>
                      <SelectItem value="Independent Living">Independent Living</SelectItem>
                      <SelectItem value="Long-Term Care">Long-Term Care</SelectItem>
                      <SelectItem value="Hospice Support">Hospice Support</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Family Medicine">Family Medicine</SelectItem>
                      <SelectItem value="Internal Medicine">Internal Medicine</SelectItem>
                      <SelectItem value="Geriatric Care">Geriatric Care</SelectItem>
                      <SelectItem value="Primary Care">Primary Care</SelectItem>
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
              <div className="mt-4 space-y-4 border-t pt-4">
                <h3 className="font-medium text-lg mb-2">Advanced Filters</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Location</Label>
                    <div className="grid grid-cols-1 gap-4">
                      <Select value={selectedState} onValueChange={handleStateChange}>
                        <SelectTrigger className="w-full">
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
                        <SelectTrigger className="w-full">
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
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Budget</Label>
                    <div className="space-y-4">
                      <Select 
                        value={selectedBudgetRange} 
                        onValueChange={handleBudgetRangeChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Budget Range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Price Ranges</SelectItem>
                          {contentType === 'facilities' ? (
                            facilityBudgetRanges.map(range => (
                              <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>
                            ))
                          ) : (
                            professionalBudgetRanges.map(range => (
                              <SelectItem key={range.id} value={range.id}>{range.label}</SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label>Custom Budget Range</Label>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(customBudgetRange[0])} - {formatCurrency(customBudgetRange[1])}
                            {contentType === 'facilities' ? '/month' : '/hour'}
                          </div>
                        </div>
                        <Slider
                          defaultValue={[0, 10000]}
                          max={contentType === 'facilities' ? 15000 : 500}
                          step={contentType === 'facilities' ? 500 : 25}
                          value={customBudgetRange}
                          onValueChange={handleCustomBudgetChange}
                          className="my-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
            
            {/* Active Filters Display */}
            {(selectedState !== 'all' || selectedCounty !== 'all' || selectedBudgetRange !== 'all' || useCustomBudget || selectedServices.length > 0) && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selectedState !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedState}
                    <button 
                      className="ml-1 hover:bg-muted rounded-full"
                      onClick={() => {
                        setSelectedState('all');
                        setSelectedCounty('all');
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {selectedCounty !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {selectedCounty}
                    <button 
                      className="ml-1 hover:bg-muted rounded-full"
                      onClick={() => setSelectedCounty('all')}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {selectedBudgetRange !== 'all' && !useCustomBudget && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {contentType === 'facilities' 
                      ? facilityBudgetRanges.find(r => r.id === selectedBudgetRange)?.label 
                      : professionalBudgetRanges.find(r => r.id === selectedBudgetRange)?.label}
                    <button 
                      className="ml-1 hover:bg-muted rounded-full"
                      onClick={() => setSelectedBudgetRange('all')}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {useCustomBudget && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(customBudgetRange[0])} - {formatCurrency(customBudgetRange[1])}
                    {contentType === 'facilities' ? '/month' : '/hour'}
                    <button 
                      className="ml-1 hover:bg-muted rounded-full"
                      onClick={() => {
                        setUseCustomBudget(false);
                        setCustomBudgetRange([0, contentType === 'facilities' ? 10000 : 500]);
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                {selectedServices.length > 0 && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {selectedServices.length} services
                    <button 
                      className="ml-1 hover:bg-muted rounded-full"
                      onClick={() => setSelectedServices([])}
                    >
                      ×
                    </button>
                  </Badge>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery('');
                    setCareType('all');
                    setLocation('all');
                    setSelectedServices([]);
                    setSelectedState('all');
                    setSelectedCounty('all');
                    setSelectedBudgetRange('all');
                    setUseCustomBudget(false);
                    setCustomBudgetRange([0, contentType === 'facilities' ? 10000 : 500]);
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>

          {/* Concierge Placement Banner */}
          <div className="mb-8 bg-indigo-50 border border-indigo-100 p-6 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-indigo-900 mb-2">Need Help Finding the Perfect Care Solution?</h2>
                <p className="text-indigo-700">
                  Our concierge placement service matches your loved one with the ideal care provider based on their unique needs.
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
                    <span className="text-indigo-800">Personalized matching with trusted providers</span>
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

          {/* Tabs for content type selection */}
          <Tabs defaultValue="facilities" className="mb-8" onValueChange={(value) => {
            setContentType(value as 'facilities' | 'professionals');
            setSelectedFacility(null);
            setSelectedProfessional(null);
            // Reset budget range when switching content type
            setSelectedBudgetRange('all');
            setUseCustomBudget(false);
            setCustomBudgetRange([0, value === 'facilities' ? 10000 : 500]);
          }}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="facilities" className="flex gap-2 items-center">
                <Home className="h-4 w-4" />
                <span>Care Facilities</span>
              </TabsTrigger>
              <TabsTrigger value="professionals" className="flex gap-2 items-center">
                <User className="h-4 w-4" />
                <span>Healthcare Professionals</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Facilities Tab */}
            <TabsContent value="facilities" className="mt-6">
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
                                    src={facility.image_url || "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg"} 
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
                          setSelectedBudgetRange('all');
                          setUseCustomBudget(false);
                          setCustomBudgetRange([0, 10000]);
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
                                      src={facility.image_url || "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg"} 
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
                          setSelectedBudgetRange('all');
                          setUseCustomBudget(false);
                          setCustomBudgetRange([0, 10000]);
                        }}>
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Professionals Tab */}
            <TabsContent value="professionals" className="mt-6">
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
                  ) : filteredProfessionals.length > 0 ? (
                    <div className="space-y-8">
                      {filteredProfessionals.map((professional) => (
                        <div key={professional.id}>
                          {selectedProfessional?.id === professional.id ? (
                            <ProfessionalDetailCard professional={professional} />
                          ) : (
                            <ProfessionalCard 
                              professional={professional} 
                              onViewDetails={() => setSelectedProfessional(professional)} 
                            />
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
                          setSelectedBudgetRange('all');
                          setUseCustomBudget(false);
                          setCustomBudgetRange([0, 500]);
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
                  ) : filteredProfessionals.filter(p => p.verified).length > 0 ? (
                    <div className="space-y-8">
                      {filteredProfessionals
                        .filter(professional => professional.verified)
                        .map((professional) => (
                          <div key={professional.id}>
                            {selectedProfessional?.id === professional.id ? (
                              <ProfessionalDetailCard professional={professional} />
                            ) : (
                              <ProfessionalCard 
                                professional={professional} 
                                onViewDetails={() => setSelectedProfessional(professional)} 
                              />
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
                          setSelectedBudgetRange('all');
                          setUseCustomBudget(false);
                          setCustomBudgetRange([0, 500]);
                        }}>
                          Clear Filters
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>

          {/* How Our Placement Works */}
          <div className="mt-16 bg-gray-50 rounded-lg p-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">How Our Placement Service Works</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                Unlike traditional agencies, Vitalé offers families concierge placement options with the power of perks, speed, and advocacy. We only work with trusted providers and ensure you get the best care—and we get paid only when we've earned it.
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
                  Our team matches your needs with trusted providers and advocates for the best possible care and pricing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-3 mt-2">Seamless Transition</h3>
                <p className="text-gray-600">
                  We coordinate appointments, handle paperwork, and ensure a smooth transition to the selected provider.
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
                  Our standard placement service has no upfront fee for families. We're paid by the provider after a successful placement. For expedited service, a $497 concierge deposit unlocks priority matching and additional benefits.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">How long does the placement process take?</h3>
                <p className="text-gray-600">
                  Standard placements typically take 72-96 hours from initial request to provider recommendations. Our expedited concierge service provides matches within 24-48 hours for urgent situations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What areas do you serve?</h3>
                <p className="text-gray-600">
                  We currently provide placement services throughout California and Texas, with a focus on major metropolitan areas and surrounding counties.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-2">What types of providers do you work with?</h3>
                <p className="text-gray-600">
                  We partner with a wide range of care options, including memory care, assisted living, independent living, skilled nursing communities, hospice care providers, and healthcare professionals.
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