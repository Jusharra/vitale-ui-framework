import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, DollarSign, Users, Eye } from 'lucide-react';
import { Facility } from './useCareTeamsData';
import EditFacilityDialog from '../dialogs/EditFacilityDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface FacilitiesListProps {
  facilities: Facility[];
  isLoading: boolean;
  searchTerm: string;
  refetchData: () => void;
}

const FacilitiesList = ({ facilities, isLoading, searchTerm, refetchData }: FacilitiesListProps) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter facilities based on search term
  const filteredFacilities = searchTerm
    ? facilities.filter(facility => 
        (facility.name && facility.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.description && facility.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.location && facility.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.care_type && facility.care_type.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : facilities;

  const handleEdit = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFacilityId) return;
    
    try {
      const { error } = await supabase
        .from('care_facilities' as any)
        .delete()
        .eq('id', selectedFacilityId);
        
      if (error) throw error;
      
      toast({
        title: 'Facility deleted',
        description: 'The care facility has been deleted successfully',
      });
      
      refetchData();
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete care facility',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedFacilityId(null);
    }
  };

  const handleViewDetails = (facilityId: string) => {
    // In a real app, this would navigate to a detailed view
    toast({
      title: 'View Details',
      description: `Viewing details for facility ID: ${facilityId}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Facility</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Care Type</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFacilities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No facilities found matching your search" : "No facilities found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFacilities.map((facility) => (
                <TableRow key={facility.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{facility.name}</div>
                      <div className="text-xs text-muted-foreground max-w-[200px] truncate">{facility.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{facility.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{facility.care_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{facility.price_range}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <Badge variant={facility.status === 'active' ? "default" : "secondary"} className={facility.status === 'active' ? "border-green-500 text-green-500" : ""}>
                        {facility.status === 'active' ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(facility.id)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(facility.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(facility.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Facility Dialog */}
      <EditFacilityDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={refetchData}
        facilityId={selectedFacilityId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the care facility
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FacilitiesList;