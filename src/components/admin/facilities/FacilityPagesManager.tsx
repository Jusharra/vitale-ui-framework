import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye, Globe, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import FacilityEditor from './FacilityEditor';
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

interface Facility {
  id: string;
  name: string;
  slug: string;
  description: string;
  featured_image: string;
  seo_keywords: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const FacilityPagesManager = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('care_facilities' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match our Facility interface
      const mappedData = (data as any[]).map((facility: any) => ({
        ...facility,
        is_published: facility.status === 'active',
        featured_image: facility.image_url || '',
        seo_keywords: facility.seo_keywords || []
      }));
      
      setFacilities(mappedData);
    } catch (error: any) {
      console.error('Error fetching facilities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load facilities',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (facility: Facility) => {
    setSelectedFacility(facility);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFacility) return;
    
    try {
      const { error } = await supabase
        .from('care_facilities')
        .delete()
        .eq('id', selectedFacility.id);
        
      if (error) throw error;
      
      toast({
        title: 'Facility deleted',
        description: 'The facility page has been deleted successfully',
      });
      
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete facility',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedFacility(null);
    }
  };

  const handleViewLive = (slug: string) => {
    window.open(`/care/${slug}`, '_blank');
  };

  // Filter facilities based on search term
  const filteredFacilities = searchTerm
    ? facilities.filter(facility => 
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : facilities;

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Care Facility Pages</CardTitle>
          <CardDescription>Manage SEO-optimized landing pages for care facilities</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search facilities..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Facility Page
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Facility Page</DialogTitle>
              </DialogHeader>
              <FacilityEditor 
                onSuccess={() => {
                  fetchFacilities();
                  setIsAddDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Facility</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredFacilities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No facilities found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredFacilities.map((facility) => (
                  <TableRow key={facility.id}>
                    <TableCell>
                      <div className="font-medium">{facility.name}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                        {facility.description.substring(0, 100)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-muted-foreground mr-1" />
                        <span className="text-sm font-mono">{facility.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={facility.is_published ? "default" : "secondary"}>
                        {facility.is_published ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(facility.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {facility.is_published && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewLive(facility.slug)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(facility)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(facility)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Facility Page</DialogTitle>
          </DialogHeader>
          {selectedFacility && (
            <FacilityEditor 
              facility={selectedFacility}
              onSuccess={() => {
                fetchFacilities();
                setIsEditDialogOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the facility page
              and remove it from our servers.
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
    </Card>
  );
};

export default FacilityPagesManager;