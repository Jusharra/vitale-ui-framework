import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Search, 
  Plus, 
  Briefcase, 
  CalendarClock, 
  Star, 
  ShieldCheck, 
  Edit, 
  Trash2,
  ChevronRight,
  Filter,
  Check,
  X,
  UserPlus,
  Pill
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AddPartnerDialog from './dialogs/AddPartnerDialog';
import AddPharmacyDialog from './dialogs/AddPharmacyDialog';

const AdminCareTeams = () => {
  const [partners, setPartners] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('partners');
  const [isPartnerDialogOpen, setIsPartnerDialogOpen] = useState(false);
  const [isPharmacyDialogOpen, setIsPharmacyDialogOpen] = useState(false);
  
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch partners
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (partnersError) throw partnersError;
      setPartners(partnersData || []);
      
      // Fetch pharmacies
      const { data: pharmaciesData, error: pharmaciesError } = await supabase
        .from('pharmacies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pharmaciesError) throw pharmaciesError;
      setPharmacies(pharmaciesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  const getFilteredData = (data, term) => {
    if (!term) return data;
    return data.filter(item => 
      (item.name && item.name.toLowerCase().includes(term.toLowerCase())) ||
      (item.email && item.email.toLowerCase().includes(term.toLowerCase())) ||
      (item.specialties && item.specialties.some(specialty => specialty.toLowerCase().includes(term.toLowerCase())))
    );
  };

  const filteredPartners = getFilteredData(partners, searchTerm);
  const filteredPharmacies = getFilteredData(pharmacies, searchTerm);

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAddProvider = () => {
    if (activeTab === 'partners') {
      setIsPartnerDialogOpen(true);
    } else {
      setIsPharmacyDialogOpen(true);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Care Teams & Service Providers</CardTitle>
          <CardDescription>Manage healthcare professionals and service providers</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search providers..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddProvider}>
            <Plus className="mr-2 h-4 w-4" />
            {activeTab === 'partners' ? 'Add Healthcare Provider' : 'Add Pharmacy'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="partners" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="partners" className="flex gap-2 items-center">
              <UserPlus className="h-4 w-4" />
              <span>Healthcare Professionals</span>
            </TabsTrigger>
            <TabsTrigger value="pharmacies" className="flex gap-2 items-center">
              <Pill className="h-4 w-4" />
              <span>Pharmacies</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="partners" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
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
                              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
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
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
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
            )}
          </TabsContent>

          <TabsContent value="pharmacies" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Pharmacy</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Delivery</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPharmacies.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          {searchTerm ? "No pharmacies found matching your search" : "No pharmacies found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPharmacies.map((pharmacy) => (
                        <TableRow key={pharmacy.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{pharmacy.name}</div>
                              <div className="text-xs text-muted-foreground">{pharmacy.phone}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{pharmacy.address || 'No address provided'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm max-w-[200px] truncate">{pharmacy.services || 'Standard pharmacy services'}</div>
                          </TableCell>
                          <TableCell>
                            {pharmacy.delivery_available ? (
                              <Badge variant="outline" className="border-green-500 text-green-500">
                                <Check className="h-3 w-3 mr-1" /> Available
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <X className="h-3 w-3 mr-1" /> Not Available
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={pharmacy.status === "active" ? "outline" : "secondary"} className={pharmacy.status === "active" ? "border-green-500 text-green-500" : ""}>
                              {pharmacy.status || 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
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
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <AddPartnerDialog 
        open={isPartnerDialogOpen} 
        onOpenChange={setIsPartnerDialogOpen} 
        onSuccess={fetchData} 
      />
      
      <AddPharmacyDialog 
        open={isPharmacyDialogOpen} 
        onOpenChange={setIsPharmacyDialogOpen} 
        onSuccess={fetchData} 
      />
    </Card>
  );
};

export default AdminCareTeams;
