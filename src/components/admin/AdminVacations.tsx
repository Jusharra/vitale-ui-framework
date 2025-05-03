
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Edit, Home, Plus, Search, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type VacationPackage = {
  id: string;
  destination_name: string;
  region: string;
  description_short: string;
  description_full: string | null;
  price: number;
  duration: string | null;
  package_type: string;
  image_url: string | null;
  amenities: string[];
  available_dates: {
    start_date: string | null;
    end_date: string | null;
  };
  status: string;
  featured: boolean;
};

const packageTypes = [
  "beach",
  "mountain",
  "city",
  "cruise",
  "adventure",
  "resort",
  "ski",
  "wellness",
  "cultural"
];

const regions = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Australia",
  "Caribbean",
  "Mediterranean",
  "Pacific"
];

const formSchema = z.object({
  destination_name: z.string().min(2, { message: "Destination name is required" }),
  region: z.string().min(1, { message: "Region is required" }),
  description_short: z.string().min(10, { message: "Short description is required" }),
  description_full: z.string().optional(),
  price: z.coerce.number().min(1, { message: "Price is required" }),
  duration: z.string().optional(),
  package_type: z.string().min(1, { message: "Package type is required" }),
  image_url: z.string().url().optional().or(z.literal('')),
  amenities: z.array(z.string()).optional(),
  available_dates: z.object({
    start_date: z.string().optional().nullable(),
    end_date: z.string().optional().nullable(),
  }).optional(),
  status: z.string().default("Active"),
  featured: z.boolean().default(false),
});

const AdminVacations: React.FC = () => {
  const [vacationPackages, setVacationPackages] = useState<VacationPackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState<VacationPackage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination_name: '',
      region: '',
      description_short: '',
      description_full: '',
      price: 0,
      duration: '',
      package_type: '',
      image_url: '',
      amenities: [],
      available_dates: {
        start_date: null,
        end_date: null,
      },
      status: 'Active',
      featured: false,
    },
  });

  const fetchVacationPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vacation_packages')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setVacationPackages(data || []);
    } catch (error) {
      console.error('Error fetching vacation packages:', error);
      toast({
        title: "Error",
        description: "Failed to load vacation packages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVacationPackages();
  }, []);

  const handleEdit = (pkg: VacationPackage) => {
    setEditingPackage(pkg);
    form.reset({
      ...pkg,
      price: Number(pkg.price),
      amenities: pkg.amenities || [],
      available_dates: pkg.available_dates || { start_date: null, end_date: null },
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vacation_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVacationPackages(vacationPackages.filter(pkg => pkg.id !== id));
      toast({
        title: "Package Deleted",
        description: "Vacation package has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: "Failed to delete vacation package",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (editingPackage) {
        // Update existing package
        const { error } = await supabase
          .from('vacation_packages')
          .update(values)
          .eq('id', editingPackage.id);

        if (error) throw error;

        toast({
          title: "Package Updated",
          description: "Vacation package has been updated successfully",
        });
      } else {
        // Create new package
        const { error } = await supabase
          .from('vacation_packages')
          .insert([values]);

        if (error) throw error;

        toast({
          title: "Package Created",
          description: "New vacation package has been created successfully",
        });
      }

      // Close dialog and refresh data
      setIsDialogOpen(false);
      fetchVacationPackages();
      form.reset();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Error",
        description: "Failed to save vacation package",
        variant: "destructive",
      });
    }
  };

  const filteredPackages = vacationPackages.filter(pkg => 
    pkg.destination_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.package_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openNewPackageDialog = () => {
    setEditingPackage(null);
    form.reset({
      destination_name: '',
      region: '',
      description_short: '',
      description_full: '',
      price: 0,
      duration: '',
      package_type: '',
      image_url: '',
      amenities: [],
      available_dates: {
        start_date: null,
        end_date: null,
      },
      status: 'Active',
      featured: false,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Vacation Packages</CardTitle>
            <CardDescription>Manage all vacation packages available to members</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search packages..." 
                className="pl-8 w-[250px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNewPackageDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Package
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingPackage ? 'Edit Vacation Package' : 'Create New Vacation Package'}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for this vacation package. All packages will be visible to members.
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="destination_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Destination Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Paris Getaway" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {regions.map(region => (
                                  <SelectItem key={region} value={region}>{region}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (USD)</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 5 days, 4 nights" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="package_type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Package Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a package type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {packageTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Package</FormLabel>
                              <FormDescription>
                                Featured packages will be highlighted in the vacation marketplace.
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description_short"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Short Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Brief description of the package (displayed in cards)"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description_full"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Detailed description with all package information"
                              className="resize-none min-h-[200px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit">
                        {editingPackage ? 'Save Changes' : 'Create Package'}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Destination</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Package Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                        {searchTerm ? "No vacation packages found matching your search" : "No vacation packages found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPackages.map((pkg) => (
                      <TableRow key={pkg.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                              {pkg.image_url ? (
                                <div className="w-full h-full bg-cover bg-center rounded" style={{ backgroundImage: `url(${pkg.image_url})` }}></div>
                              ) : (
                                <Home className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{pkg.destination_name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]">{pkg.description_short}</div>
                            </div>
                            {pkg.featured && <Badge variant="secondary" className="ml-1">Featured</Badge>}
                          </div>
                        </TableCell>
                        <TableCell>{pkg.region}</TableCell>
                        <TableCell>{pkg.package_type}</TableCell>
                        <TableCell>${pkg.price.toLocaleString()}</TableCell>
                        <TableCell>{pkg.duration || "—"}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={pkg.status === "Active" ? "outline" : "secondary"} className={pkg.status === "Active" ? "border-green-500 text-green-500" : ""}>
                            {pkg.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(pkg)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={() => handleDelete(pkg.id)}>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVacations;
