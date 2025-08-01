import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronRight, Edit, Trash2, X, Eye } from 'lucide-react';
import { Partner } from './useCareTeamsData'; // Import the Partner type from useCareTeamsData
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
} from "@/components/ui/alert-dialog";
import EditPartnerDialog from '../dialogs/EditPartnerDialog';
import { OnboardPartnerDialog } from '../dialogs/OnboardPartnerDialog';

interface PartnersListProps {
  partners: Partner[];
  isLoading: boolean;
  searchTerm: string;
  refetchData?: () => void;
}

const PartnersList = ({ partners, isLoading, searchTerm, refetchData }: PartnersListProps) => {
  const { toast } = useToast();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter partners based on search term
  const filteredPartners = searchTerm
    ? partners.filter(partner => 
        (partner.name && partner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partner.email && partner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partner.specialties && partner.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : partners;

  const handleEdit = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPartnerId) return;
    
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', selectedPartnerId);
        
      if (error) throw error;
      
      toast({
        title: 'Partner deleted',
        description: 'The healthcare professional has been deleted successfully',
      });
      
      if (refetchData) {
        refetchData();
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete healthcare professional',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPartnerId(null);
    }
  };

  const handleViewDetails = (partner: Partner) => {
    if (partner.slug) {
      window.open(`/professional/${partner.slug}`, '_blank');
    } else {
      toast({
        title: 'No profile page available',
        description: 'This professional does not have a public profile page yet.',
        variant: 'destructive',
      });
    }
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
              <TableHead className="w-[300px]">Provider</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Accepting New Patients</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No providers found matching your search" : "No providers found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((partner) => (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={partner.profile_image} />
                        <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-xs text-muted-foreground">{partner.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {partner.specialties && partner.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={partner.status === "active" ? "outline" : "secondary"} className={partner.status === "active" ? "border-green-500 text-green-500" : ""}>
                      {partner.status || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{partner.rating || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {partner.accepting_new_patients ? (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <Check className="h-3 w-3 mr-1" /> Yes
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="h-3 w-3 mr-1" /> No
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <OnboardPartnerDialog 
                        partner={partner}
                        onSuccess={() => refetchData?.()}
                      />
                      <Button size="sm" variant="outline" onClick={() => handleEdit(partner.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(partner.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewDetails(partner)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Partner Dialog */}
      <EditPartnerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          if (refetchData) refetchData();
        }}
        partnerId={selectedPartnerId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the healthcare professional
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

export default PartnersList;