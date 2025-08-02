
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, Filter, Plus, Search, Trash, Upload, Edit, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useVacationPackages, VacationPackage } from '@/hooks/useVacationPackages';
import EditVacationModal from '@/components/admin/dialogs/EditVacationModal';
import MediaUploader from '@/components/common/MediaUploader';

const AdminVacations: React.FC = () => {
  const { packages, loading, createPackage, updatePackage, deletePackage, toggleFeatured } = useVacationPackages();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<VacationPackage | null>(null);
  
  // Form state for adding/editing vacation packages
  const [formData, setFormData] = useState<Partial<VacationPackage>>({
    destination_name: '',
    region: '',
    description_short: '',
    description_full: '',
    price: 0,
    duration: '',
    package_type: '',
    image_url: '',
    status: 'draft',
    amenities: [],
    available_dates: {
      start_date: '',
      end_date: ''
    },
    featured: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };

  const handleDateChange = (dateType: 'start_date' | 'end_date', value: string) => {
    setFormData({
      ...formData,
      available_dates: {
        ...formData.available_dates,
        [dateType]: value
      } as { start_date: string; end_date: string }
    });
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.destination_name || !formData.region || !formData.description_short) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const packageData = {
        destination_name: formData.destination_name!,
        region: formData.region!,
        description_short: formData.description_short!,
        description_full: formData.description_full || '',
        price: formData.price || 0,
        duration: formData.duration || '',
        package_type: formData.package_type || '',
        image_url: formData.image_url || '',
        status: formData.status || 'Draft',
        amenities: formData.amenities || [],
        available_dates: formData.available_dates as { start_date: string; end_date: string },
        featured: formData.featured || false
      };

      await createPackage(packageData);
      resetForm();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error creating package:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      destination_name: '',
      region: '',
      description_short: '',
      description_full: '',
      price: 0,
      duration: '',
      package_type: '',
      image_url: '',
      status: 'draft',
      amenities: [],
      available_dates: {
        start_date: '',
        end_date: ''
      },
      featured: false
    });
  };


  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.destination_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.description_short.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || pkg.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading vacation packages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vacation Packages</h1>
        <p className="text-muted-foreground">Manage vacation offerings for members</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search packages..."
              className="pl-8 w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vacation Package</DialogTitle>
              <DialogDescription>
                Create a new vacation package to offer to members
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination_name">Destination Name *</Label>
                  <Input
                    id="destination_name"
                    name="destination_name"
                    value={formData.destination_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Bali Serenity Retreat"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region">Region *</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => handleSelectChange('region', value)}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="North America">North America</SelectItem>
                      <SelectItem value="South America">South America</SelectItem>
                      <SelectItem value="Europe">Europe</SelectItem>
                      <SelectItem value="Asia">Asia</SelectItem>
                      <SelectItem value="Africa">Africa</SelectItem>
                      <SelectItem value="Oceania">Oceania</SelectItem>
                      <SelectItem value="Caribbean">Caribbean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price?.toString()}
                    onChange={handleInputChange}
                    placeholder="e.g., 2499"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 7 days"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package_type">Package Type</Label>
                  <Select 
                    value={formData.package_type} 
                    onValueChange={(value) => handleSelectChange('package_type', value)}
                  >
                    <SelectTrigger id="package_type">
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="Family">Family</SelectItem>
                      <SelectItem value="Cruise">Cruise</SelectItem>
                      <SelectItem value="Beach">Beach</SelectItem>
                      <SelectItem value="Urban">Urban</SelectItem>
                      <SelectItem value="Wellness">Wellness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2 space-y-2">
                  <Label>Package Image</Label>
                  <MediaUploader
                    currentUrl={formData.image_url || ''}
                    onUpload={(url) => setFormData({...formData, image_url: url})}
                    onRemove={() => setFormData({...formData, image_url: ''})}
                    folder="vacation-packages"
                    maxSize={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.available_dates?.start_date}
                    onChange={(e) => handleDateChange('start_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.available_dates?.end_date}
                    onChange={(e) => handleDateChange('end_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_short">Short Description *</Label>
                <Input
                  id="description_short"
                  name="description_short"
                  value={formData.description_short}
                  onChange={handleInputChange}
                  placeholder="Brief overview of the package"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_full">Full Description</Label>
                <Textarea
                  id="description_full"
                  name="description_full"
                  value={formData.description_full}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the vacation package"
                  rows={4}
                />
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="status">Status:</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger id="status" className="w-[110px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="featured" 
                    checked={formData.featured} 
                    onCheckedChange={(checked) => handleSwitchChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Featured Package</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Save Package</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Packages ({packages.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({packages.filter(p => p.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({packages.filter(p => p.featured).length})</TabsTrigger>
          <TabsTrigger value="draft">Drafts ({packages.filter(p => p.status === 'draft').length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.length > 0 ? (
                    filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">{pkg.destination_name}</TableCell>
                        <TableCell>{pkg.region}</TableCell>
                        <TableCell>${pkg.price.toLocaleString()}</TableCell>
                        <TableCell>{pkg.duration}</TableCell>
                        <TableCell>
                          <Badge variant={pkg.status === 'active' ? 'default' : pkg.status === 'draft' ? 'outline' : 'secondary'}>
                            {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => toggleFeatured(pkg.id)}
                            className={pkg.featured ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground'}
                          >
                            {pkg.featured ? <Check className="h-4 w-4" /> : '-'}
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditingPackage(pkg)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Package</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{pkg.destination_name}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deletePackage(pkg.id)} className="bg-red-500 hover:bg-red-600">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No vacation packages found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active">
          {/* Same table structure but filtered for active packages */}
          <Card>
            <CardContent className="p-0">
              <Table>
                {/* ... table implementation similar to "all" tab but filtered */}
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="featured">
          {/* Same table structure but filtered for featured packages */}
        </TabsContent>
        <TabsContent value="draft">
          {/* Same table structure but filtered for draft packages */}
        </TabsContent>
      </Tabs>

      <EditVacationModal
        isOpen={!!editingPackage}
        onClose={() => setEditingPackage(null)}
        vacationPackage={editingPackage}
        onSave={updatePackage}
      />
    </div>
  );
};

export default AdminVacations;
