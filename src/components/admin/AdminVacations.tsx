
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
import { Check, Filter, Plus, Search, Trash, Upload } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Define the type for vacation packages
interface VacationPackage {
  id: string;
  destination_name: string;
  region: string;
  description_short: string;
  description_full: string;
  price: number;
  duration: string;
  package_type: string;
  image_url: string;
  status: string;
  amenities: string[];
  available_dates: {
    start_date: string;
    end_date: string;
  };
  featured: boolean;
  booking_link?: string;
  created_at?: string;
  updated_at?: string;
}

// Mock vacation packages data
const mockVacationPackages: VacationPackage[] = [
  {
    id: "vp-001",
    destination_name: "Bali Serenity Retreat",
    region: "Asia",
    description_short: "Luxurious beachfront villas with private pools",
    description_full: "Experience ultimate tranquility in our exclusive Bali retreat. Nestled between lush tropical gardens and pristine beaches, our resort offers the perfect getaway for those seeking peace and luxury. Each villa features a private pool, outdoor shower, and stunning ocean views.",
    price: 2499,
    duration: "7 days",
    package_type: "Luxury",
    image_url: "/assets/images/vacations/bali.jpg",
    status: "active",
    amenities: ["Private pool", "Spa access", "Daily yoga", "Airport transfer", "All meals included"],
    available_dates: {
      start_date: "2025-06-01",
      end_date: "2025-09-30"
    },
    featured: true,
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-04-10T14:45:00Z"
  },
  {
    id: "vp-002",
    destination_name: "Swiss Alps Adventure",
    region: "Europe",
    description_short: "Mountain chalets with skiing and hiking packages",
    description_full: "Discover the breathtaking beauty of the Swiss Alps with our complete adventure package. Stay in authentic wooden chalets with modern amenities and enjoy daily guided activities including skiing, hiking, and mountain biking. Perfect for active families and adventure seekers.",
    price: 1899,
    duration: "5 days",
    package_type: "Adventure",
    image_url: "/assets/images/vacations/swiss-alps.jpg",
    status: "active",
    amenities: ["Ski equipment", "Guided tours", "Hot tub", "Breakfast included", "Mountain views"],
    available_dates: {
      start_date: "2025-11-15",
      end_date: "2026-03-20"
    },
    featured: false,
    created_at: "2025-02-20T09:15:00Z",
    updated_at: "2025-04-05T11:30:00Z"
  },
  {
    id: "vp-003",
    destination_name: "Caribbean Cruise Exclusive",
    region: "Caribbean",
    description_short: "Luxury cruise with island-hopping experience",
    description_full: "Set sail on our premium cruise ship and explore the Caribbean's most beautiful islands. This all-inclusive package features luxury cabins, gourmet dining options, and exciting shore excursions at each destination. Enjoy onboard entertainment, spa treatments, and breathtaking ocean views.",
    price: 3299,
    duration: "10 days",
    package_type: "Cruise",
    image_url: "/assets/images/vacations/caribbean.jpg",
    status: "draft",
    amenities: ["Ocean view cabin", "All-inclusive dining", "Pool access", "Evening entertainment", "Island excursions"],
    available_dates: {
      start_date: "2025-07-10",
      end_date: "2025-12-15"
    },
    featured: true,
    created_at: "2025-03-05T16:20:00Z",
    updated_at: "2025-04-12T10:10:00Z"
  }
];

const AdminVacations: React.FC = () => {
  const [packages, setPackages] = useState<VacationPackage[]>(mockVacationPackages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
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

  const handleSubmit = () => {
    // Validate form
    if (!formData.destination_name || !formData.region || !formData.description_short) {
      alert("Please fill all required fields");
      return;
    }

    // Add new package with UUID
    const newPackage: VacationPackage = {
      id: `vp-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      destination_name: formData.destination_name!,
      region: formData.region!,
      description_short: formData.description_short!,
      description_full: formData.description_full || '',
      price: formData.price || 0,
      duration: formData.duration || '',
      package_type: formData.package_type || '',
      image_url: formData.image_url || '',
      status: formData.status || 'draft',
      amenities: formData.amenities || [],
      available_dates: formData.available_dates as { start_date: string; end_date: string },
      featured: formData.featured || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setPackages([...packages, newPackage]);
    resetForm();
    setIsAddModalOpen(false);
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

  const deletePackage = (id: string) => {
    setPackages(packages.filter(pkg => pkg.id !== id));
  };

  const toggleFeatured = (id: string) => {
    setPackages(packages.map(pkg => 
      pkg.id === id ? { ...pkg, featured: !pkg.featured } : pkg
    ));
  };

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.destination_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pkg.description_short.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || pkg.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
                
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
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
                            <Button variant="ghost" size="sm">Edit</Button>
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
    </div>
  );
};

export default AdminVacations;
