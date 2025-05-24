import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Pill, UserPlus, Ambulance, Building } from 'lucide-react';

import AddPartnerDialog from './dialogs/AddPartnerDialog';
import AddPharmacyDialog from './dialogs/AddPharmacyDialog';
import AddTransportDialog from './dialogs/AddTransportDialog';
import AddFacilityDialog from './dialogs/AddFacilityDialog';
import SearchHeader from './care-teams/SearchHeader';
import PartnersList from './care-teams/PartnersList';
import PharmaciesList from './care-teams/PharmaciesList';
import TransportsList from './care-teams/TransportsList';
import FacilitiesList from './care-teams/FacilitiesList';
import { useCareTeamsData } from './care-teams/useCareTeamsData';

const AdminCareTeams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('partners');
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isPharmacyDialogOpen, setIsPharmacyDialogOpen] = useState(false);
  const [isTransportDialogOpen, setIsTransportDialogOpen] = useState(false);
  const [isFacilityDialogOpen, setIsFacilityDialogOpen] = useState(false);
  
  const { partners, pharmacies, transports, facilities, isLoading, refetchData } = useCareTeamsData();

  const handleAddProvider = () => {
    if (activeTab === 'partners') {
      setIsPartnerDialogOpen(true);
    } else if (activeTab === 'pharmacies') {
      setIsPharmacyDialogOpen(true);
    } else if (activeTab === 'transports') {
      setIsTransportDialogOpen(true);
    } else if (activeTab === 'facilities') {
      setIsFacilityDialogOpen(true);
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'partners':
        return 'Add Healthcare Provider';
      case 'pharmacies':
        return 'Add Pharmacy';
      case 'transports':
        return 'Add Transport Provider';
      case 'facilities':
        return 'Add Care Facility';
      default:
        return 'Add Provider';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Care Teams & Service Providers</CardTitle>
          <CardDescription>Manage healthcare professionals and service providers</CardDescription>
        </div>
        <SearchHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onAddClick={handleAddProvider}
          addButtonText={getAddButtonText()}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="partners" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="partners" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              <span>Healthcare Professionals</span>
            </TabsTrigger>
            <TabsTrigger value="pharmacies" className="flex gap-2 items-center">
              <Pill className="h-4 w-4" />
              <span>Pharmacies</span>
            </TabsTrigger>
            <TabsTrigger value="transports" className="flex gap-2 items-center">
              <Ambulance className="h-4 w-4" />
              <span>Medical Transport</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex gap-2 items-center">
              <Building className="h-4 w-4" />
              <span>Care Facilities</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-6">
            <PartnersList
              partners={partners}
              isLoading={isLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="pharmacies" className="mt-6">
            <PharmaciesList
              pharmacies={pharmacies}
              isLoading={isLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="transports" className="mt-6">
            <TransportsList
              transports={transports}
              isLoading={isLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <FacilitiesList
              facilities={facilities}
              isLoading={isLoading}
              searchTerm={searchTerm}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <AddPartnerDialog 
        open={isPartnerDialogOpen} 
        onOpenChange={setIsPartnerDialogOpen} 
        onSuccess={refetchData} 
      />
      
      <AddPharmacyDialog 
        open={isPharmacyDialogOpen} 
        onOpenChange={setIsPharmacyDialogOpen} 
        onSuccess={refetchData} 
      />
      
      <AddTransportDialog 
        open={isTransportDialogOpen} 
        onOpenChange={setIsTransportDialogOpen} 
        onSuccess={refetchData} 
      />

      <AddFacilityDialog 
        open={isFacilityDialogOpen} 
        onOpenChange={setIsFacilityDialogOpen} 
        onSuccess={refetchData} 
      />
    </Card>
  );
};

export default AdminCareTeams;