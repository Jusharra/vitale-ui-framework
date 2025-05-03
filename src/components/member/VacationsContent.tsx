
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import VacationCard from './VacationCard';
import VacationDetailsModal from './VacationDetailsModal';

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

const VacationsContent = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVacation, setSelectedVacation] = useState<VacationPackage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      return (data as any[]).map(pkg => ({
        ...pkg,
        // Safely parse available_dates which might be a string or already an object
        available_dates: typeof pkg.available_dates === 'string' 
          ? JSON.parse(pkg.available_dates)
          : pkg.available_dates
      })) as VacationPackage[];
    },
  });

  // Handle opening the details modal
  const handleOpenDetails = (vacation: VacationPackage) => {
    setSelectedVacation(vacation);
    setIsModalOpen(true);
  };

  // Filter packages based on active tab
  const filteredPackages = vacationPackages?.filter(pkg => {
    if (activeTab === 'all') return true;
    return pkg.package_type.toLowerCase() === activeTab;
  });

  // Group packages by region for better organization
  const packagesByRegion = filteredPackages?.reduce<Record<string, VacationPackage[]>>((acc, pkg) => {
    if (!acc[pkg.region]) {
      acc[pkg.region] = [];
    }
    acc[pkg.region].push(pkg);
    return acc;
  }, {});

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
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Packages</TabsTrigger>
          <TabsTrigger value="beach">Beach</TabsTrigger>
          <TabsTrigger value="mountain">Mountain</TabsTrigger>
          <TabsTrigger value="city">City</TabsTrigger>
          <TabsTrigger value="cruise">Cruise</TabsTrigger>
          <TabsTrigger value="adventure">Adventure</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
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
      ) : packagesByRegion && Object.keys(packagesByRegion).length > 0 ? (
        <>
          {Object.entries(packagesByRegion).map(([region, packages]) => (
            <div key={region} className="space-y-4">
              <h2 className="text-2xl font-semibold tracking-tight">{region}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.map((vacation) => (
                  <VacationCard 
                    key={vacation.id} 
                    vacation={vacation} 
                    onViewDetails={() => handleOpenDetails(vacation)}
                  />
                ))}
              </div>
            </div>
          ))
          }
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No vacation packages found for your selected category.</p>
          <p className="text-sm text-muted-foreground mt-2">Try selecting a different category or check back later.</p>
        </div>
      )}

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
