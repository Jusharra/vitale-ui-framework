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
import { Check, ChevronRight, Edit, MapPin, Trash2, X } from 'lucide-react';
import { Transport } from './useCareTeamsData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import EditTransportDialog from '../dialogs/EditTransportDialog';

interface TransportsListProps {
  transports: Transport[];
  isLoading: boolean;
  searchTerm: string;
  refetchData?: () => void;
}

const TransportsList = ({ transports, isLoading, searchTerm, refetchData }: TransportsListProps) => {
  const { toast } = useToast();
  const [selectedTransportId, setSelectedTransportId] = useState<string | null>(null);
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

  // Filter transports based on search term
  const filteredTransports = searchTerm
    ? transports.filter(transport => 
        (transport.name && transport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transport.email && transport.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (transport.service_area && transport.service_area.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : transports;

  const handleEdit = (transportId: string) => {
    setSelectedTransportId(transportId);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (transportId: string) => {
    setSelectedTransportId(transportId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTransportId) return;
    
    try {
      const { error } = await supabase
        .from('transports')
        .delete()
        .eq('id', selectedTransportId);
        
      if (error) throw error;
      
      toast({
        title: 'Transport provider deleted',
        description: 'The transport provider has been deleted successfully',
      });
      
      if (refetchData) {
        refetchData();
      }
    } catch (error) {
      console.error('Error deleting transport provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete transport provider',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedTransportId(null);
    }
  };

  const handleViewDetails = (transportId: string) => {
    // In a real app, this would navigate to a detailed view
    toast({
      title: 'View Details',
      description: `Viewing details for transport provider ID: ${transportId}`,
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
              <TableHead className="w-[300px]">Transport Provider</TableHead>
              <TableHead>Service Area</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Wheelchair</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  {searchTerm ? "No transport providers found matching your search" : "No transport providers found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredTransports.map((transport) => (
                <TableRow key={transport.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={transport.profile_image} />
                        <AvatarFallback>{getInitials(transport.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{transport.name}</div>
                        <div className="text-xs text-muted-foreground">{transport.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{transport.service_area || 'Not specified'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={transport.services || ''}>
                      {transport.services || 'Not specified'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transport.status === "active" ? "outline" : "secondary"} className={transport.status === "active" ? "border-green-500 text-green-500" : ""}>
                      {transport.status || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transport.available_24_7 ? (
                      <Badge variant="outline" className="border-green-500 text-green-500">
                        <Check className="h-3 w-3 mr-1" /> 24/7
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <X className="h-3 w-3 mr-1" /> Standard
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {transport.wheelchair_accessible ? (
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
                      <Button size="sm" variant="outline" onClick={() => handleEdit(transport.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(transport.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(transport.id)}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Transport Dialog */}
      <EditTransportDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => {
          if (refetchData) refetchData();
        }}
        transportId={selectedTransportId}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the transport provider
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

export default TransportsList;