
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Search, SlidersHorizontal } from 'lucide-react';
import VacationCard from './VacationCard';
import VacationDetailsModal from './VacationDetailsModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from '@/components/ui/badge';

type VacationPackage = {
  id: string;
  destination_name: string;
  region: string;
  description_short: string;
  description_full: string | null;
  price: number;
  duration: string | null;
  package_type: string;
  image_url: string | null;
  amenities: string[];
  available_dates: {
    start_date: string | null;
    end_date: string | null;
  };
  status: string;
  featured: boolean;
};

type FilterState = {
  searchText: string;
  maxPrice: number;
  selectedRegions: string[];
  activePackageType: string;
}

const VacationsContent = () => {
  const [selectedVacation, setSelectedVacation] = useState<VacationPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    maxPrice: 10000,
    selectedRegions: [],
    activePackageType: 'all'
  });

  // Fetch vacation packages from Supabase
  const { data: vacationPackages, isLoading, error } = useQuery({
    queryKey: ['vacationPackages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vacation_packages')
        .select('*')
        .eq('status', 'Active')
        .order('featured', { ascending: false });
      
      if (error) throw error;
      
      // Convert the data to match our expected type
      return (data || []).map(pkg => ({
        ...pkg,
        // Safely parse available_dates which might be a string or already an object
        available_dates: typeof pkg.available_dates === 'string' 
          ? JSON.parse(pkg.available_dates)
          : (pkg.available_dates || { start_date: null, end_date: null })
      })) as VacationPackage[];
    },
  });

  // Handle opening the details modal
  const handleOpenDetails = (vacation: VacationPackage) => {
    setSelectedVacation(vacation);
    setIsModalOpen(true);
  };

  // Filter packages based on all filters
  const filteredPackages = vacationPackages?.filter(pkg => {
    const matchesText = pkg.destination_name.toLowerCase().includes(filters.searchText.toLowerCase()) || 
                        pkg.description_short.toLowerCase().includes(filters.searchText.toLowerCase()) ||
                        pkg.region.toLowerCase().includes(filters.searchText.toLowerCase());
    
    const matchesPrice = pkg.price <= filters.maxPrice;
    
    const matchesRegion = filters.selectedRegions.length === 0 || filters.selectedRegions.includes(pkg.region);
    
    const matchesType = filters.activePackageType === 'all' || pkg.package_type.toLowerCase() === filters.activePackageType;
    
    return matchesText && matchesPrice && matchesRegion && matchesType;
  });

  // Get unique regions and max price for filters
  const allRegions = Array.from(new Set(vacationPackages?.map(pkg => pkg.region) || []));
  const maxPossiblePrice = Math.max(...(vacationPackages?.map(pkg => pkg.price) || [10000]));
  
  // Featured packages for the carousel
  const featuredPackages = vacationPackages?.filter(pkg => pkg.featured) || [];

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchText: e.target.value }));
  };

  // Handle price filter change
  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, maxPrice: value[0] }));
  };

  // Handle region filter change
  const handleRegionChange = (region: string) => {
    setFilters(prev => {
      if (prev.selectedRegions.includes(region)) {
        return { ...prev, selectedRegions: prev.selectedRegions.filter(r => r !== region) };
      } else {
        return { ...prev, selectedRegions: [...prev.selectedRegions, region] };
      }
    });
  };

  const handleTabChange = (value: string) => {
    setFilters(prev => ({ ...prev, activePackageType: value }));
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          There was an error loading vacation packages. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner with Search */}
      <div className="relative w-full h-64 bg-cover bg-center rounded-lg overflow-hidden mb-8"
           style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url("/placeholder.svg")' }}>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
          <h1 className="text-3xl font-bold mb-4">Discover Exclusive Getaways</h1>
          <p className="text-lg mb-6 text-center max-w-2xl">Explore our curated vacation packages with special member pricing</p>
          
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search destinations, experiences..." 
              className="pl-10 bg-white/90 text-black" 
              value={filters.searchText}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Featured Packages Carousel */}
      {!isLoading && featuredPackages.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Featured Experiences</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {featuredPackages.map((vacation) => (
                <CarouselItem key={vacation.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <VacationCard 
                      vacation={vacation} 
                      onViewDetails={() => handleOpenDetails(vacation)}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      )}

      {/* Filters and Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <Tabs 
          defaultValue="all" 
          value={filters.activePackageType}
          onValueChange={handleTabChange} 
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="beach">Beach</TabsTrigger>
            <TabsTrigger value="mountain">Mountain</TabsTrigger>
            <TabsTrigger value="city">City</TabsTrigger>
            <TabsTrigger value="cruise">Cruise</TabsTrigger>
            <TabsTrigger value="adventure">Adventure</TabsTrigger>
          </TabsList>
        </Tabs>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {(filters.selectedRegions.length > 0 || filters.maxPrice < maxPossiblePrice) && (
                <Badge variant="secondary" className="ml-1">{filters.selectedRegions.length + (filters.maxPrice < maxPossiblePrice ? 1 : 0)}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="px-2">
                  <Slider 
                    defaultValue={[filters.maxPrice]} 
                    max={maxPossiblePrice} 
                    step={100} 
                    onValueChange={handlePriceChange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>$0</span>
                    <span>Max: ${filters.maxPrice}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Regions</h4>
                <div className="flex flex-wrap gap-2">
                  {allRegions.map(region => (
                    <Badge 
                      key={region}
                      variant={filters.selectedRegions.includes(region) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleRegionChange(region)}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vacation Listings */}
      {!isLoading && filteredPackages && filteredPackages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((vacation) => (
            <VacationCard 
              key={vacation.id} 
              vacation={vacation} 
              onViewDetails={() => handleOpenDetails(vacation)}
            />
          ))}
        </div>
      ) : !isLoading ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No vacation packages found for your selected filters.</p>
          <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or check back later.</p>
        </div>
      ) : null}

      {/* Details Modal */}
      {selectedVacation && (
        <VacationDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vacation={selectedVacation}
        />
      )}
    </div>
  );
};

export default VacationsContent;
