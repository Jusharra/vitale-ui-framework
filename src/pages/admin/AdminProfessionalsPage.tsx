import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Plus, Search, Eye, FileText, Calendar, Tag, User, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define professional interface
interface Professional {
  id: string;
  name: string;
  first_name?: string;
  credentials?: string;
  email?: string;
  phone?: string;
  practice_name?: string;
  specialties?: string[];
  languages?: string[];
  specializations?: string[];
  service_area?: string;
  hourly_rate?: string;
  bio?: string;
  accepting_new_patients?: boolean;
  telehealth_enabled?: boolean;
  status: string;
  profile_image?: string;
  rating?: number;
  verified?: boolean;
  slug?: string;
}

const AdminProfessionalsPage = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const { toast } = useToast();

  // Form state for adding/editing professionals
  const [formData, setFormData] = useState({
    name: '',
    first_name: '',
    credentials: '',
    email: '',
    phone: '',
    practice_name: '',
    specialties: '',
    languages: '',
    service_area: '',
    hourly_rate: '',
    bio: '',
    accepting_new_patients: true,
    telehealth_enabled: false,
    status: 'active',
    profile_image: '',
    verified: false,
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      first_name: '',
      credentials: '',
      email: '',
      phone: '',
      practice_name: '',
      specialties: '',
      languages: '',
      service_area: '',
      hourly_rate: '',
      bio: '',
      accepting_new_patients: true,
      telehealth_enabled: false,
      status: 'active',
      profile_image: '',
      verified: false,
    });
  };

  const handleAddProfessional = async () => {
    try {
      // Convert comma-separated strings to arrays
      const specialtiesArray = formData.specialties
        ? formData.specialties.split(',').map(item => item.trim())
        : [];
      
      const languagesArray = formData.languages
        ? formData.languages.split(',').map(item => item.trim())
        : [];

      // Generate slug from name
      const slug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const { data, error } = await supabase
        .from('partners')
        .insert({
          name: formData.name,
          first_name: formData.first_name,
          credentials: formData.credentials,
          email: formData.email,
          phone: formData.phone,
          practice_name: formData.practice_name,
          specialties: specialtiesArray,
          languages: languagesArray,
          service_area: formData.service_area,
          hourly_rate: formData.hourly_rate,
          bio: formData.bio,
          accepting_new_patients: formData.accepting_new_patients,
          telehealth_enabled: formData.telehealth_enabled,
          status: formData.status,
          profile_image: formData.profile_image,
          verified: formData.verified,
          slug: slug,
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Professional created successfully',
      });

      resetForm();
      setIsAddDialogOpen(false);
      fetchProfessionals();
    } catch (error: any) {
      console.error('Error creating professional:', error);
      toast({
        title: 'Error',
        description: 'Failed to create professional',
        variant: 'destructive',
      });
    }
  };

  const handleEditProfessional = (professional: Professional) => {
    setSelectedProfessional(professional);
    setFormData({
      name: professional.name || '',
      first_name: professional.first_name || '',
      credentials: professional.credentials || '',
      email: professional.email || '',
      phone: professional.phone || '',
      practice_name: professional.practice_name || '',
      specialties: professional.specialties ? professional.specialties.join(', ') : '',
      languages: professional.languages ? professional.languages.join(', ') : '',
      service_area: professional.service_area || '',
      hourly_rate: professional.hourly_rate || '',
      bio: professional.bio || '',
      accepting_new_patients: professional.accepting_new_patients || false,
      telehealth_enabled: professional.telehealth_enabled || false,
      status: professional.status || 'active',
      profile_image: professional.profile_image || '',
      verified: professional.verified || false,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateProfessional = async () => {
    if (!selectedProfessional) return;

    try {
      // Convert comma-separated strings to arrays
      const specialtiesArray = formData.specialties
        ? formData.specialties.split(',').map(item => item.trim())
        : [];
      
      const languagesArray = formData.languages
        ? formData.languages.split(',').map(item => item.trim())
        : [];

      // Generate slug from name if it's different from the original name
      let slug = selectedProfessional.slug;
      if (formData.name !== selectedProfessional.name) {
        slug = formData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }

      const { error } = await supabase
        .from('partners')
        .update({
          name: formData.name,
          first_name: formData.first_name,
          credentials: formData.credentials,
          email: formData.email,
          phone: formData.phone,
          practice_name: formData.practice_name,
          specialties: specialtiesArray,
          languages: languagesArray,
          service_area: formData.service_area,
          hourly_rate: formData.hourly_rate,
          bio: formData.bio,
          accepting_new_patients: formData.accepting_new_patients,
          telehealth_enabled: formData.telehealth_enabled,
          status: formData.status,
          profile_image: formData.profile_image,
          verified: formData.verified,
          slug: slug,
        })
        .eq('id', selectedProfessional.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Professional updated successfully',
      });

      resetForm();
      setIsEditDialogOpen(false);
      setSelectedProfessional(null);
      fetchProfessionals();
    } catch (error: any) {
      console.error('Error updating professional:', error);
      toast({
        title: 'Error',
        description: 'Failed to update professional',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProfessional = async (professionalId: string) => {
    if (!confirm('Are you sure you want to delete this professional? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', professionalId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Professional deleted successfully',
      });

      fetchProfessionals();
    } catch (error: any) {
      console.error('Error deleting professional:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete professional',
        variant: 'destructive',
      });
    }
  };

  const handleViewProfessional = (slug: string) => {
    window.open(`/professional/${slug}`, '_blank');
  };

  // Filter professionals based on search term and active tab
  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (professional.email && professional.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (professional.practice_name && professional.practice_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'active') return matchesSearch && professional.status === 'active';
    if (activeTab === 'inactive') return matchesSearch && professional.status === 'inactive';
    if (activeTab === 'verified') return matchesSearch && professional.verified;
    return matchesSearch;
  });

  return (
    <Layout role="admin">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Healthcare Professionals</CardTitle>
            <CardDescription>Manage healthcare professionals and their profiles</CardDescription>
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
                  <DialogTitle>Add New Healthcare Professional</DialogTitle>
                  <DialogDescription>
                    Create a new healthcare professional profile
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Dr. Jane Smith"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="Jane"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="credentials">Credentials</Label>
                      <Input
                        id="credentials"
                        name="credentials"
                        value={formData.credentials}
                        onChange={handleInputChange}
                        placeholder="MD, FACP"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="doctor@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="practice_name">Practice Name</Label>
                      <Input
                        id="practice_name"
                        name="practice_name"
                        value={formData.practice_name}
                        onChange={handleInputChange}
                        placeholder="Smith Family Medicine"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialties">Specialties</Label>
                    <Input
                      id="specialties"
                      name="specialties"
                      value={formData.specialties}
                      onChange={handleInputChange}
                      placeholder="Cardiology, Internal Medicine (comma separated)"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Input
                        id="languages"
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                        placeholder="English, Spanish (comma separated)"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="service_area">Service Area</Label>
                      <Input
                        id="service_area"
                        name="service_area"
                        value={formData.service_area}
                        onChange={handleInputChange}
                        placeholder="San Mateo County, CA"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hourly_rate">Hourly Rate</Label>
                    <Input
                      id="hourly_rate"
                      name="hourly_rate"
                      value={formData.hourly_rate}
                      onChange={handleInputChange}
                      placeholder="$200-250"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Professional biography and background"
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile_image">Profile Image URL</Label>
                    <Input
                      id="profile_image"
                      name="profile_image"
                      value={formData.profile_image}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => handleSelectChange('status', value)}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="accepting_new_patients">Accepting New Patients</Label>
                      <Select 
                        value={formData.accepting_new_patients ? "true" : "false"} 
                        onValueChange={(value) => handleSelectChange('accepting_new_patients', value === "true")}
                      >
                        <SelectTrigger id="accepting_new_patients">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="telehealth_enabled">Telehealth Enabled</Label>
                      <Select 
                        value={formData.telehealth_enabled ? "true" : "false"} 
                        onValueChange={(value) => handleSelectChange('telehealth_enabled', value === "true")}
                      >
                        <SelectTrigger id="telehealth_enabled">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verified">Verified Provider</Label>
                    <Select 
                      value={formData.verified ? "true" : "false"} 
                      onValueChange={(value) => handleSelectChange('verified', value === "true")}
                    >
                      <SelectTrigger id="verified">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddProfessional}>Create Professional</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
              <TabsTrigger value="verified">Verified</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <ProfessionalsTable 
                professionals={filteredProfessionals} 
                isLoading={isLoading} 
                onEdit={handleEditProfessional}
                onDelete={handleDeleteProfessional}
                onView={handleViewProfessional}
              />
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              <ProfessionalsTable 
                professionals={filteredProfessionals} 
                isLoading={isLoading} 
                onEdit={handleEditProfessional}
                onDelete={handleDeleteProfessional}
                onView={handleViewProfessional}
              />
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-6">
              <ProfessionalsTable 
                professionals={filteredProfessionals} 
                isLoading={isLoading} 
                onEdit={handleEditProfessional}
                onDelete={handleDeleteProfessional}
                onView={handleViewProfessional}
              />
            </TabsContent>
            
            <TabsContent value="verified" className="mt-6">
              <ProfessionalsTable 
                professionals={filteredProfessionals} 
                isLoading={isLoading} 
                onEdit={handleEditProfessional}
                onDelete={handleDeleteProfessional}
                onView={handleViewProfessional}
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Edit Professional Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Healthcare Professional</DialogTitle>
              <DialogDescription>
                Update professional information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Dr. Jane Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-first_name">First Name</Label>
                  <Input
                    id="edit-first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="Jane"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-credentials">Credentials</Label>
                  <Input
                    id="edit-credentials"
                    name="credentials"
                    value={formData.credentials}
                    onChange={handleInputChange}
                    placeholder="MD, FACP"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@example.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-practice_name">Practice Name</Label>
                  <Input
                    id="edit-practice_name"
                    name="practice_name"
                    value={formData.practice_name}
                    onChange={handleInputChange}
                    placeholder="Smith Family Medicine"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-specialties">Specialties</Label>
                <Input
                  id="edit-specialties"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleInputChange}
                  placeholder="Cardiology, Internal Medicine (comma separated)"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-languages">Languages</Label>
                  <Input
                    id="edit-languages"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="English, Spanish (comma separated)"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-service_area">Service Area</Label>
                  <Input
                    id="edit-service_area"
                    name="service_area"
                    value={formData.service_area}
                    onChange={handleInputChange}
                    placeholder="San Mateo County, CA"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-hourly_rate">Hourly Rate</Label>
                <Input
                  id="edit-hourly_rate"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleInputChange}
                  placeholder="$200-250"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-bio">Professional Bio</Label>
                <Textarea
                  id="edit-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Professional biography and background"
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-profile_image">Profile Image URL</Label>
                <Input
                  id="edit-profile_image"
                  name="profile_image"
                  value={formData.profile_image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-accepting_new_patients">Accepting New Patients</Label>
                  <Select 
                    value={formData.accepting_new_patients ? "true" : "false"} 
                    onValueChange={(value) => handleSelectChange('accepting_new_patients', value === "true")}
                  >
                    <SelectTrigger id="edit-accepting_new_patients">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-telehealth_enabled">Telehealth Enabled</Label>
                  <Select 
                    value={formData.telehealth_enabled ? "true" : "false"} 
                    onValueChange={(value) => handleSelectChange('telehealth_enabled', value === "true")}
                  >
                    <SelectTrigger id="edit-telehealth_enabled">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-verified">Verified Provider</Label>
                <Select 
                  value={formData.verified ? "true" : "false"} 
                  onValueChange={(value) => handleSelectChange('verified', value === "true")}
                >
                  <SelectTrigger id="edit-verified">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateProfessional}>Update Professional</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </Layout>
  );
};

// Professionals Table Component
interface ProfessionalsTableProps {
  professionals: Professional[];
  isLoading: boolean;
  onEdit: (professional: Professional) => void;
  onDelete: (professionalId: string) => void;
  onView: (slug: string) => void;
}

const ProfessionalsTable: React.FC<ProfessionalsTableProps> = ({ 
  professionals, 
  isLoading,
  onEdit,
  onDelete,
  onView
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (professionals.length === 0) {
    return (
      <div className="text-center py-10">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No professionals found</h3>
        <p className="text-muted-foreground">
          Add your first healthcare professional to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Professional</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Accepting Patients</TableHead>
            <TableHead>Verified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {professionals.map((professional) => (
            <TableRow key={professional.id}>
              <TableCell>
                <div className="font-medium">{professional.name}</div>
                <div className="text-xs text-muted-foreground">
                  {professional.email}
                </div>
                {professional.practice_name && (
                  <div className="text-xs text-muted-foreground">
                    {professional.practice_name}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {professional.specialties && professional.specialties.map((specialty, idx) => (
                    <Badge key={idx} variant="outline">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={professional.status === "active" ? "default" : "secondary"}
                >
                  {professional.status}
                </Badge>
              </TableCell>
              <TableCell>
                {professional.accepting_new_patients ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span>Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    <span>No</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                {professional.verified ? (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    <span>Yes</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <X className="h-4 w-4 text-red-500 mr-1" />
                    <span>No</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {professional.slug && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onView(professional.slug!)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(professional)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(professional.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProfessionalsPage;