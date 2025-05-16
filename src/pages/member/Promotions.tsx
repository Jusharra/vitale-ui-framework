import React, { useState, useEffect } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Tag, Calendar, Gift, Clock } from 'lucide-react';

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  reward_amount: number;
  expires_at: string;
  status: string;
  target_audience?: string;
  terms_conditions?: string;
}

interface PromotionClaim {
  id: string;
  promotion_id: string;
  claimed_at: string;
  status: string;
}

const Promotions = () => {
  const { user, membershipTier } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [claimedPromotions, setClaimedPromotions] = useState<PromotionClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, [user]);

  const fetchPromotions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch active promotions
      const { data: promotionsData, error: promotionsError } = await supabase
        .from('promotions')
        .select('*')
        .eq('status', 'active')
        .gt('expires_at', new Date().toISOString());
      
      if (promotionsError) throw promotionsError;
      
      // Fetch user's claimed promotions
      const { data: claimsData, error: claimsError } = await supabase
        .from('promotion_claims')
        .select('*')
        .eq('profile_id', user.id);
      
      if (claimsError) throw claimsError;
      
      setPromotions(promotionsData || []);
      setClaimedPromotions(claimsData || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load promotions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimPromotion = async (promotionId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to claim this promotion',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('promotion_claims')
        .insert({
          promotion_id: promotionId,
          profile_id: user.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: 'Promotion Claimed',
        description: 'Your promotion has been successfully claimed',
      });
      
      // Update local state
      setClaimedPromotions([...claimedPromotions, data]);
    } catch (error) {
      console.error('Error claiming promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to claim promotion',
        variant: 'destructive',
      });
    }
  };

  // Filter promotions based on search query
  const filteredPromotions = promotions.filter(promo => 
    promo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get claimed promotion IDs
  const claimedPromotionIds = claimedPromotions.map(claim => claim.promotion_id);

  // Filter available and claimed promotions
  const availablePromotions = filteredPromotions.filter(promo => 
    !claimedPromotionIds.includes(promo.id)
  );
  
  const userClaimedPromotions = filteredPromotions.filter(promo => 
    claimedPromotionIds.includes(promo.id)
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get discount based on membership tier
  const getMembershipDiscount = () => {
    switch (membershipTier) {
      case 'vip':
        return 20;
      case 'core':
        return 10;
      default:
        return 5;
    }
  };

  return (
    <MemberPageLayout 
      title="Promotions & Offers" 
      description="Discover exclusive promotions and special offers"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search promotions..." 
            className="pl-8 w-full md:w-[300px]" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {membershipTier?.toUpperCase() || 'SMART'} Member
          </Badge>
          <Badge variant="outline">
            {getMembershipDiscount()}% Extra Discount
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="available" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="available" className="flex gap-2 items-center">
            <Tag className="h-4 w-4" />
            <span>Available</span>
          </TabsTrigger>
          <TabsTrigger value="claimed" className="flex gap-2 items-center">
            <Gift className="h-4 w-4" />
            <span>Claimed</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="available" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : availablePromotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePromotions.map((promotion) => (
                <Card key={promotion.id} className="overflow-hidden">
                  <div className="bg-primary/10 h-2"></div>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{promotion.title}</CardTitle>
                      <Badge variant="outline">{promotion.type}</Badge>
                    </div>
                    <CardDescription>{promotion.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Expires: {formatDate(promotion.expires_at)}</span>
                        </div>
                        <div className="text-lg font-bold">${promotion.reward_amount}</div>
                      </div>
                      
                      {promotion.target_audience && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Eligible: </span>
                          {promotion.target_audience}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handleClaimPromotion(promotion.id)}
                    >
                      Claim Promotion
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Available Promotions</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  There are no promotions available at the moment. Check back soon for new offers!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="claimed" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : userClaimedPromotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userClaimedPromotions.map((promotion) => {
                const claim = claimedPromotions.find(c => c.promotion_id === promotion.id);
                return (
                  <Card key={promotion.id} className="overflow-hidden">
                    <div className="bg-green-500 h-2"></div>
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{promotion.title}</CardTitle>
                        <Badge>{claim?.status || 'claimed'}</Badge>
                      </div>
                      <CardDescription>{promotion.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>Claimed: {claim ? formatDate(claim.claimed_at) : 'Recently'}</span>
                          </div>
                          <div className="text-lg font-bold">${promotion.reward_amount}</div>
                        </div>
                        
                        {promotion.terms_conditions && (
                          <div className="text-sm text-muted-foreground mt-2">
                            <span className="font-medium">Terms: </span>
                            {promotion.terms_conditions}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        disabled={claim?.status !== 'approved'}
                      >
                        {claim?.status === 'approved' ? 'Use Promotion' : 'Processing'}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Gift className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Claimed Promotions</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You haven't claimed any promotions yet. Browse available promotions and claim them to see them here.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setActiveTab('available')}
                >
                  View Available Promotions
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Promotions;