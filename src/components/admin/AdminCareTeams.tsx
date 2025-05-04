
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Pill, UserPlus } from 'lucide-react';

import AddPartnerDialog from './dialogs/AddPartnerDialog';
import AddPharmacyDialog from './dialogs/AddPharmacyDialog';
import SearchHeader from './care-teams/SearchHeader';
import PartnersList from './care-teams/PartnersList';
import PharmaciesList from './care-teams/PharmaciesList';
import { useCareTeamsData } from './care-teams/useCareTeamsData';

const AdminCareTeams = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('partners');
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isPharmacyDialogOpen, setIsPharmacyDialogOpen] = useState(false);
  
  const { partners, pharmacies, isLoading, refetchData } = useCareTeamsData();

  const handleAddProvider = () => {
    if (activeTab === 'partners') {
      setIsPartnerDialogOpen(true);
    } else {
      setIsPharmacyDialogOpen(true);
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
          addButtonText={activeTab === 'partners' ? 'Add Healthcare Provider' : 'Add Pharmacy'}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="partners" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partners" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              <span>Healthcare Professionals</span>
            </TabsTrigger>
            <TabsTrigger value="pharmacies" className="flex gap-2 items-center">
              <Pill className="h-4 w-4" />
              <span>Pharmacies</span>
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
    </Card>
  );
};

export default AdminCareTeams;
