import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VacationCard from './VacationCard';
import VacationDetailsModal from './VacationDetailsModal';
import { Loader2, Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

// Define the VacationPackage interface
interface VacationPackage {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  destination: string;
  package_type: string;
  image_url: string;
  amenities: string[];
  region: string;
  featured?: boolean;
}

// The rest of the component implementation
const VacationsContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [packageTypeFilter, setPackageTypeFilter] = useState<string | null>(null);
  const [destinationFilter, setDestinationFilter] = useState<string | null>(null);
  const [priceRangeFilter, setPriceRangeFilter] = useState<string | null>(null);
  const [amenitiesFilter, setAmenitiesFilter] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fix the vacation type to ensure it matches the expected interface
  const [selectedVacation, setSelectedVacation] = useState<VacationPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vacations, setVacations] = useState<VacationPackage[]>([]);
  const [filteredVacations, setFilteredVacations] = useState<VacationPackage[]>([]);

  // Function to fetch vacations
  const fetchVacations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*');

      if (error) {
        throw error;
      }

      // Make sure we transform the data to match the expected interface
      const transformedVacations = data.map((vacation: any) => ({
        id: vacation.id,
        title: vacation.destination_name || 'Untitled Vacation',
        description: vacation.description_short || 'No description available',
        price: vacation.price || 0,
        duration: vacation.duration || '7 days',
        destination: vacation.destination_name || 'Unknown',
        package_type: vacation.package_type || 'Standard',
        image_url: vacation.image_url || '/placeholder.svg',
        amenities: vacation.amenities || [],
        region: vacation.region || 'Unknown',
        featured: vacation.featured || false
      })) as VacationPackage[];

      setVacations(transformedVacations);
      applyFilters(transformedVacations);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle viewing vacation details
  const handleViewDetails = (vacation: VacationPackage) => {
    setSelectedVacation(vacation);
    setIsModalOpen(true);
  };

  // Function to apply filters
  const applyFilters = (vacationsToFilter: VacationPackage[]) => {
    let filtered = vacationsToFilter;

    if (searchTerm) {
      filtered = filtered.filter(vacation =>
        vacation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacation.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (packageTypeFilter) {
      filtered = filtered.filter(vacation => vacation.package_type === packageTypeFilter);
    }

    if (destinationFilter) {
      filtered = filtered.filter(vacation => vacation.destination === destinationFilter);
    }

    if (priceRangeFilter) {
      const [minPrice, maxPrice] = priceRangeFilter.split('-').map(Number);
      filtered = filtered.filter(vacation => vacation.price >= minPrice && vacation.price <= maxPrice);
    }

    if (amenitiesFilter.length > 0) {
      filtered = filtered.filter(vacation =>
        amenitiesFilter.every(amenity => vacation.amenities.includes(amenity))
      );
    }

    setFilteredVacations(filtered);
  };

  useEffect(() => {
    fetchVacations();
  }, []);

  useEffect(() => {
    applyFilters(vacations);
  }, [searchTerm, packageTypeFilter, destinationFilter, priceRangeFilter, amenitiesFilter, vacations]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-4">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading vacations...
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Search vacations..."
            className="mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {showFilters && (
        <Card className="mb-4">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Select onValueChange={(value) => setPackageTypeFilter(value === 'all' ? null : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Package Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="romantic">Romantic</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select onValueChange={(value) => setDestinationFilter(value === 'all' ? null : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Destinations</SelectItem>
                    <SelectItem value="Paris">Paris</SelectItem>
                    <SelectItem value="Rome">Rome</SelectItem>
                    <SelectItem value="Tokyo">Tokyo</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select onValueChange={(value) => setPriceRangeFilter(value === 'all' ? null : value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-500">$0 - $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1000</SelectItem>
                    <SelectItem value="1000-2000">$1000 - $2000</SelectItem>
                    <SelectItem value="2000-5000">$2000 - $5000</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <p className="font-semibold mb-2">Amenities:</p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pool"
                    checked={amenitiesFilter.includes('pool')}
                    onCheckedChange={(checked) =>
                      setAmenitiesFilter(checked ? [...amenitiesFilter, 'pool'] : amenitiesFilter.filter(item => item !== 'pool'))
                    }
                  />
                  <Label htmlFor="pool">Pool</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wifi"
                    checked={amenitiesFilter.includes('wifi')}
                    onCheckedChange={(checked) =>
                      setAmenitiesFilter(checked ? [...amenitiesFilter, 'wifi'] : amenitiesFilter.filter(item => item !== 'wifi'))
                    }
                  />
                  <Label htmlFor="wifi">WiFi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="spa"
                    checked={amenitiesFilter.includes('spa')}
                    onCheckedChange={(checked) =>
                      setAmenitiesFilter(checked ? [...amenitiesFilter, 'spa'] : amenitiesFilter.filter(item => item !== 'spa'))
                    }
                  />
                  <Label htmlFor="spa">Spa</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVacations.map((vacation) => (
          <VacationCard
            key={vacation.id}
            vacation={vacation}
            onViewDetails={() => handleViewDetails(vacation)}
          />
        ))}
      </div>

      <VacationDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vacation={selectedVacation}
      />
    </div>
  );
};

export default VacationsContent;
