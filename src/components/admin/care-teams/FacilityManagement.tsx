import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { useCareTeamsData } from './useCareTeamsData';
import FacilitiesList from './FacilitiesList';
import AddFacilityDialog from '../dialogs/AddFacilityDialog';
import SearchHeader from './SearchHeader';

const FacilityManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { facilities, isLoading, refetchData } = useCareTeamsData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Care Facilities</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Facility
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <SearchHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onAddClick={() => setIsAddDialogOpen(true)}
            addButtonText="Add Facility"
          />
        </div>
        
        <FacilitiesList
          facilities={facilities}
          isLoading={isLoading}
          searchTerm={searchTerm}
          refetchData={refetchData}
        />
      </CardContent>
      
      <AddFacilityDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={refetchData}
      />
    </Card>
  );
};

export default FacilityManagement;