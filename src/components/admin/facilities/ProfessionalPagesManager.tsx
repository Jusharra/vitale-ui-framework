import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Edit, Trash2, Eye, User, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import ProfessionalEditor from './ProfessionalEditor';
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

interface Professional {
  id: string;
  name: string;
  slug: string;
  credentials: string;
  bio: string;
  profile_image: string;
  specialties: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

const ProfessionalPagesManager = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProfessionals(data || []);
    } catch (error: any) {
      console.error('Error fetching professionals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load professionals',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProfessional) return;
    
    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', selectedProfessional.id);
        
      if (error) throw error;
      
      toast({
        title: 'Professional deleted',
        description: 'The professional profile has been deleted successfully',
      });
      
      fetchProfessionals();
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete professional',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedProfessional(null);
    }
  };

  const handleViewLive = (slug: string) => {
    window.open(`/professional/${slug}`, '_blank');
  };

  // Filter professionals based on search term
  const filteredProfessionals = searchTerm
    ? professionals.filter(professional => 
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.credentials?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : professionals;

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Healthcare Professional Profiles</CardTitle>
          <CardDescription>Manage SEO-optimized landing pages for healthcare professionals</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search professionals..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Professional
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Professional</DialogTitle>
              </DialogHeader>
              <ProfessionalEditor 
                onSuccess={() => {
                  fetchProfessionals();
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
                <TableHead className="w-[300px]">Professional</TableHead>
                <TableHead>Specialties</TableHead>
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
              ) : filteredProfessionals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No professionals found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-muted">
                          {professional.profile_image ? (
                            <img 
                              src={professional.profile_image} 
                              alt={professional.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 m-2 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{professional.name}</div>
                          <div className="text-xs text-muted-foreground">{professional.credentials}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {professional.specialties && professional.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {professional.specialties && professional.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{professional.specialties.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={professional.status === "active" ? "default" : "secondary"}>
                        {professional.status === "active" ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {professional.updated_at ? new Date(professional.updated_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {professional.status === "active" && professional.slug && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewLive(professional.slug)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEdit(professional)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(professional)}
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
            <DialogTitle>Edit Professional</DialogTitle>
          </DialogHeader>
          {selectedProfessional && (
            <ProfessionalEditor 
              professional={selectedProfessional}
              onSuccess={() => {
                fetchProfessionals();
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
              This action cannot be undone. This will permanently delete the professional profile
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

export default ProfessionalPagesManager;