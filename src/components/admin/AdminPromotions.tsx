
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Award, Briefcase, CalendarPlus, Plus, Search, Trash2, Edit, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddPromotionDialog from './dialogs/AddPromotionDialog';
import AddOfferDialog from './dialogs/AddOfferDialog';
import AddRewardDialog from './dialogs/AddRewardDialog';
import EditPromotionDialog from './dialogs/EditPromotionDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const AdminPromotions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('promotions');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [promotions, setPromotions] = useState([]);
  const [offers, setOffers] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [isAddPromotionOpen, setIsAddPromotionOpen] = useState(false);
  const [isAddOfferOpen, setIsAddOfferOpen] = useState(false);
  const [isAddRewardOpen, setIsAddRewardOpen] = useState(false);
  const [isEditPromotionOpen, setIsEditPromotionOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [toast]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch promotions
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (promotionsError) throw promotionsError;
      setPromotions(promotionsData || []);
      
      // Fetch offers
      const { data: offersData, error: offersError } = await supabase
        .from('partner_offers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (offersError) throw offersError;
      setOffers(offersData || []);
      
      // Fetch rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('member_rewards')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (rewardsError) throw rewardsError;
      setRewards(rewardsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load promotions data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredData = (data: any[]) => {
    if (!searchTerm) return data;
    return data.filter(item => 
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredPromotions = getFilteredData(promotions);
  const filteredOffers = getFilteredData(offers);
  const filteredRewards = getFilteredData(rewards);

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString();
  };

  const handleAddClick = () => {
    switch (activeTab) {
      case 'promotions':
        setIsAddPromotionOpen(true);
        break;
      case 'offers':
        setIsAddOfferOpen(true);
        break;
      case 'rewards':
        setIsAddRewardOpen(true);
        break;
      default:
        break;
    }
  };

  const handleEditPromotion = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsEditPromotionOpen(true);
  };

  const handleDeletePromotion = (promotion: any) => {
    setPromotionToDelete(promotion);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePromotion = async () => {
    if (!promotionToDelete) return;

    try {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', promotionToDelete.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Promotion deleted successfully',
      });

      await fetchData();
      setDeleteDialogOpen(false);
      setPromotionToDelete(null);
    } catch (error) {
      console.error('Error deleting promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete promotion',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Promotions & Rewards</CardTitle>
          <CardDescription>Manage all promotional offers and member rewards</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="promotions" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="promotions" className="flex gap-2 items-center">
              <CalendarPlus className="h-4 w-4" />
              <span>Promotions</span>
            </TabsTrigger>
            <TabsTrigger value="offers" className="flex gap-2 items-center">
              <Briefcase className="h-4 w-4" />
              <span>Offers</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex gap-2 items-center">
              <Award className="h-4 w-4" />
              <span>Reward Deals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="promotions" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScrollArea className="h-[500px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Expiration</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Performance</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPromotions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          {searchTerm ? "No promotions found matching your search" : "No promotions found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPromotions.map((promotion: any) => (
                        <TableRow key={promotion.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{promotion.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]">{promotion.description}</div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{promotion.type}</Badge></TableCell>
                          <TableCell>${promotion.reward_amount}</TableCell>
                          <TableCell>{formatDate(promotion.expires_at)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={promotion.status === "active" ? "outline" : "secondary"} className={promotion.status === "active" ? "border-green-500 text-green-500" : ""}>
                              {promotion.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="w-4 h-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditPromotion(promotion)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeletePromotion(promotion)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="offers" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScrollArea className="h-[500px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Financing</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOffers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                          {searchTerm ? "No offers found matching your search" : "No offers found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOffers.map((offer: any) => (
                        <TableRow key={offer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{offer.title}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]">{offer.description}</div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{offer.category}</Badge></TableCell>
                          <TableCell>${offer.price}</TableCell>
                          <TableCell>
                            {offer.financing_available ? (
                              <Badge variant="outline" className="border-green-500 text-green-500">Available</Badge>
                            ) : (
                              <Badge variant="secondary">Not Available</Badge>
                            )}
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
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="rewards" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <ScrollArea className="h-[500px] rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRewards.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          {searchTerm ? "No rewards found matching your search" : "No rewards found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredRewards.map((reward: any) => (
                        <TableRow key={reward.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{reward.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[180px]">{reward.description}</div>
                            </div>
                          </TableCell>
                          <TableCell><Badge variant="outline">{reward.reward_type}</Badge></TableCell>
                          <TableCell>${reward.value}</TableCell>
                          <TableCell>{formatDate(reward.expires_at)}</TableCell>
                          <TableCell>
                            <Badge variant={reward.status === "available" ? "outline" : "secondary"} className={reward.status === "available" ? "border-green-500 text-green-500" : ""}>
                              {reward.status}
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
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <AddPromotionDialog 
        open={isAddPromotionOpen} 
        onOpenChange={setIsAddPromotionOpen}
        onSuccess={fetchData}
      />
      
      <AddOfferDialog 
        open={isAddOfferOpen} 
        onOpenChange={setIsAddOfferOpen}
        onSuccess={fetchData}
      />
      
      <AddRewardDialog 
        open={isAddRewardOpen} 
        onOpenChange={setIsAddRewardOpen}
        onSuccess={fetchData}
      />
      
      {selectedPromotion && (
        <EditPromotionDialog 
          open={isEditPromotionOpen} 
          onOpenChange={setIsEditPromotionOpen}
          onSuccess={fetchData}
          promotion={selectedPromotion}
        />
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{promotionToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeletePromotion}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default AdminPromotions;
